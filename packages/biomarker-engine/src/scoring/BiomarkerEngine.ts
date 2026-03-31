import { BehavioralSignal, BiomarkerResult, BiomarkerConfig } from '../types';
import { analyzeRoutineDisruption } from '../analyzers/RoutineAnalyzer';
import { analyzeSleepIrregularity } from '../analyzers/SleepAnalyzer';
import { analyzeResponseDelay } from '../analyzers/ResponseTimeAnalyzer';
import { analyzeMedicationAdherence } from '../analyzers/MedicationAdherenceAnalyzer';
import { analyzeSpeechHesitation } from '../analyzers/SpeechBiomarker';

/**
 * Default weights for the composite cognitive health score.
 */
export const DEFAULT_WEIGHTS: Record<string, number> = {
  routine_disruption: 0.15,
  sleep_irregularity: 0.15,
  cognitive_delay: 0.25,
  medication_adherence: 0.15,
  speech_hesitation: 0.30,
};

export interface CompositeScore {
  /** Overall cognitive health score 0-1 (0 = healthy, 1 = severe concern). */
  overall: number;
  /** Overall confidence 0-1. */
  confidence: number;
  /** Trend direction based on historical comparison. */
  trend: BiomarkerResult['trend'];
  /** Individual biomarker results. */
  individual: BiomarkerResult[];
}

/**
 * Filter signals by type category.
 */
function filterByTypes(signals: BehavioralSignal[], types: string[]): BehavioralSignal[] {
  return signals.filter(s => types.includes(s.signalType));
}

/**
 * Compute the composite biomarker score from all available signals.
 *
 * Each analyzer processes its relevant signals. Results are weighted
 * and combined into an overall score. Analyzers with insufficient data
 * are excluded and their weights redistributed.
 */
export function computeCompositeBiomarkerScore(
  allSignals: BehavioralSignal[],
  config?: Partial<BiomarkerConfig>
): CompositeScore {
  const weights = config?.weights ?? DEFAULT_WEIGHTS;

  // Run each analyzer on its relevant signal types
  const routineResult = analyzeRoutineDisruption(
    filterByTypes(allSignals, ['wake', 'sleep_end', 'meal', 'activity'])
  );

  const sleepResult = analyzeSleepIrregularity(
    filterByTypes(allSignals, ['sleep_start', 'sleep_end', 'wake_count'])
  );

  const responseResult = analyzeResponseDelay(
    filterByTypes(allSignals, ['response_time'])
  );

  // Medication adherence: invert score since 1 = good adherence but we want 1 = concern
  const medResult = analyzeMedicationAdherence(
    filterByTypes(allSignals, ['medication_due', 'medication_taken', 'medication_missed'])
  );

  const speechResult = analyzeSpeechHesitation(
    filterByTypes(allSignals, ['hesitation_count', 'pause_duration', 'speech_rate'])
  );

  const allResults = [routineResult, sleepResult, responseResult, medResult, speechResult];
  const individual = allResults;

  // Filter out results with insufficient data for scoring
  const validResults = allResults.filter(r => r.trend !== 'insufficient_data');

  if (validResults.length === 0) {
    return {
      overall: 0,
      confidence: 0,
      trend: 'insufficient_data',
      individual,
    };
  }

  // Build weighted score, redistributing weight from missing analyzers
  let totalWeight = 0;
  let weightedScore = 0;
  let weightedConfidence = 0;

  for (const result of validResults) {
    const w = weights[result.type] ?? 0;

    // For medication adherence, invert: 1 (perfect adherence) => 0 concern
    const adjustedScore = result.type === 'medication_adherence'
      ? 1 - result.score
      : result.score;

    totalWeight += w;
    weightedScore += adjustedScore * w;
    weightedConfidence += result.confidence * w;
  }

  const overall = totalWeight > 0
    ? Math.round((weightedScore / totalWeight) * 1000) / 1000
    : 0;

  const confidence = totalWeight > 0
    ? Math.round((weightedConfidence / totalWeight) * 1000) / 1000
    : 0;

  // Determine overall trend from individual trends
  const trendCounts = { improving: 0, stable: 0, declining: 0 };
  for (const r of validResults) {
    if (r.trend === 'improving' || r.trend === 'stable' || r.trend === 'declining') {
      trendCounts[r.trend]++;
    }
  }

  let trend: BiomarkerResult['trend'];
  if (trendCounts.declining > trendCounts.improving && trendCounts.declining > trendCounts.stable) {
    trend = 'declining';
  } else if (trendCounts.improving > trendCounts.declining && trendCounts.improving > trendCounts.stable) {
    trend = 'improving';
  } else {
    trend = 'stable';
  }

  return { overall, confidence, trend, individual };
}

/**
 * Compute trend direction from current score compared to previous scores.
 *
 * @param currentScore - The latest composite score (0-1).
 * @param previousScores - Array of previous scores ordered oldest to newest.
 * @param threshold - Minimum absolute change to count as non-stable (default 0.05).
 */
export function computeTrend(
  currentScore: number,
  previousScores: number[],
  threshold = 0.05
): 'improving' | 'stable' | 'declining' {
  if (previousScores.length === 0) return 'stable';

  const recentAvg = previousScores.length <= 3
    ? previousScores.reduce((a, b) => a + b, 0) / previousScores.length
    : previousScores.slice(-3).reduce((a, b) => a + b, 0) / 3;

  const change = currentScore - recentAvg;

  // In our scoring, higher = more concern, so positive change = declining
  if (change > threshold) return 'declining';
  if (change < -threshold) return 'improving';
  return 'stable';
}
