import { BehavioralSignal, BiomarkerResult } from '../types';

/**
 * Analyzes cognitive response delay from exercise response times.
 *
 * Expects signals with signalType "response_time" where value is
 * the response time in milliseconds.
 *
 * Output: cognitive delay score 0-1 (higher = slower/more concerning).
 */

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

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

/**
 * Compute a linear trend slope from ordered values.
 * Returns the slope per sample (positive = increasing/slowing).
 */
function linearSlope(values: number[]): number {
  if (values.length < 2) return 0;
  const n = values.length;
  const xMean = (n - 1) / 2;
  const yMean = mean(values);
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * (values[i] - yMean);
    den += (i - xMean) ** 2;
  }
  return den === 0 ? 0 : num / den;
}

export function analyzeResponseDelay(signals: BehavioralSignal[]): BiomarkerResult {
  const responseSignals = signals
    .filter(s => s.signalType === 'response_time')
    .sort((a, b) => a.recordedAt.getTime() - b.recordedAt.getTime());

  if (responseSignals.length < 3) {
    return {
      type: 'cognitive_delay',
      score: 0,
      confidence: 0,
      trend: 'insufficient_data',
      metadata: { reason: 'Not enough response time signals' },
    };
  }

  const times = responseSignals.map(s => s.value);

  // Baseline: expected healthy response time range
  // Under 2000ms is normal, 2000-5000ms is concerning, 5000+ is alarming
  const medianTime = median(times);
  const meanTime = mean(times);

  // Normalize mean to 0-1 scale (0-5000ms range)
  const baseScore = Math.min(meanTime / 5000, 1);

  // Variance penalty: high variance indicates inconsistency
  const cv = meanTime > 0 ? stdDev(times) / meanTime : 0;
  const variancePenalty = Math.min(cv / 2, 0.3);

  // Trend: if responses are getting slower, increase score
  const slope = linearSlope(times);
  const trendPenalty = slope > 0
    ? Math.min((slope / meanTime) * 2, 0.2)
    : 0;

  const score = Math.min(1, baseScore + variancePenalty + trendPenalty);

  const confidence = Math.min(1, responseSignals.length / 20);

  // Determine trend direction
  const trendThreshold = meanTime * 0.05;
  let trend: BiomarkerResult['trend'];
  if (slope > trendThreshold) {
    trend = 'declining'; // Getting slower = declining cognitive function
  } else if (slope < -trendThreshold) {
    trend = 'improving';
  } else {
    trend = 'stable';
  }

  return {
    type: 'cognitive_delay',
    score: Math.round(score * 1000) / 1000,
    confidence: Math.round(confidence * 1000) / 1000,
    trend,
    metadata: {
      meanResponseMs: Math.round(meanTime),
      medianResponseMs: Math.round(medianTime),
      stdDevMs: Math.round(stdDev(times)),
      slopePerSample: Math.round(slope * 100) / 100,
      sampleCount: responseSignals.length,
    },
  };
}
