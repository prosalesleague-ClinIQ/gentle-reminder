// Exercises
export {
  generateDatePrompt,
  generateNamePrompt,
  generateLocationPrompt,
  generateMonthPrompt,
  evaluateOrientationAnswer,
} from './exercises/orientation';

export {
  generateIdentityPrompt,
  generateRelationshipPrompt,
  evaluateIdentityAnswer,
} from './exercises/identity';

export {
  generateCategoryPrompt,
  generateObjectPrompt,
  generateSequencePrompt,
  evaluateCategoryAnswer,
  evaluateObjectAnswer,
  evaluateSequenceAnswer,
} from './exercises/memory';

// Scoring
export {
  calculateSessionScores,
  calculateDomainScore,
  calculateCognitiveMetrics,
  getSessionCompletionMessage,
  detectFatigueSignals,
} from './scoring/gentle-scorer';

export { analyzeDeclineTrend } from './scoring/cognitive-metrics';

// Types
export type { GeneratedPrompt, AnswerEvaluation, PatientContext } from './exercises/types';
export type { ExerciseResultInput, SessionScores, CognitiveMetrics } from './scoring/types';
export type { DeclineTrend, DeclineAnalysis } from './scoring/cognitive-metrics';
