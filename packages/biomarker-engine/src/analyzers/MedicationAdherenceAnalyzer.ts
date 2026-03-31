import { BehavioralSignal, BiomarkerResult } from '../types';

/**
 * Analyzes medication adherence from reminder acknowledgment signals.
 *
 * Expects signals with signalType:
 * - "medication_due" - a scheduled medication reminder (value = 1)
 * - "medication_taken" - patient acknowledged taking medication (value = 1)
 * - "medication_missed" - medication was not taken within window (value = 1)
 *
 * Output: adherence reliability 0-1 (1 = perfect adherence, 0 = no adherence).
 */

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  const variance = values.reduce((sum, v) => sum + (v - m) ** 2, 0) / values.length;
  return Math.sqrt(variance);
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

export function analyzeMedicationAdherence(signals: BehavioralSignal[]): BiomarkerResult {
  const dueSignals = signals.filter(s => s.signalType === 'medication_due');
  const takenSignals = signals.filter(s => s.signalType === 'medication_taken');
  const missedSignals = signals.filter(s => s.signalType === 'medication_missed');

  const totalDue = dueSignals.length + missedSignals.length + takenSignals.length;

  if (totalDue < 3) {
    return {
      type: 'medication_adherence',
      score: 1,
      confidence: 0,
      trend: 'insufficient_data',
      metadata: { reason: 'Not enough medication signals' },
    };
  }

  // Simple adherence rate: taken / (taken + missed)
  const relevantTotal = takenSignals.length + missedSignals.length;
  const adherenceRate = relevantTotal > 0
    ? takenSignals.length / relevantTotal
    : 1;

  // Consistency: check daily adherence rates
  const byDate = groupByDate([...takenSignals, ...missedSignals]);
  const dailyRates: number[] = [];
  for (const [, daySignals] of byDate) {
    const dayTaken = daySignals.filter(s => s.signalType === 'medication_taken').length;
    const dayTotal = daySignals.length;
    dailyRates.push(dayTotal > 0 ? dayTaken / dayTotal : 1);
  }

  // Consistency penalty: high variability in daily adherence is concerning
  const consistencyVar = dailyRates.length >= 2 ? stdDev(dailyRates) : 0;
  const consistencyPenalty = Math.min(consistencyVar * 0.3, 0.15);

  // Missed dose streak detection: consecutive days with misses
  const dates = [...byDate.keys()].sort();
  let maxConsecutiveMissDays = 0;
  let currentStreak = 0;
  for (const date of dates) {
    const daySignals = byDate.get(date)!;
    const hasMiss = daySignals.some(s => s.signalType === 'medication_missed');
    if (hasMiss) {
      currentStreak++;
      maxConsecutiveMissDays = Math.max(maxConsecutiveMissDays, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  // Streak penalty: 3+ consecutive miss days is concerning
  const streakPenalty = Math.min(maxConsecutiveMissDays / 7, 0.2);

  // Score is adherence rate minus penalties (higher = better)
  const score = Math.max(0, Math.min(1, adherenceRate - consistencyPenalty - streakPenalty));

  const confidence = Math.min(1, relevantTotal / 20);

  return {
    type: 'medication_adherence',
    score: Math.round(score * 1000) / 1000,
    confidence: Math.round(confidence * 1000) / 1000,
    trend: 'stable',
    metadata: {
      adherenceRate: Math.round(adherenceRate * 1000) / 1000,
      totalDoses: relevantTotal,
      takenCount: takenSignals.length,
      missedCount: missedSignals.length,
      maxConsecutiveMissDays,
      daysTracked: byDate.size,
    },
  };
}
