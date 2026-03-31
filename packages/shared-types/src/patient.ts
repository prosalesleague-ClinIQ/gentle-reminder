export enum CognitiveStage {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  UNKNOWN = 'unknown',
}

export interface Patient {
  id: string;
  userId: string;
  dateOfBirth: Date;
  diagnosisDate?: Date;
  cognitiveStage: CognitiveStage;
  preferredName: string;
  city: string;
  timezone: string;
  primaryLanguage: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePatientInput {
  userId: string;
  dateOfBirth: string;
  diagnosisDate?: string;
  cognitiveStage?: CognitiveStage;
  preferredName: string;
  city: string;
  timezone?: string;
  primaryLanguage?: string;
  notes?: string;
}

export interface UpdatePatientInput {
  cognitiveStage?: CognitiveStage;
  preferredName?: string;
  city?: string;
  timezone?: string;
  primaryLanguage?: string;
  notes?: string;
}

export interface PatientProfile extends Patient {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profilePhotoUrl?: string;
  };
  familyMembers: FamilyMemberSummary[];
  recentCognitiveScore?: CognitiveScoreSummary;
}

export interface FamilyMemberSummary {
  id: string;
  displayName: string;
  relationship: string;
  photoUrl?: string;
}

export interface CognitiveScoreSummary {
  overallScore: number;
  orientationScore: number;
  identityScore: number;
  memoryScore: number;
  recordedAt: Date;
}
