import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

/**
 * Auth hook wrapping the auth store.
 * Provides a simplified interface for components.
 */
export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    initialize,
    login,
    logout,
    clearError,
  } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      await login(email, password);
    },
    [login],
  );

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    login: handleLogin,
    logout: handleLogout,
    clearError,
  };
}
