import { BehavioralSignal, BiomarkerResult } from '../types';

/**
 * Analyzes routine disruption from timestamped activity signals.
 *
 * Examines consistency of daily patterns (wake time, meal time, activity windows).
 * Score 0 = perfect routine, 1 = completely disrupted.
 */

/** Extract the hour-of-day (fractional) from a Date. */
function fractionalHour(date: Date): number {
  return date.getHours() + date.getMinutes() / 60;
}

/** Group signals by calendar date (YYYY-MM-DD). */
function groupByDate(signals: BehavioralSignal[]): Map<string, BehavioralSignal[]> {
  const groups = new Map<string, BehavioralSignal[]>();
  for (const s of signals) {
    const key = s.recordedAt.toISOString().slice(0, 10);
    const arr = groups.get(key) ?? [];
    arr.push(s);
    groups.set(key, arr);
  }
  return groups;
}

/** Standard deviation of a number array. */
function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Compute routine disruption score from activity signals.
 *
 * Expects signals with signalType values such as:
 * - "wake" / "sleep_end" - morning wake events
 * - "meal" - meal activity
 * - "activity" - general daily activity
 *
 * The score is derived from the variability of first-activity times
 * and meal times across days.
 */
export function analyzeRoutineDisruption(signals: BehavioralSignal[]): BiomarkerResult {
  if (signals.length < 3) {
    return {
      type: 'routine_disruption',
      score: 0,
      confidence: 0,
      trend: 'insufficient_data',
      metadata: { reason: 'Not enough signals' },
    };
  }

  const byDate = groupByDate(signals);
  const dailyFirstActivity: number[] = [];
  const mealTimes: number[] = [];

  for (const [, daySignals] of byDate) {
    // Sort by time
    const sorted = [...daySignals].sort(
      (a, b) => a.recordedAt.getTime() - b.recordedAt.getTime()
    );

    // First activity of the day
    dailyFirstActivity.push(fractionalHour(sorted[0].recordedAt));

    // Collect meal times
    for (const s of sorted) {
      if (s.signalType === 'meal') {
        mealTimes.push(fractionalHour(s.recordedAt));
      }
    }
  }

  // Variability of first-activity time (std dev in hours, capped at 6h max)
  const wakeVariability = Math.min(stdDev(dailyFirstActivity) / 6, 1);

  // Variability of meal times
  const mealVariability = mealTimes.length >= 2
    ? Math.min(stdDev(mealTimes) / 6, 1)
    : 0;

  // Combined score: weight wake more heavily
  const score = Math.min(1, wakeVariability * 0.6 + mealVariability * 0.4);

  // Confidence based on number of days observed
  const numDays = byDate.size;
  const confidence = Math.min(1, numDays / 14);

  return {
    type: 'routine_disruption',
    score: Math.round(score * 1000) / 1000,
    confidence: Math.round(confidence * 1000) / 1000,
    trend: 'stable',
    metadata: {
      daysObserved: numDays,
      wakeVariabilityHours: Math.round(stdDev(dailyFirstActivity) * 100) / 100,
      mealVariabilityHours: mealTimes.length >= 2
        ? Math.round(stdDev(mealTimes) * 100) / 100
        : null,
    },
  };
}
