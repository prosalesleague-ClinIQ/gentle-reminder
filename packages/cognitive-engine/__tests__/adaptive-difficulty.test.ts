import {
  calculateDifficulty,
  getDifficultyParams,
  getDifficultyLevel,
  DIFFICULTY_LEVELS,
  PerformanceWindow,
} from '../src/scoring/adaptive-difficulty';

describe('Adaptive Difficulty Engine', () => {
  describe('calculateDifficulty', () => {
    const basePerformance: PerformanceWindow = {
      recentScores: [],
      averageResponseTimeMs: 5000,
      consecutiveCorrect: 0,
      consecutiveIncorrect: 0,
    };

    it('should return current level with no scores (defaults to 0.5 avg)', () => {
      const result = calculateDifficulty(basePerformance, 3);
      expect(result).toBe(3);
    });

    it('should drop difficulty immediately on 2 consecutive failures', () => {
      const performance: PerformanceWindow = {
        ...basePerformance,
        recentScores: [0, 0],
        consecutiveIncorrect: 2,
      };
      const result = calculateDifficulty(performance, 3);
      expect(result).toBe(2);
    });

    it('should drop difficulty on 3 consecutive failures', () => {
      const performance: PerformanceWindow = {
        ...basePerformance,
        recentScores: [0, 0, 0],
        consecutiveIncorrect: 3,
      };
      const result = calculateDifficulty(performance, 4);
      expect(result).toBe(3);
    });

    it('should never drop below level 1', () => {
      const performance: PerformanceWindow = {
        ...basePerformance,
        recentScores: [0, 0],
        consecutiveIncorrect: 2,
      };
      const result = calculateDifficulty(performance, 1);
      expect(result).toBe(1);
    });

    it('should increase difficulty on 4 consecutive correct with high avg', () => {
      const performance: PerformanceWindow = {
        ...basePerformance,
        recentScores: [1, 1, 1, 1],
        consecutiveCorrect: 4,
        consecutiveIncorrect: 0,
      };
      const result = calculateDifficulty(performance, 2);
      expect(result).toBe(3);
    });

    it('should never exceed level 5', () => {
      const performance: PerformanceWindow = {
        ...basePerformance,
        recentScores: [1, 1, 1, 1],
        consecutiveCorrect: 4,
        consecutiveIncorrect: 0,
      };
      const result = calculateDifficulty(performance, 5);
      expect(result).toBe(5);
    });

    it('should stay at current level in the sweet spot (70-85%)', () => {
      const performance: PerformanceWindow = {
        ...basePerformance,
        recentScores: [1, 0.8, 0.7, 0.75, 0.8],
        consecutiveCorrect: 1,
        consecutiveIncorrect: 0,
      };
      const result = calculateDifficulty(performance, 3);
      expect(result).toBe(3);
    });

    it('should increase when score is consistently above 85% with enough data', () => {
      const performance: PerformanceWindow = {
        ...basePerformance,
        recentScores: [0.9, 0.95, 0.9, 0.88, 0.92],
        consecutiveCorrect: 3,
        consecutiveIncorrect: 0,
      };
      const result = calculateDifficulty(performance, 2);
      expect(result).toBe(3);
    });

    it('should decrease when score is consistently below 70% with enough data', () => {
      const performance: PerformanceWindow = {
        ...basePerformance,
        recentScores: [0.5, 0.6, 0.65],
        consecutiveCorrect: 0,
        consecutiveIncorrect: 1,
      };
      const result = calculateDifficulty(performance, 3);
      expect(result).toBe(2);
    });

    it('should prioritize frustration prevention over gradual increase', () => {
      // Even with high avg, consecutive failures should drop
      const performance: PerformanceWindow = {
        ...basePerformance,
        recentScores: [1, 1, 1, 0, 0],
        consecutiveCorrect: 0,
        consecutiveIncorrect: 2,
      };
      const result = calculateDifficulty(performance, 4);
      expect(result).toBe(3);
    });

    it('should not increase with high avg but insufficient consecutive correct', () => {
      const performance: PerformanceWindow = {
        ...basePerformance,
        recentScores: [0.9, 0.9, 0.9],
        consecutiveCorrect: 3, // only 3, need 4
        consecutiveIncorrect: 0,
      };
      // avgScore is 0.9, but consecutiveCorrect < 4, so it falls to the >0.85 branch
      // but recentScores.length is only 3, not >= 5
      const result = calculateDifficulty(performance, 3);
      expect(result).toBe(3);
    });
  });

  describe('getDifficultyParams', () => {
    it('should return easiest params for level 1', () => {
      const params = getDifficultyParams(1);
      expect(params.optionCount).toBe(2);
      expect(params.hintAvailable).toBe(true);
      expect(params.timeLimit).toBe(0);
      expect(params.promptComplexity).toBe('simple');
    });

    it('should return hardest params for level 5', () => {
      const params = getDifficultyParams(5);
      expect(params.optionCount).toBe(3);
      expect(params.hintAvailable).toBe(false);
      expect(params.timeLimit).toBe(30);
      expect(params.promptComplexity).toBe('complex');
    });

    it('should return default params for invalid level', () => {
      const params = getDifficultyParams(99);
      expect(params.hintAvailable).toBe(true);
      expect(params.timeLimit).toBe(0);
      expect(params.promptComplexity).toBe('simple');
    });

    it('should have increasing time limits as difficulty rises', () => {
      const level3 = getDifficultyParams(3);
      const level4 = getDifficultyParams(4);
      const level5 = getDifficultyParams(5);
      expect(level3.timeLimit).toBeGreaterThan(level5.timeLimit);
      expect(level4.timeLimit).toBeGreaterThan(level5.timeLimit);
    });
  });

  describe('getDifficultyLevel', () => {
    it('should return correct label for each level', () => {
      expect(getDifficultyLevel(1).label).toBe('Gentle');
      expect(getDifficultyLevel(3).label).toBe('Standard');
      expect(getDifficultyLevel(5).label).toBe('Challenging');
    });

    it('should clamp to level 1 for values below 1', () => {
      expect(getDifficultyLevel(0).label).toBe('Gentle');
      expect(getDifficultyLevel(-1).label).toBe('Gentle');
    });

    it('should clamp to level 5 for values above 5', () => {
      expect(getDifficultyLevel(6).label).toBe('Challenging');
      expect(getDifficultyLevel(100).label).toBe('Challenging');
    });
  });

  describe('DIFFICULTY_LEVELS', () => {
    it('should have 5 difficulty levels', () => {
      expect(DIFFICULTY_LEVELS).toHaveLength(5);
    });

    it('should have levels numbered 1 through 5', () => {
      DIFFICULTY_LEVELS.forEach((level, i) => {
        expect(level.level).toBe(i + 1);
      });
    });
  });
});
