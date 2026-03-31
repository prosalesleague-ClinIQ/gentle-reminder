import { CognitiveState, BiometricFeatures, StateScores } from '../types';

/**
 * Processes biometric signals from wearable devices to produce
 * cognitive state scores.
 *
 * Key mappings:
 * - Elevated heart rate => ANXIOUS or AGITATED
 * - Poor sleep quality => at risk for CONFUSED
 * - Low HRV + elevated HR => stress / ANXIOUS
 * - Normal vitals + good sleep => CALM
 */

/** Baseline ranges for elderly dementia patients */
const BASELINE = {
  heartRate: { low: 55, restingNormal: 72, elevated: 90, high: 110 },
  hrv: { low: 15, normal: 35, good: 55 },
  sleepQuality: { poor: 30, fair: 50, good: 70 },
  activityLevel: { low: 15, moderate: 40, high: 70, veryHigh: 85 },
} as const;

function normalizeScore(value: number, low: number, high: number): number {
  if (high === low) return value >= high ? 1.0 : 0.0;
  return Math.max(0, Math.min(1, (value - low) / (high - low)));
}

export function processBiometricSignals(
  features: BiometricFeatures
): StateScores {
  const scores: StateScores = {
    [CognitiveState.CALM]: 0,
    [CognitiveState.CONFUSED]: 0,
    [CognitiveState.ANXIOUS]: 0,
    [CognitiveState.DISORIENTED]: 0,
    [CognitiveState.AGITATED]: 0,
    [CognitiveState.SAD]: 0,
    [CognitiveState.ENGAGED]: 0,
  };

  const { heartRate, heartRateVariability, sleepQuality, activityLevel } =
    features;

  // Derived scores
  const elevatedHRScore = normalizeScore(
    heartRate,
    BASELINE.heartRate.elevated,
    BASELINE.heartRate.high
  );
  const highHRScore = normalizeScore(
    heartRate,
    BASELINE.heartRate.high,
    BASELINE.heartRate.high + 20
  );
  const lowHRVScore = normalizeScore(
    BASELINE.hrv.normal - heartRateVariability,
    0,
    BASELINE.hrv.normal - BASELINE.hrv.low
  );
  const poorSleepScore = normalizeScore(
    BASELINE.sleepQuality.good - sleepQuality,
    0,
    BASELINE.sleepQuality.good - BASELINE.sleepQuality.poor
  );
  const lowActivityScore = normalizeScore(
    BASELINE.activityLevel.moderate - activityLevel,
    0,
    BASELINE.activityLevel.moderate - BASELINE.activityLevel.low
  );
  const highActivityScore = normalizeScore(
    activityLevel,
    BASELINE.activityLevel.high,
    BASELINE.activityLevel.veryHigh
  );

  // --- ANXIOUS ---
  // Elevated heart rate + low HRV = physiological stress
  scores[CognitiveState.ANXIOUS] =
    elevatedHRScore * 0.5 + lowHRVScore * 0.5;

  // --- AGITATED ---
  // Very high heart rate + high activity
  scores[CognitiveState.AGITATED] =
    highHRScore * 0.5 + highActivityScore * 0.5;

  // --- CONFUSED ---
  // Poor sleep is a major risk factor for confusion in dementia patients
  scores[CognitiveState.CONFUSED] =
    poorSleepScore * 0.6 + lowHRVScore * 0.2 + elevatedHRScore * 0.2;

  // --- SAD ---
  // Low activity + low heart rate (vegetative signs)
  const lowHRScore = normalizeScore(
    BASELINE.heartRate.restingNormal - heartRate,
    0,
    BASELINE.heartRate.restingNormal - BASELINE.heartRate.low
  );
  scores[CognitiveState.SAD] =
    lowActivityScore * 0.5 + lowHRScore * 0.3 + poorSleepScore * 0.2;

  // --- DISORIENTED ---
  // Poor sleep + elevated activity (nighttime restlessness pattern)
  scores[CognitiveState.DISORIENTED] =
    poorSleepScore * 0.5 + highActivityScore * 0.3 + elevatedHRScore * 0.2;

  // --- ENGAGED ---
  // Moderate activity with stable heart rate and decent HRV
  const normalHR =
    1.0 -
    Math.abs(heartRate - BASELINE.heartRate.restingNormal) /
      (BASELINE.heartRate.high - BASELINE.heartRate.low);
  const goodHRV = normalizeScore(
    heartRateVariability,
    BASELINE.hrv.normal,
    BASELINE.hrv.good
  );
  const moderateActivity =
    1.0 -
    Math.abs(activityLevel - BASELINE.activityLevel.moderate) /
      (BASELINE.activityLevel.high - BASELINE.activityLevel.low);
  scores[CognitiveState.ENGAGED] =
    Math.max(0, normalHR) * 0.3 +
    goodHRV * 0.3 +
    Math.max(0, moderateActivity) * 0.4;

  // --- CALM ---
  // Normal vitals across the board
  const goodSleep = normalizeScore(
    sleepQuality,
    BASELINE.sleepQuality.fair,
    BASELINE.sleepQuality.good
  );
  const noDistress = Math.max(0, 1.0 - Math.max(
    scores[CognitiveState.ANXIOUS],
    scores[CognitiveState.AGITATED],
    scores[CognitiveState.CONFUSED]
  ));
  scores[CognitiveState.CALM] =
    goodSleep * 0.3 + Math.max(0, normalHR) * 0.3 + noDistress * 0.4;

  return scores;
}
