import { AccelerometerReading } from './types';

const GRAVITY = 9.81;
const IMPACT_THRESHOLD = 3.0 * GRAVITY;  // 3g impact
const STILLNESS_THRESHOLD = 0.5;         // Very low acceleration variance
const STILLNESS_WINDOW_MS = 3000;        // 3 seconds of stillness after impact
const MIN_READINGS_FOR_DETECTION = 10;

/**
 * Computes the magnitude of a 3D accelerometer vector.
 */
function magnitude(reading: AccelerometerReading): number {
  return Math.sqrt(reading.x ** 2 + reading.y ** 2 + reading.z ** 2);
}

/**
 * Computes variance of an array of numbers.
 */
function variance(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  return values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (values.length - 1);
}

/**
 * Detects a fall from accelerometer data.
 *
 * Fall detection algorithm:
 * 1. Look for a sudden spike in acceleration magnitude (impact)
 * 2. Check for a period of stillness following the impact
 * 3. Assign confidence based on the sharpness of both the impact and the stillness
 */
export function detectFallRisk(
  accelerometerData: AccelerometerReading[]
): { isFall: boolean; confidence: number } {
  if (accelerometerData.length < MIN_READINGS_FOR_DETECTION) {
    return { isFall: false, confidence: 0 };
  }

  const magnitudes = accelerometerData.map(magnitude);

  // Find peak acceleration
  let peakIndex = 0;
  let peakMagnitude = 0;
  for (let i = 0; i < magnitudes.length; i++) {
    if (magnitudes[i] > peakMagnitude) {
      peakMagnitude = magnitudes[i];
      peakIndex = i;
    }
  }

  // Check if peak qualifies as an impact
  if (peakMagnitude < IMPACT_THRESHOLD) {
    return { isFall: false, confidence: 0 };
  }

  // Check for stillness after impact
  const impactTime = accelerometerData[peakIndex].timestamp;
  const postImpactReadings = accelerometerData.filter(
    (r) => r.timestamp > impactTime && r.timestamp <= impactTime + STILLNESS_WINDOW_MS
  );

  if (postImpactReadings.length < 3) {
    // Not enough data after impact to confirm
    return { isFall: false, confidence: 0.3 };
  }

  const postMagnitudes = postImpactReadings.map(magnitude);
  const postVariance = variance(postMagnitudes);
  const isStill = postVariance < STILLNESS_THRESHOLD;

  // Check for free-fall phase before impact (brief period of near-zero acceleration)
  let hasFreeFall = false;
  if (peakIndex >= 2) {
    const preMagnitudes = magnitudes.slice(
      Math.max(0, peakIndex - 5),
      peakIndex
    );
    const minPreMag = Math.min(...preMagnitudes);
    if (minPreMag < GRAVITY * 0.5) {
      hasFreeFall = true;
    }
  }

  // Calculate confidence
  let confidence = 0;

  // Impact strength contributes 0-0.4
  const impactScore = Math.min((peakMagnitude - IMPACT_THRESHOLD) / (2 * GRAVITY), 1);
  confidence += impactScore * 0.4;

  // Stillness after impact contributes 0-0.3
  if (isStill) {
    confidence += 0.3;
  } else {
    // Partial credit for low but not zero variance
    const stillnessScore = Math.max(0, 1 - postVariance / STILLNESS_THRESHOLD);
    confidence += stillnessScore * 0.15;
  }

  // Free-fall phase contributes 0-0.2
  if (hasFreeFall) {
    confidence += 0.2;
  }

  // Post-impact mean near gravity (lying still) contributes 0-0.1
  const postMean =
    postMagnitudes.reduce((sum, v) => sum + v, 0) / postMagnitudes.length;
  const nearGravity = Math.abs(postMean - GRAVITY) < 2;
  if (nearGravity) {
    confidence += 0.1;
  }

  confidence = Math.min(confidence, 1);

  const isFall = confidence >= 0.5 && isStill;

  return { isFall, confidence };
}

/**
 * Computes a fall risk score (0-1) from recent activity patterns.
 * Higher values indicate greater fall risk.
 */
export function getFallRiskScore(recentActivity: AccelerometerReading[]): number {
  if (recentActivity.length < 5) return 0;

  let risk = 0;

  const magnitudes = recentActivity.map(magnitude);
  const avgMag = magnitudes.reduce((sum, v) => sum + v, 0) / magnitudes.length;
  const magVariance = variance(magnitudes);

  // High variability in movement suggests instability (0-0.3)
  const instabilityScore = Math.min(magVariance / (GRAVITY * 2), 1);
  risk += instabilityScore * 0.3;

  // Very low average activity can indicate frailty (0-0.2)
  if (avgMag < GRAVITY * 1.1) {
    risk += 0.2;
  }

  // Count sudden accelerations (stumbles) (0-0.3)
  let stumbleCount = 0;
  for (let i = 1; i < magnitudes.length; i++) {
    const delta = Math.abs(magnitudes[i] - magnitudes[i - 1]);
    if (delta > GRAVITY * 1.5) {
      stumbleCount++;
    }
  }
  const stumbleRatio = stumbleCount / magnitudes.length;
  risk += Math.min(stumbleRatio * 3, 1) * 0.3;

  // Irregular timing between readings may indicate sensor issues (0-0.2)
  if (recentActivity.length >= 3) {
    const intervals: number[] = [];
    for (let i = 1; i < recentActivity.length; i++) {
      intervals.push(recentActivity[i].timestamp - recentActivity[i - 1].timestamp);
    }
    const intervalVariance = variance(intervals);
    const avgInterval =
      intervals.reduce((sum, v) => sum + v, 0) / intervals.length;
    if (avgInterval > 0 && intervalVariance / avgInterval > 0.5) {
      risk += 0.2;
    }
  }

  return Math.min(risk, 1);
}
