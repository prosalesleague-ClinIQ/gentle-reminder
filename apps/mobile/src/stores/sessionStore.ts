import { create } from 'zustand';
import {
  SessionPhase,
  FeedbackType,
  type ExerciseResult,
  type Session,
} from '@gentle-reminder/shared-types';
import type { SessionMachineState, CurrentExerciseState } from '../types/session';
import { sessionService } from '../services/session.service';
import { exerciseService } from '../services/exercise.service';
import { TOTAL_EXERCISES_PER_SESSION } from '../constants/exercises';

interface SessionState {
  /** Current session from API */
  session: Session | null;

  /** State machine phase */
  phase: SessionMachineState;

  /** Current exercise tracking */
  currentExercise: CurrentExerciseState | null;

  /** Accumulated exercise results for the session */
  results: ExerciseResult[];

  /** Session elapsed time in seconds */
  elapsedSeconds: number;

  /** Whether session is in progress */
  isActive: boolean;

  /** Loading state */
  isLoading: boolean;

  /** Error state */
  error: string | null;

  /** Start a new session */
  startSession: (patientId: string) => Promise<void>;

  /** Advance to the next phase */
  advancePhase: () => void;

  /** Set current exercise index */
  setCurrentExercise: (index: number, totalExercises: number) => void;

  /** Record an exercise result */
  addResult: (result: ExerciseResult) => void;

  /** Increment attempt number for current exercise */
  incrementAttempt: () => void;

  /** Update elapsed time */
  setElapsedSeconds: (seconds: number) => void;

  /** Complete the session */
  completeSession: () => Promise<void>;

  /** Abandon the session */
  abandonSession: () => Promise<void>;

  /** Reset session state to idle */
  resetSession: () => void;
}

const PHASE_ORDER: SessionMachineState[] = [
  'IDLE',
  'STARTING',
  'ORIENTATION',
  'IDENTITY',
  'MEMORY',
  'COMPLETING',
  'COMPLETED',
];

export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  phase: 'IDLE',
  currentExercise: null,
  results: [],
  elapsedSeconds: 0,
  isActive: false,
  isLoading: false,
  error: null,

  startSession: async (patientId) => {
    set({ isLoading: true, error: null });
    try {
      const session = await sessionService.startSession({ patientId });
      set({
        session,
        phase: 'STARTING',
        isActive: true,
        isLoading: false,
        results: [],
        elapsedSeconds: 0,
        currentExercise: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start session';
      set({ isLoading: false, error: message });
    }
  },

  advancePhase: () => {
    const { phase } = get();
    const currentIndex = PHASE_ORDER.indexOf(phase);
    if (currentIndex >= 0 && currentIndex < PHASE_ORDER.length - 1) {
      const nextPhase = PHASE_ORDER[currentIndex + 1];
      set({ phase: nextPhase });
    }
  },

  setCurrentExercise: (index, totalExercises) => {
    set({
      currentExercise: {
        exerciseIndex: index,
        totalExercises,
        attemptNumber: 1,
        startedAt: Date.now(),
      },
    });
  },

  addResult: (result) => {
    set((state) => ({
      results: [...state.results, result],
    }));
  },

  incrementAttempt: () => {
    set((state) => ({
      currentExercise: state.currentExercise
        ? { ...state.currentExercise, attemptNumber: state.currentExercise.attemptNumber + 1 }
        : null,
    }));
  },

  setElapsedSeconds: (seconds) => {
    set({ elapsedSeconds: seconds });
  },

  completeSession: async () => {
    const { session } = get();
    if (!session) return;

    set({ phase: 'COMPLETING', isLoading: true });
    try {
      await sessionService.completeSession({ sessionId: session.id });
      set({ phase: 'COMPLETED', isActive: false, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to complete session';
      set({ isLoading: false, error: message });
    }
  },

  abandonSession: async () => {
    const { session } = get();
    if (!session) return;

    try {
      await sessionService.abandonSession(session.id);
    } catch {
      // Best effort - still mark locally abandoned
    }
    set({
      phase: 'ABANDONED',
      isActive: false,
      isLoading: false,
    });
  },

  resetSession: () => {
    set({
      session: null,
      phase: 'IDLE',
      currentExercise: null,
      results: [],
      elapsedSeconds: 0,
      isActive: false,
      isLoading: false,
      error: null,
    });
  },
}));

/** Selector: get session progress for UI */
export const selectSessionProgress = (state: SessionState) => ({
  currentPhase: state.phase,
  exercisesCompleted: state.results.length,
  totalExercises: TOTAL_EXERCISES_PER_SESSION,
  elapsedSeconds: state.elapsedSeconds,
  percentComplete: Math.round(
    (state.results.length / TOTAL_EXERCISES_PER_SESSION) * 100,
  ),
});

/** Selector: get feedback counts */
export const selectFeedbackCounts = (state: SessionState) => ({
  celebrated: state.results.filter((r) => r.feedbackType === FeedbackType.CELEBRATED).length,
  guided: state.results.filter((r) => r.feedbackType === FeedbackType.GUIDED).length,
  supported: state.results.filter((r) => r.feedbackType === FeedbackType.SUPPORTED).length,
});
