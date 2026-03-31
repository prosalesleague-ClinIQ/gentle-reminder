import { ExerciseType, SessionPhase } from '@gentle-reminder/shared-types';

/**
 * Session and exercise configuration constants.
 */

/** Maximum session duration in seconds (15 minutes) */
export const MAX_SESSION_DURATION_SECONDS = 15 * 60;

/** Warning threshold before session timeout in seconds (2 minutes before max) */
export const SESSION_WARNING_THRESHOLD_SECONDS = MAX_SESSION_DURATION_SECONDS - 2 * 60;

/** Default session duration target in seconds (10 minutes) */
export const DEFAULT_SESSION_DURATION_SECONDS = 10 * 60;

/** Minimum session duration to count as completed in seconds */
export const MIN_SESSION_DURATION_SECONDS = 60;

/**
 * Default exercise order within a session.
 * Orientation first (grounding), then identity (social), then memory (cognitive).
 */
export const DEFAULT_EXERCISE_ORDER: ExerciseType[] = [
  ExerciseType.ORIENTATION_DATE,
  ExerciseType.ORIENTATION_NAME,
  ExerciseType.ORIENTATION_LOCATION,
  ExerciseType.IDENTITY_RECOGNITION,
  ExerciseType.MEMORY_CATEGORY,
  ExerciseType.MEMORY_OBJECT,
];

/**
 * Maps session phases to their corresponding exercise types.
 */
export const PHASE_EXERCISES: Record<string, ExerciseType[]> = {
  [SessionPhase.ORIENTATION]: [
    ExerciseType.ORIENTATION_DATE,
    ExerciseType.ORIENTATION_NAME,
    ExerciseType.ORIENTATION_LOCATION,
  ],
  [SessionPhase.IDENTITY]: [
    ExerciseType.IDENTITY_RECOGNITION,
  ],
  [SessionPhase.MEMORY]: [
    ExerciseType.MEMORY_CATEGORY,
    ExerciseType.MEMORY_OBJECT,
  ],
};

/**
 * Ordered list of session phases (for navigation).
 */
export const SESSION_PHASE_ORDER: SessionPhase[] = [
  SessionPhase.STARTING,
  SessionPhase.ORIENTATION,
  SessionPhase.IDENTITY,
  SessionPhase.MEMORY,
  SessionPhase.COMPLETING,
  SessionPhase.COMPLETED,
];

/** Number of exercises per orientation phase */
export const ORIENTATION_EXERCISE_COUNT = 3;

/** Number of exercises per identity phase */
export const IDENTITY_EXERCISE_COUNT = 1;

/** Number of exercises per memory phase */
export const MEMORY_EXERCISE_COUNT = 2;

/** Total exercises per session */
export const TOTAL_EXERCISES_PER_SESSION =
  ORIENTATION_EXERCISE_COUNT + IDENTITY_EXERCISE_COUNT + MEMORY_EXERCISE_COUNT;

/** Maximum number of attempts per exercise before moving on */
export const MAX_ATTEMPTS_PER_EXERCISE = 2;

/** Delay between exercises in ms */
export const INTER_EXERCISE_DELAY_MS = 1500;

// Re-export from accessibility for convenience
export { AUTO_ADVANCE_DELAY_MS } from './accessibility';
