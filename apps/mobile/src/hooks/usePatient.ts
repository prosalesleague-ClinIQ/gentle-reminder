import { useEffect, useCallback } from 'react';
import { usePatientStore } from '../stores/patientStore';
import { useAuthStore } from '../stores/authStore';

/** Cache duration: 5 minutes */
const CACHE_DURATION_MS = 5 * 60 * 1000;

/**
 * Patient data hook.
 * Automatically fetches patient profile when authenticated.
 */
export function usePatient() {
  const user = useAuthStore((s) => s.user);
  const {
    profile,
    familyMembers,
    memories,
    isLoadingProfile,
    isLoadingFamily,
    isLoadingMemories,
    error,
    fetchProfile,
    fetchFamilyMembers,
    fetchMemories,
    fetchAll,
    lastProfileFetch,
    clear,
  } = usePatientStore();

  const patientId = profile?.id;

  // Auto-fetch profile on mount if stale or missing
  useEffect(() => {
    if (!user) return;

    const isStale =
      !lastProfileFetch || Date.now() - lastProfileFetch > CACHE_DURATION_MS;

    if (isStale && !isLoadingProfile) {
      // Use user ID to fetch their patient profile
      fetchProfile(user.id);
    }
  }, [user, lastProfileFetch, isLoadingProfile, fetchProfile]);

  const refreshProfile = useCallback(() => {
    if (user) {
      fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  const refreshFamily = useCallback(() => {
    if (patientId) {
      fetchFamilyMembers(patientId);
    }
  }, [patientId, fetchFamilyMembers]);

  const refreshMemories = useCallback(() => {
    if (patientId) {
      fetchMemories(patientId);
    }
  }, [patientId, fetchMemories]);

  const refreshAll = useCallback(() => {
    if (patientId) {
      fetchAll(patientId);
    }
  }, [patientId, fetchAll]);

  return {
    profile,
    patientId,
    familyMembers,
    memories,
    isLoading: isLoadingProfile || isLoadingFamily || isLoadingMemories,
    isLoadingProfile,
    isLoadingFamily,
    isLoadingMemories,
    error,
    refreshProfile,
    refreshFamily,
    refreshMemories,
    refreshAll,
    clear,
  };
}
