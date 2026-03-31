import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';

export interface ExerciseConfig {
  type: ExerciseType;
  domain: CognitiveDomain;
}

export interface GeneratedPrompt {
  type: ExerciseType;
  domain: CognitiveDomain;
  prompt: string;
  expectedAnswer: string;
  acceptableAnswers: string[];
  options?: string[];
  hints: string[];
  photoUrl?: string;
}

export interface AnswerEvaluation {
  isCorrect: boolean;
  feedbackType: FeedbackType;
  score: number;
  feedbackMessage: string;
  correctAnswer: string;
}

export interface PatientContext {
  preferredName: string;
  city: string;
  timezone: string;
  familyMembers: {
    displayName: string;
    relationship: string;
    photoUrl?: string;
  }[];
}
