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

export {
  generatePatternPrompt,
  evaluatePatternAnswer,
} from './exercises/pattern';

export {
  generateClockPrompt,
  evaluateClockAnswer,
} from './exercises/clock';

export {
  createCard,
  processReview,
  getReviewSchedule,
  generateFamilyCards,
} from './exercises/spaced-repetition';

export {
  generateSentenceCompletionPrompt,
  generateWordAssociationPrompt,
  evaluateLanguageAnswer,
} from './exercises/language';

export {
  generateWordFindingPrompt,
  evaluateWordFindingAnswer,
} from './exercises/word-finding';

export {
  generateClockDrawingPrompt,
  generateShapePrompt,
  evaluateDrawingAnswer,
} from './exercises/drawing';

export type {
  MemoryCard,
  ReviewResult,
  ReviewSchedule,
} from './exercises/spaced-repetition';

// Scoring
export {
  calculateSessionScores,
  calculateDomainScore,
  calculateCognitiveMetrics,
  getSessionCompletionMessage,
  detectFatigueSignals,
} from './scoring/gentle-scorer';

export { analyzeDeclineTrend } from './scoring/cognitive-metrics';

export {
  calculateDifficulty,
  getDifficultyParams,
  getDifficultyLevel,
  DIFFICULTY_LEVELS,
} from './scoring/adaptive-difficulty';

export type {
  DifficultyLevel,
  PerformanceWindow,
} from './scoring/adaptive-difficulty';

// Types
export type { GeneratedPrompt, AnswerEvaluation, PatientContext } from './exercises/types';
export type { ExerciseResultInput, SessionScores, CognitiveMetrics } from './scoring/types';
export type { DeclineTrend, DeclineAnalysis } from './scoring/cognitive-metrics';
