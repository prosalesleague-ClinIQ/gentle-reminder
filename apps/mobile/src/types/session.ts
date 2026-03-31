/**
 * Session types for mobile app.
 * Re-exports shared types and adds mobile-specific extensions.
 */
export type {
  Session,
  SessionStatus,
  SessionPhase,
  CreateSessionInput,
  CompleteSessionInput,
  SessionSummary,
  ExerciseResultSummary,
} from '@gentle-reminder/shared-types';

/** Mobile session state machine states */
export type SessionMachineState =
  | 'IDLE'
  | 'STARTING'
  | 'ORIENTATION'
  | 'IDENTITY'
  | 'MEMORY'
  | 'COMPLETING'
  | 'COMPLETED'
  | 'ABANDONED';

/** Current exercise tracking within a session */
export interface CurrentExerciseState {
  exerciseIndex: number;
  totalExercises: number;
  attemptNumber: number;
  startedAt: number;
}

/** Session progress for UI display */
export interface SessionProgress {
  currentPhase: SessionMachineState;
  exercisesCompleted: number;
  totalExercises: number;
  elapsedSeconds: number;
  percentComplete: number;
}

/** Session completion data */
export interface SessionCompletionData {
  sessionId: string;
  durationSeconds: number;
  exercisesCompleted: number;
  overallScore: number;
  celebratedCount: number;
  guidedCount: number;
  supportedCount: number;
  completionMessage: string;
}
