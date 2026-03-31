import { BehavioralSignal, BiomarkerResult } from '../types';

/**
 * Analyzes speech hesitation from speech analysis signals.
 *
 * Expects signals with signalType:
 * - "hesitation_count" - number of hesitations in a speech sample (value = count)
 * - "pause_duration" - total pause duration in seconds (value = seconds)
 * - "speech_rate" - words per minute (value = wpm)
 *
 * Output: speech hesitation index 0-1 (0 = fluent, 1 = severely impaired).
 */

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

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

export function analyzeSpeechHesitation(signals: BehavioralSignal[]): BiomarkerResult {
  const hesitations = signals
    .filter(s => s.signalType === 'hesitation_count')
    .sort((a, b) => a.recordedAt.getTime() - b.recordedAt.getTime());

  const pauses = signals
    .filter(s => s.signalType === 'pause_duration')
    .sort((a, b) => a.recordedAt.getTime() - b.recordedAt.getTime());

  const speechRates = signals
    .filter(s => s.signalType === 'speech_rate')
    .sort((a, b) => a.recordedAt.getTime() - b.recordedAt.getTime());

  const totalSamples = hesitations.length + pauses.length + speechRates.length;

  if (totalSamples < 3) {
    return {
      type: 'speech_hesitation',
      score: 0,
      confidence: 0,
      trend: 'insufficient_data',
      metadata: { reason: 'Not enough speech signals' },
    };
  }

  // Hesitation score: average hesitations normalized (0-10+ range mapped to 0-1)
  const avgHesitations = hesitations.length > 0
    ? mean(hesitations.map(s => s.value))
    : 0;
  const hesitationScore = Math.min(avgHesitations / 10, 1);

  // Pause duration score: average pause normalized (0-30s range mapped to 0-1)
  const avgPauseDuration = pauses.length > 0
    ? mean(pauses.map(s => s.value))
    : 0;
  const pauseScore = Math.min(avgPauseDuration / 30, 1);

  // Speech rate score: lower rate = higher concern
  // Normal range: 120-180 wpm. Below 80 is concerning.
  const avgSpeechRate = speechRates.length > 0
    ? mean(speechRates.map(s => s.value))
    : 150; // default to normal
  const rateScore = avgSpeechRate >= 150
    ? 0
    : Math.min((150 - avgSpeechRate) / 100, 1);

  // Weighted combination
  const hasHesitations = hesitations.length > 0;
  const hasPauses = pauses.length > 0;
  const hasRates = speechRates.length > 0;

  let score: number;
  const weights: number[] = [];
  const scores: number[] = [];

  if (hasHesitations) { weights.push(0.4); scores.push(hesitationScore); }
  if (hasPauses) { weights.push(0.35); scores.push(pauseScore); }
  if (hasRates) { weights.push(0.25); scores.push(rateScore); }

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  score = scores.reduce((sum, s, i) => sum + s * weights[i], 0) / totalWeight;

  // Trend from hesitation counts over time
  let trend: BiomarkerResult['trend'] = 'stable';
  if (hesitations.length >= 3) {
    const slope = linearSlope(hesitations.map(s => s.value));
    const avgVal = mean(hesitations.map(s => s.value));
    const threshold = Math.max(avgVal * 0.1, 0.5);
    if (slope > threshold) {
      trend = 'declining';
    } else if (slope < -threshold) {
      trend = 'improving';
    }
  }

  const confidence = Math.min(1, totalSamples / 15);

  return {
    type: 'speech_hesitation',
    score: Math.round(score * 1000) / 1000,
    confidence: Math.round(confidence * 1000) / 1000,
    trend,
    metadata: {
      avgHesitations: Math.round(avgHesitations * 100) / 100,
      avgPauseDurationSec: Math.round(avgPauseDuration * 100) / 100,
      avgSpeechRateWpm: Math.round(avgSpeechRate * 100) / 100,
      sampleCount: totalSamples,
    },
  };
}
