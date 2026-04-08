import { Platform } from 'react-native';

/**
 * Authentication Service for Gentle Reminder mobile app.
 *
 * Manages JWT-based authentication with the API server.
 * Stores tokens securely and handles refresh.
 * Falls back to demo mode when API is unavailable.
 */

export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  role: string | null;
  patientName: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isDemoMode: boolean;
}

export interface LoginResult {
  success: boolean;
  error?: string;
  user?: {
    userId: string;
    email: string;
    role: string;
    patientName: string;
  };
}

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const TOKEN_STORAGE_KEY = '@gr_auth_tokens';

// Demo user for development/offline
const DEMO_USER = {
  userId: 'demo-patient-margaret',
  email: 'margaret@demo.gentlereminder.app',
  role: 'patient',
  patientName: 'Margaret',
};

class AuthService {
  private static instance: AuthService;
  private state: AuthState = {
    isAuthenticated: false,
    userId: null,
    email: null,
    role: null,
    patientName: null,
    accessToken: null,
    refreshToken: null,
    isDemoMode: false,
  };
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Initialize auth — load stored tokens and validate.
   */
  async initialize(): Promise<AuthState> {
    try {
      const stored = await this.loadTokens();
      if (stored?.accessToken) {
        const valid = await this.validateToken(stored.accessToken);
        if (valid) {
          this.state = { ...this.state, ...stored, isAuthenticated: true };
          this.scheduleRefresh();
          return this.state;
        }
      }
    } catch {}

    // Default to demo mode
    return this.loginDemo();
  }

  /**
   * Login with email and password.
   */
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message || 'Login failed' };
      }

      const data = await response.json();
      this.state = {
        isAuthenticated: true,
        userId: data.data.user.userId,
        email: data.data.user.email,
        role: data.data.user.role,
        patientName: data.data.user.displayName || data.data.user.email,
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
        isDemoMode: false,
      };

      await this.saveTokens();
      this.scheduleRefresh();

      return {
        success: true,
        user: {
          userId: this.state.userId!,
          email: this.state.email!,
          role: this.state.role!,
          patientName: this.state.patientName!,
        },
      };
    } catch {
      // Network error — fall back to demo
      return this.loginDemoResult();
    }
  }

  /**
   * Login in demo mode (no server required).
   */
  loginDemo(): AuthState {
    this.state = {
      isAuthenticated: true,
      userId: DEMO_USER.userId,
      email: DEMO_USER.email,
      role: DEMO_USER.role,
      patientName: DEMO_USER.patientName,
      accessToken: 'demo-token',
      refreshToken: null,
      isDemoMode: true,
    };
    return this.state;
  }

  /**
   * Logout and clear stored tokens.
   */
  async logout(): Promise<void> {
    this.state = {
      isAuthenticated: false,
      userId: null,
      email: null,
      role: null,
      patientName: null,
      accessToken: null,
      refreshToken: null,
      isDemoMode: false,
    };

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    await this.clearTokens();
  }

  /**
   * Get current auth state.
   */
  getState(): AuthState {
    return { ...this.state };
  }

  /**
   * Get the access token for API calls.
   */
  getAccessToken(): string | null {
    return this.state.accessToken;
  }

  isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  isDemoMode(): boolean {
    return this.state.isDemoMode;
  }

  // ── Internal ────────────────────────────────────────────────

  private async validateToken(token: string): Promise<boolean> {
    if (token === 'demo-token') return true;
    try {
      const response = await fetch(`${API_BASE}/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.state.refreshToken || this.state.isDemoMode) return false;

    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.state.refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      this.state.accessToken = data.data.accessToken;
      if (data.data.refreshToken) {
        this.state.refreshToken = data.data.refreshToken;
      }
      await this.saveTokens();
      return true;
    } catch {
      return false;
    }
  }

  private scheduleRefresh(): void {
    if (this.state.isDemoMode) return;
    // Refresh token every 14 minutes (tokens typically expire in 15)
    this.refreshTimer = setTimeout(async () => {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        this.scheduleRefresh();
      }
    }, 14 * 60 * 1000);
  }

  private loginDemoResult(): LoginResult {
    this.loginDemo();
    return {
      success: true,
      user: DEMO_USER,
    };
  }

  private async saveTokens(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify({
          accessToken: this.state.accessToken,
          refreshToken: this.state.refreshToken,
          userId: this.state.userId,
          email: this.state.email,
          role: this.state.role,
          patientName: this.state.patientName,
        }));
      } else {
        const SecureStore = require('expo-secure-store');
        await SecureStore.setItemAsync(TOKEN_STORAGE_KEY, JSON.stringify({
          accessToken: this.state.accessToken,
          refreshToken: this.state.refreshToken,
          userId: this.state.userId,
          email: this.state.email,
          role: this.state.role,
          patientName: this.state.patientName,
        }));
      }
    } catch {}
  }

  private async loadTokens(): Promise<Partial<AuthState> | null> {
    try {
      let stored: string | null = null;
      if (Platform.OS === 'web') {
        stored = localStorage.getItem(TOKEN_STORAGE_KEY);
      } else {
        const SecureStore = require('expo-secure-store');
        stored = await SecureStore.getItemAsync(TOKEN_STORAGE_KEY);
      }
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private async clearTokens(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } else {
        const SecureStore = require('expo-secure-store');
        await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY);
      }
    } catch {}
  }
}

export const authService = AuthService.getInstance();
export { AuthService };
