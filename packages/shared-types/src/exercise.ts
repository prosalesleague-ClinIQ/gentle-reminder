export enum ExerciseType {
  ORIENTATION_DATE = 'orientation_date',
  ORIENTATION_NAME = 'orientation_name',
  ORIENTATION_LOCATION = 'orientation_location',
  IDENTITY_RECOGNITION = 'identity_recognition',
  MEMORY_SEQUENCE = 'memory_sequence',
  MEMORY_OBJECT = 'memory_object',
  MEMORY_CATEGORY = 'memory_category',
}

export enum FeedbackType {
  CELEBRATED = 'celebrated',
  GUIDED = 'guided',
  SUPPORTED = 'supported',
}

export enum CognitiveDomain {
  ORIENTATION = 'orientation',
  IDENTITY = 'identity',
  MEMORY = 'memory',
  LANGUAGE = 'language',
  EXECUTIVE_FUNCTION = 'executive_function',
  ATTENTION = 'attention',
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  domain: CognitiveDomain;
  prompt: string;
  expectedAnswer: string;
  options?: string[];
  difficulty: number;
  metadata?: Record<string, unknown>;
}

export interface ExerciseResult {
  id: string;
  sessionId: string;
  exerciseId: string;
  exerciseType: ExerciseType;
  domain: CognitiveDomain;
  prompt: string;
  expectedAnswer: string;
  givenAnswer: string;
  isCorrect: boolean;
  responseTimeMs: number;
  feedbackType: FeedbackType;
  score: number;
  attemptNumber: number;
  createdAt: Date;
}

export interface CreateExerciseResultInput {
  sessionId: string;
  exerciseType: ExerciseType;
  domain: CognitiveDomain;
  prompt: string;
  expectedAnswer: string;
  givenAnswer: string;
  isCorrect: boolean;
  responseTimeMs: number;
  feedbackType: FeedbackType;
  score: number;
  attemptNumber?: number;
}

export interface CognitiveScore {
  id: string;
  patientId: string;
  sessionId: string;
  overallScore: number;
  orientationScore: number;
  identityScore: number;
  memoryScore: number;
  languageScore: number;
  executiveFunctionScore: number;
  attentionScore: number;
  recordedAt: Date;
}

export interface ExercisePrompt {
  type: ExerciseType;
  domain: CognitiveDomain;
  prompt: string;
  expectedAnswer: string;
  options?: string[];
  hints?: string[];
  photoUrl?: string;
  audioUrl?: string;
}
