import { CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';

export interface ExerciseResultInput {
  domain: CognitiveDomain;
  score: number;
  responseTimeMs: number;
  feedbackType: FeedbackType;
  isCorrect: boolean;
}

export interface SessionScores {
  overallScore: number;
  orientationScore: number;
  identityScore: number;
  memoryScore: number;
  languageScore: number;
  executiveFunctionScore: number;
  attentionScore: number;
}

export interface CognitiveMetrics {
  averageScore: number;
  averageResponseTimeMs: number;
  completionRate: number;
  celebratedCount: number;
  guidedCount: number;
  supportedCount: number;
  totalExercises: number;
}
