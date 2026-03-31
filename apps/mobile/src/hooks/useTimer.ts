import { useCallback, useEffect, useRef, useState } from 'react';
import { MAX_SESSION_DURATION_SECONDS, SESSION_WARNING_THRESHOLD_SECONDS } from '../constants/exercises';

interface UseTimerOptions {
  /** Auto-start the timer on mount */
  autoStart?: boolean;
  /** Maximum duration in seconds (default: MAX_SESSION_DURATION_SECONDS) */
  maxDuration?: number;
  /** Callback when timer reaches warning threshold */
  onWarning?: () => void;
  /** Callback when timer reaches max duration */
  onTimeout?: () => void;
  /** Callback each tick with current seconds */
  onTick?: (seconds: number) => void;
}

/**
 * Session timer hook.
 * Tracks elapsed time and provides warning/timeout callbacks.
 */
export function useTimer(options: UseTimerOptions = {}) {
  const {
    autoStart = false,
    maxDuration = MAX_SESSION_DURATION_SECONDS,
    onWarning,
    onTimeout,
    onTick,
  } = options;

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasWarnedRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);

  const warningThreshold = maxDuration - 2 * 60; // 2 minutes before max

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (isRunning) return;
    startTimeRef.current = Date.now() - elapsedSeconds * 1000;
    setIsRunning(true);
  }, [isRunning, elapsedSeconds]);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setElapsedSeconds(0);
    setIsRunning(false);
    hasWarnedRef.current = false;
    startTimeRef.current = null;
  }, [clearTimer]);

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const seconds = Math.floor((now - (startTimeRef.current || now)) / 1000);
      setElapsedSeconds(seconds);
      onTick?.(seconds);

      // Warning check
      if (seconds >= warningThreshold && !hasWarnedRef.current) {
        hasWarnedRef.current = true;
        onWarning?.();
      }

      // Timeout check
      if (seconds >= maxDuration) {
        clearTimer();
        setIsRunning(false);
        onTimeout?.();
      }
    }, 1000);

    return clearTimer;
  }, [isRunning, maxDuration, warningThreshold, onWarning, onTimeout, onTick, clearTimer]);

  /** Format elapsed seconds as "M:SS" */
  const formattedTime = `${Math.floor(elapsedSeconds / 60)}:${String(
    elapsedSeconds % 60,
  ).padStart(2, '0')}`;

  /** Remaining seconds until max duration */
  const remainingSeconds = Math.max(0, maxDuration - elapsedSeconds);

  /** Format remaining as "M:SS" */
  const formattedRemaining = `${Math.floor(remainingSeconds / 60)}:${String(
    remainingSeconds % 60,
  ).padStart(2, '0')}`;

  return {
    elapsedSeconds,
    remainingSeconds,
    formattedTime,
    formattedRemaining,
    isRunning,
    start,
    pause,
    reset,
  };
}
