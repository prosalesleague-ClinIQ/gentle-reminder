import { BehavioralSignal, BiomarkerResult } from '../types';

/**
 * Analyzes sleep irregularity from sleep-related signals.
 *
 * Expects signals with signalType:
 * - "sleep_start" - bedtime event (value = hour as fractional, e.g. 22.5 = 10:30 PM)
 * - "sleep_end" - wake event (value = hour as fractional)
 * - "wake_count" - number of times woken during the night (value = count)
 *
 * Output: sleep irregularity index 0-1 (0 = perfectly regular, 1 = highly irregular).
 */

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Group signals by calendar date. */
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

export function analyzeSleepIrregularity(signals: BehavioralSignal[]): BiomarkerResult {
  const sleepStarts = signals.filter(s => s.signalType === 'sleep_start');
  const sleepEnds = signals.filter(s => s.signalType === 'sleep_end');
  const wakeCounts = signals.filter(s => s.signalType === 'wake_count');

  if (sleepStarts.length < 2 && sleepEnds.length < 2) {
    return {
      type: 'sleep_irregularity',
      score: 0,
      confidence: 0,
      trend: 'insufficient_data',
      metadata: { reason: 'Not enough sleep signals' },
    };
  }

  // Sleep duration consistency - compute std dev of sleep start times
  const startHours = sleepStarts.map(s => s.value);
  const endHours = sleepEnds.map(s => s.value);

  // Normalize bedtimes: hours > 12 are evening, < 12 are early morning
  // Convert to a continuous scale where 22:00 = -2, 23:00 = -1, 0:00 = 0, 1:00 = 1
  const normalizedStarts = startHours.map(h => (h > 12 ? h - 24 : h));
  const normalizedEnds = endHours.map(h => h);

  // Bedtime variability (std dev in hours, capped contribution at 4h)
  const bedtimeVar = normalizedStarts.length >= 2
    ? Math.min(stdDev(normalizedStarts) / 4, 1)
    : 0;

  // Wake time variability
  const wakeVar = normalizedEnds.length >= 2
    ? Math.min(stdDev(normalizedEnds) / 4, 1)
    : 0;

  // Wake frequency score: average wakes per night normalized
  // 0 wakes = 0, 5+ wakes = 1
  const avgWakes = wakeCounts.length > 0 ? mean(wakeCounts.map(s => s.value)) : 0;
  const wakeFreqScore = Math.min(avgWakes / 5, 1);

  // Combined irregularity index
  const score = bedtimeVar * 0.35 + wakeVar * 0.35 + wakeFreqScore * 0.30;

  const totalSamples = sleepStarts.length + sleepEnds.length;
  const confidence = Math.min(1, totalSamples / 20);

  return {
    type: 'sleep_irregularity',
    score: Math.round(score * 1000) / 1000,
    confidence: Math.round(confidence * 1000) / 1000,
    trend: 'stable',
    metadata: {
      avgBedtime: normalizedStarts.length > 0
        ? Math.round(mean(startHours) * 100) / 100
        : null,
      avgWakeTime: normalizedEnds.length > 0
        ? Math.round(mean(endHours) * 100) / 100
        : null,
      avgNightWakes: Math.round(avgWakes * 100) / 100,
      sampleCount: totalSamples,
    },
  };
}
