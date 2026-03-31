import { useCallback, useMemo } from 'react';
import {
  useSessionStore,
  selectSessionProgress,
  selectFeedbackCounts,
} from '../stores/sessionStore';
import type { SessionMachineState } from '../types/session';

/**
 * Session hook wrapping the session store.
 * Provides session lifecycle management for components.
 */
export function useSession() {
  const store = useSessionStore();

  const progress = useMemo(() => selectSessionProgress(store), [store]);
  const feedbackCounts = useMemo(() => selectFeedbackCounts(store), [store]);

  const startSession = useCallback(
    async (patientId: string) => {
      await store.startSession(patientId);
    },
    [store.startSession],
  );

  const advancePhase = useCallback(() => {
    store.advancePhase();
  }, [store.advancePhase]);

  const completeSession = useCallback(async () => {
    await store.completeSession();
  }, [store.completeSession]);

  const abandonSession = useCallback(async () => {
    await store.abandonSession();
  }, [store.abandonSession]);

  const resetSession = useCallback(() => {
    store.resetSession();
  }, [store.resetSession]);

  const isPhase = useCallback(
    (phase: SessionMachineState) => store.phase === phase,
    [store.phase],
  );

  return {
    session: store.session,
    phase: store.phase,
    currentExercise: store.currentExercise,
    results: store.results,
    elapsedSeconds: store.elapsedSeconds,
    isActive: store.isActive,
    isLoading: store.isLoading,
    error: store.error,
    progress,
    feedbackCounts,
    startSession,
    advancePhase,
    setCurrentExercise: store.setCurrentExercise,
    addResult: store.addResult,
    incrementAttempt: store.incrementAttempt,
    setElapsedSeconds: store.setElapsedSeconds,
    completeSession,
    abandonSession,
    resetSession,
    isPhase,
  };
}
