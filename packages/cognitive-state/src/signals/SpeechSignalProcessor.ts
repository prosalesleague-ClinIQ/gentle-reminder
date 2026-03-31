import { CognitiveState, SpeechFeatures, StateScores } from '../types';

/**
 * Processes speech-derived biomarkers to produce cognitive state scores.
 *
 * Key mappings:
 * - High hesitation + repeated questions => CONFUSED
 * - Fast speech + high pitch variance => ANXIOUS
 * - Low speech rate + long pauses => SAD
 * - Normal ranges with engagement cues => ENGAGED or CALM
 */

/** Normal baseline ranges for speech features */
const BASELINE = {
  speechRate: { low: 80, normal: 130, high: 180 },
  hesitationCount: { low: 0, moderate: 3, high: 8 },
  pauseDurationMs: { short: 300, normal: 700, long: 1500 },
  pitchVariance: { low: 10, normal: 30, high: 60 },
  repeatedQuestions: { none: 0, some: 1, many: 3 },
} as const;

/**
 * Normalize a value into a 0-1 score based on where it falls
 * relative to a threshold range. Values at or beyond `high`
 * return 1.0; values at or below `low` return 0.0.
 */
function normalizeScore(value: number, low: number, high: number): number {
  if (high === low) return value >= high ? 1.0 : 0.0;
  return Math.max(0, Math.min(1, (value - low) / (high - low)));
}

export function processSpeechSignals(features: SpeechFeatures): StateScores {
  const scores: StateScores = {
    [CognitiveState.CALM]: 0,
    [CognitiveState.CONFUSED]: 0,
    [CognitiveState.ANXIOUS]: 0,
    [CognitiveState.DISORIENTED]: 0,
    [CognitiveState.AGITATED]: 0,
    [CognitiveState.SAD]: 0,
    [CognitiveState.ENGAGED]: 0,
  };

  const {
    speechRate,
    hesitationCount,
    pauseDurationMs,
    pitchVariance,
    repeatedQuestions,
  } = features;

  // --- CONFUSED ---
  // High hesitation and repeated questions are strong indicators
  const hesitationScore = normalizeScore(
    hesitationCount,
    BASELINE.hesitationCount.moderate,
    BASELINE.hesitationCount.high
  );
  const repetitionScore = normalizeScore(
    repeatedQuestions,
    BASELINE.repeatedQuestions.some,
    BASELINE.repeatedQuestions.many
  );
  scores[CognitiveState.CONFUSED] = hesitationScore * 0.5 + repetitionScore * 0.5;

  // --- ANXIOUS ---
  // Fast speech combined with high pitch variance
  const fastSpeechScore = normalizeScore(
    speechRate,
    BASELINE.speechRate.normal,
    BASELINE.speechRate.high
  );
  const highPitchScore = normalizeScore(
    pitchVariance,
    BASELINE.pitchVariance.normal,
    BASELINE.pitchVariance.high
  );
  scores[CognitiveState.ANXIOUS] = fastSpeechScore * 0.5 + highPitchScore * 0.5;

  // --- SAD ---
  // Low speech rate combined with long pauses
  const slowSpeechScore = normalizeScore(
    BASELINE.speechRate.normal - speechRate,
    0,
    BASELINE.speechRate.normal - BASELINE.speechRate.low
  );
  const longPauseScore = normalizeScore(
    pauseDurationMs,
    BASELINE.pauseDurationMs.normal,
    BASELINE.pauseDurationMs.long
  );
  scores[CognitiveState.SAD] = slowSpeechScore * 0.5 + longPauseScore * 0.5;

  // --- AGITATED ---
  // Very fast speech with high hesitation (frustrated pattern)
  const veryFastScore = normalizeScore(
    speechRate,
    BASELINE.speechRate.high,
    BASELINE.speechRate.high * 1.3
  );
  scores[CognitiveState.AGITATED] =
    veryFastScore * 0.4 + highPitchScore * 0.3 + hesitationScore * 0.3;

  // --- DISORIENTED ---
  // Repeated questions with moderate hesitation (less intense than confused)
  scores[CognitiveState.DISORIENTED] =
    repetitionScore * 0.6 + hesitationScore * 0.2 + longPauseScore * 0.2;

  // --- ENGAGED ---
  // Moderate-to-normal speech rate, low hesitation, normal pauses
  const normalRateScore =
    1.0 -
    Math.abs(speechRate - BASELINE.speechRate.normal) /
      (BASELINE.speechRate.high - BASELINE.speechRate.low);
  const lowHesitationScore = 1.0 - hesitationScore;
  scores[CognitiveState.ENGAGED] =
    Math.max(0, normalRateScore) * 0.5 + lowHesitationScore * 0.5;

  // --- CALM ---
  // Inverse of all distress signals
  const maxDistress = Math.max(
    scores[CognitiveState.CONFUSED],
    scores[CognitiveState.ANXIOUS],
    scores[CognitiveState.SAD],
    scores[CognitiveState.AGITATED]
  );
  scores[CognitiveState.CALM] = Math.max(0, 1.0 - maxDistress);

  return scores;
}
