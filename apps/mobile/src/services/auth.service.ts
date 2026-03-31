import { api } from './api';
import type {
  AuthTokens,
  LoginInput,
  RegisterInput,
  User,
} from '@gentle-reminder/shared-types';

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
}

/**
 * Authentication service - handles login, registration, and token refresh.
 */
export const authService = {
  /**
   * Log in with email and password.
   */
  async login(input: LoginInput): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', input, {
      skipAuth: true,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Login failed');
    }

    await api.setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
    return response.data;
  },

  /**
   * Register a new user account.
   */
  async register(input: RegisterInput): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', input, {
      skipAuth: true,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Registration failed');
    }

    await api.setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
    return response.data;
  },

  /**
   * Refresh the access token using the stored refresh token.
   */
  async refreshToken(): Promise<AuthTokens | null> {
    const response = await api.post<AuthTokens>('/auth/refresh', undefined, {
      skipAuth: true,
    });

    if (!response.success || !response.data) {
      return null;
    }

    await api.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  },

  /**
   * Get the currently authenticated user's profile.
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get user profile');
    }

    return response.data;
  },

  /**
   * Log out - clears tokens from secure storage.
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Logout endpoint may fail, that is fine
    } finally {
      await api.clearTokens();
    }
  },
};
