/**
 * Cognitive State Engine - Type Definitions
 *
 * Core types for classifying and responding to the cognitive state
 * of dementia patients based on multimodal signal analysis.
 */

export enum CognitiveState {
  CALM = 'CALM',
  CONFUSED = 'CONFUSED',
  ANXIOUS = 'ANXIOUS',
  DISORIENTED = 'DISORIENTED',
  AGITATED = 'AGITATED',
  SAD = 'SAD',
  ENGAGED = 'ENGAGED',
}

/**
 * Result of cognitive state classification, including confidence
 * and the signals that contributed to the determination.
 */
export interface StateClassification {
  state: CognitiveState;
  confidence: number; // 0-1 scale
  triggerSource: SignalSource;
  signals: SignalContribution[];
  timestamp: number;
}

export type SignalSource = 'speech' | 'behavior' | 'biometric' | 'combined';

export interface SignalContribution {
  source: SignalSource;
  state: CognitiveState;
  score: number;
  weight: number;
}

/**
 * Speech-derived features extracted from patient audio.
 * These biomarkers help detect confusion, anxiety, and sadness.
 */
export interface SpeechFeatures {
  /** Words per minute */
  speechRate: number;
  /** Number of hesitation markers (um, uh, er) detected */
  hesitationCount: number;
  /** Average pause duration in milliseconds */
  pauseDurationMs: number;
  /** Variance in fundamental frequency (Hz) */
  pitchVariance: number;
  /** Count of questions asked more than once in a session */
  repeatedQuestions: number;
}

/**
 * Behavioral features derived from activity monitoring.
 */
export interface BehaviorFeatures {
  /** Activity level 0-100 scale */
  activityLevel: number;
  /** How closely daily routine matches established patterns (0-1) */
  routineAdherence: number;
  /** Social interaction frequency score (0-100) */
  socialInteraction: number;
  /** Whether wandering behavior has been detected */
  wanderingFlag: boolean;
}

/**
 * Biometric features from wearable devices or health sensors.
 */
export interface BiometricFeatures {
  /** Beats per minute */
  heartRate: number;
  /** Heart rate variability in milliseconds (RMSSD) */
  heartRateVariability: number;
  /** Sleep quality score 0-100 */
  sleepQuality: number;
  /** Daily activity level 0-100 */
  activityLevel: number;
}

/**
 * Adaptive response generated for the AI companion based on
 * the patient's current cognitive state.
 */
export interface AdaptiveResponse {
  /** Communication tone to use */
  tone: ResponseTone;
  /** High-level interaction strategy */
  strategy: InteractionStrategy;
  /** Specific guidelines for the AI to follow */
  guidelines: string[];
  /** Pre-written fallback message if AI generation fails */
  fallbackMessage: string;
}

export type ResponseTone =
  | 'warm'
  | 'calm'
  | 'reassuring'
  | 'gentle'
  | 'empathetic'
  | 'cheerful';

export type InteractionStrategy =
  | 'normal_conversation'
  | 'identity_reinforcement'
  | 'anxiety_reduction'
  | 'grounding'
  | 'de_escalation'
  | 'emotional_support'
  | 'engagement';

/**
 * Scores for each cognitive state produced by a signal processor.
 */
export type StateScores = Record<CognitiveState, number>;

/**
 * Configuration for signal weight tuning.
 */
export interface SignalWeights {
  speech: number;
  behavior: number;
  biometric: number;
}

/**
 * Thresholds for state classification confidence.
 */
export interface ClassificationThresholds {
  /** Minimum score to consider a state as a candidate */
  minimumScore: number;
  /** Minimum confidence to return a definitive classification */
  highConfidence: number;
  /** Below this, classification is considered uncertain */
  lowConfidence: number;
}
