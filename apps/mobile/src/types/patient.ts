/**
 * Patient types for mobile app.
 * Re-exports shared types and adds mobile-specific extensions.
 */
export type {
  Patient,
  PatientProfile,
  CognitiveScoreSummary,
  FamilyMemberSummary,
  CognitiveStage,
  CreatePatientInput,
  UpdatePatientInput,
} from '@gentle-reminder/shared-types';

/** Mobile-specific patient display data */
export interface PatientDisplayInfo {
  preferredName: string;
  profilePhotoUrl?: string;
  greetingName: string;
  city: string;
  cognitiveStageLabel: string;
  lastSessionDate?: string;
  lastScore?: number;
}

/** Patient profile loaded state for mobile */
export interface MobilePatientState {
  profile: import('@gentle-reminder/shared-types').PatientProfile | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}
