/**
 * @gentle-reminder/cognitive-state
 *
 * Cognitive state classification engine for the Gentle Reminder
 * dementia care platform. Analyzes multimodal signals (speech,
 * behavior, biometric) to classify a patient's cognitive state
 * and generate adaptive AI response policies.
 */

// Core types
export {
  CognitiveState,
  type StateClassification,
  type SpeechFeatures,
  type BehaviorFeatures,
  type BiometricFeatures,
  type AdaptiveResponse,
  type StateScores,
  type SignalSource,
  type SignalContribution,
  type SignalWeights,
  type ClassificationThresholds,
  type ResponseTone,
  type InteractionStrategy,
} from './types';

// Main engine
export { CognitiveStateEngine } from './CognitiveStateEngine';

// Signal processors
export { processSpeechSignals } from './signals/SpeechSignalProcessor';
export { processBehaviorSignals } from './signals/BehaviorSignalProcessor';
export { processBiometricSignals } from './signals/BiometricSignalProcessor';

// Response adaptation
export { ResponsePolicyManager } from './adaptation/ResponsePolicyManager';

// Sundowning detection
export {
  detectSundowningRisk,
  getEveningRoutineSteps,
  type SundowningSignals,
  type SundowningRisk,
} from './SundowningDetector';
