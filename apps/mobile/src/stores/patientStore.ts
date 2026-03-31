import { create } from 'zustand';
import type { PatientProfile, FamilyMember, Memory } from '@gentle-reminder/shared-types';
import { api } from '../services/api';
import { familyService } from '../services/family.service';
import { memoryService } from '../services/memory.service';

interface PatientState {
  /** Patient profile data */
  profile: PatientProfile | null;

  /** Family members list */
  familyMembers: FamilyMember[];

  /** Memories list */
  memories: Memory[];

  /** Loading states */
  isLoadingProfile: boolean;
  isLoadingFamily: boolean;
  isLoadingMemories: boolean;

  /** Error state */
  error: string | null;

  /** Last data fetch timestamps */
  lastProfileFetch: number | null;
  lastFamilyFetch: number | null;
  lastMemoriesFetch: number | null;

  /** Fetch patient profile */
  fetchProfile: (patientId: string) => Promise<void>;

  /** Fetch family members */
  fetchFamilyMembers: (patientId: string) => Promise<void>;

  /** Fetch memories */
  fetchMemories: (patientId: string) => Promise<void>;

  /** Fetch all patient data */
  fetchAll: (patientId: string) => Promise<void>;

  /** Clear patient data (on logout) */
  clear: () => void;
}

export const usePatientStore = create<PatientState>((set, get) => ({
  profile: null,
  familyMembers: [],
  memories: [],
  isLoadingProfile: false,
  isLoadingFamily: false,
  isLoadingMemories: false,
  error: null,
  lastProfileFetch: null,
  lastFamilyFetch: null,
  lastMemoriesFetch: null,

  fetchProfile: async (patientId) => {
    set({ isLoadingProfile: true, error: null });
    try {
      const response = await api.get<PatientProfile>(`/patients/${patientId}`);
      if (response.success && response.data) {
        set({
          profile: response.data,
          isLoadingProfile: false,
          lastProfileFetch: Date.now(),
        });
      } else {
        throw new Error(response.error?.message || 'Failed to load profile');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load profile';
      set({ isLoadingProfile: false, error: message });
    }
  },

  fetchFamilyMembers: async (patientId) => {
    set({ isLoadingFamily: true, error: null });
    try {
      const members = await familyService.getFamilyMembers(patientId);
      set({
        familyMembers: members,
        isLoadingFamily: false,
        lastFamilyFetch: Date.now(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load family';
      set({ isLoadingFamily: false, error: message });
    }
  },

  fetchMemories: async (patientId) => {
    set({ isLoadingMemories: true, error: null });
    try {
      const { memories } = await memoryService.getMemories(patientId);
      set({
        memories,
        isLoadingMemories: false,
        lastMemoriesFetch: Date.now(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load memories';
      set({ isLoadingMemories: false, error: message });
    }
  },

  fetchAll: async (patientId) => {
    const { fetchProfile, fetchFamilyMembers, fetchMemories } = get();
    await Promise.all([
      fetchProfile(patientId),
      fetchFamilyMembers(patientId),
      fetchMemories(patientId),
    ]);
  },

  clear: () => {
    set({
      profile: null,
      familyMembers: [],
      memories: [],
      isLoadingProfile: false,
      isLoadingFamily: false,
      isLoadingMemories: false,
      error: null,
      lastProfileFetch: null,
      lastFamilyFetch: null,
      lastMemoriesFetch: null,
    });
  },
}));
