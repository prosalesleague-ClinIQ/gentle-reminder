/**
 * Exercise types for mobile app.
 * Re-exports shared types and adds mobile-specific extensions.
 */
export type {
  Exercise,
  ExerciseType,
  ExerciseResult,
  ExercisePrompt,
  CognitiveScore,
  FeedbackType,
  CognitiveDomain,
  CreateExerciseResultInput,
} from '@gentle-reminder/shared-types';

export type {
  GeneratedPrompt,
  AnswerEvaluation,
  PatientContext,
} from '@gentle-reminder/cognitive-engine';

/** Mobile exercise display state */
export interface ExerciseDisplayState {
  prompt: string;
  options: string[];
  hints: string[];
  photoUrl?: string;
  selectedAnswer: string | null;
  showFeedback: boolean;
  feedbackType: import('@gentle-reminder/shared-types').FeedbackType | null;
  feedbackMessage: string | null;
  isSubmitting: boolean;
}

/** Exercise answer submission */
export interface ExerciseAnswerSubmission {
  exerciseType: import('@gentle-reminder/shared-types').ExerciseType;
  givenAnswer: string;
  responseTimeMs: number;
  attemptNumber: number;
}
