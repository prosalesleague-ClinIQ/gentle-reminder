// Types
export type {
  BehavioralSignal,
  BiomarkerResult,
  SignalWindow,
  BiomarkerConfig,
  DeclineAlert,
} from './types';

// Analyzers
export { analyzeRoutineDisruption } from './analyzers/RoutineAnalyzer';
export { analyzeSleepIrregularity } from './analyzers/SleepAnalyzer';
export { analyzeResponseDelay } from './analyzers/ResponseTimeAnalyzer';
export { analyzeMedicationAdherence } from './analyzers/MedicationAdherenceAnalyzer';
export { analyzeSpeechHesitation } from './analyzers/SpeechBiomarker';

// Scoring
export {
  computeCompositeBiomarkerScore,
  computeTrend,
  DEFAULT_WEIGHTS,
} from './scoring/BiomarkerEngine';
export type { CompositeScore } from './scoring/BiomarkerEngine';

export {
  detectDecline,
  DEFAULT_DECLINE_CONFIG,
} from './scoring/DeclineDetector';
export type {
  DeclineDetectorConfig,
  TimestampedScore,
} from './scoring/DeclineDetector';
