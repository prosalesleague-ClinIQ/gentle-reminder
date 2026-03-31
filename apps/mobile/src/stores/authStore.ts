import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { User } from '@gentle-reminder/shared-types';
import { authService } from '../services/auth.service';
import { ACCESS_TOKEN_KEY } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  /** Initialize auth state from secure storage */
  initialize: () => Promise<void>;

  /** Log in with email and password */
  login: (email: string, password: string) => Promise<void>;

  /** Register a new account */
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string,
  ) => Promise<void>;

  /** Log out and clear stored tokens */
  logout: () => Promise<void>;

  /** Clear any auth error */
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true });
    try {
      const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      if (token) {
        const user = await authService.getCurrentUser();
        set({ user, isAuthenticated: true, isInitialized: true, isLoading: false });
      } else {
        set({ isInitialized: true, isLoading: false });
      }
    } catch {
      // Token may be expired or invalid
      set({ isInitialized: true, isLoading: false, isAuthenticated: false, user: null });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.login({ email, password });
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  register: async (email, password, firstName, lastName, role) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.register({
        email,
        password,
        firstName,
        lastName,
        role,
      });
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
