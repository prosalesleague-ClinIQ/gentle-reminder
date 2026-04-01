import { Platform } from 'react-native';
import type { ApiResponse } from '@gentle-reminder/shared-types';
import { config, IS_DEMO_MODE } from '../config';

const API_BASE_URL = config.api.url;

const ACCESS_TOKEN_KEY = 'gentle_reminder_access_token';
const REFRESH_TOKEN_KEY = 'gentle_reminder_refresh_token';

// ---------------------------------------------------------------------------
// Secure storage abstraction (expo-secure-store unavailable on web)
// ---------------------------------------------------------------------------

let SecureStore: typeof import('expo-secure-store') | null = null;

async function loadSecureStore() {
  if (SecureStore) return SecureStore;
  if (Platform.OS === 'web') return null;
  try {
    SecureStore = await import('expo-secure-store');
    return SecureStore;
  } catch {
    return null;
  }
}

async function getSecureItem(key: string): Promise<string | null> {
  const store = await loadSecureStore();
  if (!store) return null;
  try {
    return await store.getItemAsync(key);
  } catch {
    return null;
  }
}

async function setSecureItem(key: string, value: string): Promise<void> {
  const store = await loadSecureStore();
  if (!store) return;
  await store.setItemAsync(key, value);
}

async function deleteSecureItem(key: string): Promise<void> {
  const store = await loadSecureStore();
  if (!store) return;
  await store.deleteItemAsync(key);
}

// ---------------------------------------------------------------------------
// Demo data helpers
// ---------------------------------------------------------------------------

function demoResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

function demoError(message: string): ApiResponse<never> {
  return { success: false, error: { code: 'DEMO_MODE', message } };
}

const DEMO_DATA: Record<string, unknown> = {
  '/patients/me': {
    id: 'demo-patient',
    name: config.demo.patientName,
    preferredName: config.demo.preferredName,
    city: config.demo.city,
  },
  '/sessions': [],
  '/medications': [
    { id: 'med-1', name: 'Donepezil', dosage: '10mg', frequency: 'daily', time: '08:00' },
    { id: 'med-2', name: 'Memantine', dosage: '5mg', frequency: 'daily', time: '20:00' },
  ],
  '/biomarkers/latest': {
    overall: 0.35,
    trend: 'stable',
    individual: [],
  },
};

function getDemoData<T>(endpoint: string): ApiResponse<T> {
  // Match known demo endpoints
  for (const [path, data] of Object.entries(DEMO_DATA)) {
    if (endpoint.startsWith(path)) {
      return demoResponse(data as T);
    }
  }
  return demoError(`No demo data for ${endpoint}`);
}

// ---------------------------------------------------------------------------
// Request options
// ---------------------------------------------------------------------------

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  skipAuth?: boolean;
  /** Number of retry attempts for transient failures (default: 2). */
  retries?: number;
}

// ---------------------------------------------------------------------------
// API Client
// ---------------------------------------------------------------------------

class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getAccessToken(): Promise<string | null> {
    return getSecureItem(ACCESS_TOKEN_KEY);
  }

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await setSecureItem(ACCESS_TOKEN_KEY, accessToken);
    await setSecureItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  async clearTokens(): Promise<void> {
    await deleteSecureItem(ACCESS_TOKEN_KEY);
    await deleteSecureItem(REFRESH_TOKEN_KEY);
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const refreshToken = await getSecureItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) return null;

        const response = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          await this.clearTokens();
          return null;
        }

        const data = await response.json();
        if (data.success && data.data) {
          await this.setTokens(data.data.accessToken, data.data.refreshToken);
          return data.data.accessToken as string;
        }

        return null;
      } catch {
        return null;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    // In demo mode, return local demo data instead of hitting the network
    if (IS_DEMO_MODE) {
      return getDemoData<T>(endpoint);
    }

    const {
      body,
      skipAuth = false,
      retries = 2,
      headers: customHeaders,
      ...rest
    } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(customHeaders as Record<string, string>),
    };

    if (!skipAuth) {
      const token = await this.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const url = `${this.baseUrl}${endpoint}`;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        let response = await fetch(url, {
          ...rest,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        // Handle 401 - attempt token refresh
        if (response.status === 401 && !skipAuth) {
          const newToken = await this.refreshAccessToken();
          if (newToken) {
            headers['Authorization'] = `Bearer ${newToken}`;
            response = await fetch(url, {
              ...rest,
              headers,
              body: body ? JSON.stringify(body) : undefined,
            });
          } else {
            return {
              success: false,
              error: { code: 'UNAUTHORIZED', message: 'Session expired. Please log in again.' },
            };
          }
        }

        const data = await response.json();
        return data as ApiResponse<T>;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Only retry on network-level errors, not on HTTP error responses
        if (attempt < retries) {
          // Exponential backoff: 500ms, 1000ms
          await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
          continue;
        }
      }
    }

    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect. Please check your internet connection.',
      },
    };
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  async patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE_URL!);
export { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY };
