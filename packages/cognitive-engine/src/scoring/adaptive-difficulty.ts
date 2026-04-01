/**
 * Adaptive Difficulty Engine
 * Adjusts exercise difficulty based on patient performance.
 *
 * For dementia patients:
 * - Never makes exercises frustratingly hard
 * - Gradually increases difficulty only after consistent success
 * - Drops difficulty immediately on struggle (prevent frustration)
 * - Maintains a "comfort zone" where patient succeeds 70-85% of time
 */

export interface DifficultyLevel {
  level: number; // 1-5 (1 = easiest)
  label: string;
  description: string;
}

export interface PerformanceWindow {
  recentScores: number[]; // Last N scores (0-1)
  averageResponseTimeMs: number;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
}

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { level: 1, label: 'Gentle', description: 'Simple, familiar prompts with maximum support' },
  { level: 2, label: 'Easy', description: 'Straightforward questions with helpful hints' },
  { level: 3, label: 'Standard', description: 'Regular difficulty with some challenge' },
  { level: 4, label: 'Engaging', description: 'More variety and fewer hints' },
  { level: 5, label: 'Challenging', description: 'Maximum variety for high-performing patients' },
];

/**
 * Calculate the recommended difficulty based on recent performance.
 */
export function calculateDifficulty(performance: PerformanceWindow, currentLevel: number): number {
  const avgScore = performance.recentScores.length > 0
    ? performance.recentScores.reduce((a, b) => a + b, 0) / performance.recentScores.length
    : 0.5;

  // Immediate drop on consecutive failures (prevent frustration)
  if (performance.consecutiveIncorrect >= 2) {
    return Math.max(1, currentLevel - 1);
  }

  // Gradual increase on consistent success
  if (performance.consecutiveCorrect >= 4 && avgScore >= 0.85) {
    return Math.min(5, currentLevel + 1);
  }

  // Sweet spot: 70-85% success rate = stay at current level
  if (avgScore >= 0.7 && avgScore <= 0.85) {
    return currentLevel;
  }

  // Too easy (>85%) - consider increasing
  if (avgScore > 0.85 && performance.recentScores.length >= 5) {
    return Math.min(5, currentLevel + 1);
  }

  // Too hard (<70%) - decrease
  if (avgScore < 0.7 && performance.recentScores.length >= 3) {
    return Math.max(1, currentLevel - 1);
  }

  return currentLevel;
}

/**
 * Get difficulty parameters for exercise generation.
 */
export function getDifficultyParams(level: number): {
  optionCount: number;
  hintAvailable: boolean;
  timeLimit: number; // seconds, 0 = unlimited
  promptComplexity: 'simple' | 'moderate' | 'complex';
} {
  switch (level) {
    case 1: return { optionCount: 2, hintAvailable: true, timeLimit: 0, promptComplexity: 'simple' };
    case 2: return { optionCount: 3, hintAvailable: true, timeLimit: 0, promptComplexity: 'simple' };
    case 3: return { optionCount: 3, hintAvailable: true, timeLimit: 60, promptComplexity: 'moderate' };
    case 4: return { optionCount: 3, hintAvailable: false, timeLimit: 45, promptComplexity: 'moderate' };
    case 5: return { optionCount: 3, hintAvailable: false, timeLimit: 30, promptComplexity: 'complex' };
    default: return { optionCount: 3, hintAvailable: true, timeLimit: 0, promptComplexity: 'simple' };
  }
}

/**
 * Get the difficulty level details.
 */
export function getDifficultyLevel(level: number): DifficultyLevel {
  return DIFFICULTY_LEVELS[Math.max(0, Math.min(4, level - 1))];
}
