import { CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';
import {
  calculateSessionScores,
  calculateCognitiveMetrics,
  getSessionCompletionMessage,
  detectFatigueSignals,
} from '../src/scoring/gentle-scorer';
import { ExerciseResultInput } from '../src/scoring/types';

const makeResult = (
  overrides: Partial<ExerciseResultInput> = {},
): ExerciseResultInput => ({
  domain: CognitiveDomain.ORIENTATION,
  score: 1.0,
  responseTimeMs: 3000,
  feedbackType: FeedbackType.CELEBRATED,
  isCorrect: true,
  ...overrides,
});

describe('Gentle Scorer', () => {
  describe('calculateSessionScores', () => {
    it('calculates scores by domain', () => {
      const results: ExerciseResultInput[] = [
        makeResult({ domain: CognitiveDomain.ORIENTATION, score: 1.0 }),
        makeResult({ domain: CognitiveDomain.ORIENTATION, score: 0.5 }),
        makeResult({ domain: CognitiveDomain.IDENTITY, score: 1.0 }),
        makeResult({ domain: CognitiveDomain.MEMORY, score: 0.3 }),
      ];

      const scores = calculateSessionScores(results);

      expect(scores.orientationScore).toBe(0.75);
      expect(scores.identityScore).toBe(1.0);
      expect(scores.memoryScore).toBe(0.3);
    });

    it('returns 0 for empty results', () => {
      const scores = calculateSessionScores([]);
      expect(scores.overallScore).toBe(0);
      expect(scores.orientationScore).toBe(0);
    });

    it('overall score is average of active domains', () => {
      const results: ExerciseResultInput[] = [
        makeResult({ domain: CognitiveDomain.ORIENTATION, score: 0.8 }),
        makeResult({ domain: CognitiveDomain.MEMORY, score: 0.6 }),
      ];

      const scores = calculateSessionScores(results);
      expect(scores.overallScore).toBe(0.7);
    });

    it('scores are always between 0 and 1', () => {
      const results: ExerciseResultInput[] = [
        makeResult({ score: 0.0 }),
        makeResult({ score: 1.0 }),
        makeResult({ score: 0.5 }),
      ];

      const scores = calculateSessionScores(results);
      expect(scores.overallScore).toBeGreaterThanOrEqual(0);
      expect(scores.overallScore).toBeLessThanOrEqual(1);
    });
  });

  describe('calculateCognitiveMetrics', () => {
    it('counts feedback types correctly', () => {
      const results: ExerciseResultInput[] = [
        makeResult({ feedbackType: FeedbackType.CELEBRATED }),
        makeResult({ feedbackType: FeedbackType.CELEBRATED }),
        makeResult({ feedbackType: FeedbackType.GUIDED }),
        makeResult({ feedbackType: FeedbackType.SUPPORTED }),
      ];

      const metrics = calculateCognitiveMetrics(results);
      expect(metrics.celebratedCount).toBe(2);
      expect(metrics.guidedCount).toBe(1);
      expect(metrics.supportedCount).toBe(1);
      expect(metrics.totalExercises).toBe(4);
    });

    it('returns zeros for empty results', () => {
      const metrics = calculateCognitiveMetrics([]);
      expect(metrics.averageScore).toBe(0);
      expect(metrics.totalExercises).toBe(0);
    });
  });

  describe('getSessionCompletionMessage', () => {
    it('NEVER returns discouraging messages', () => {
      const testCases = [
        { completionRate: 1.0, totalExercises: 5 },
        { completionRate: 0.5, totalExercises: 5 },
        { completionRate: 0.0, totalExercises: 5 },
        { completionRate: 0.0, totalExercises: 0 },
      ];

      for (const tc of testCases) {
        const message = getSessionCompletionMessage({
          averageScore: tc.completionRate,
          averageResponseTimeMs: 5000,
          completionRate: tc.completionRate,
          celebratedCount: 0,
          guidedCount: 0,
          supportedCount: 0,
          totalExercises: tc.totalExercises,
        });

        expect(message).not.toMatch(/wrong|fail|bad|poor|terrible|awful/i);
        expect(message.length).toBeGreaterThan(0);
      }
    });

    it('returns encouraging message for high performance', () => {
      const message = getSessionCompletionMessage({
        averageScore: 0.9,
        averageResponseTimeMs: 3000,
        completionRate: 0.9,
        celebratedCount: 4,
        guidedCount: 1,
        supportedCount: 0,
        totalExercises: 5,
      });
      expect(message).toContain('fantastic');
    });
  });

  describe('detectFatigueSignals', () => {
    it('detects fatigue when response times increase', () => {
      const results: ExerciseResultInput[] = [
        makeResult({ responseTimeMs: 2000 }),
        makeResult({ responseTimeMs: 2500 }),
        makeResult({ responseTimeMs: 3000 }),
        makeResult({ responseTimeMs: 5000 }),
        makeResult({ responseTimeMs: 6000 }),
        makeResult({ responseTimeMs: 7000 }),
      ];

      expect(detectFatigueSignals(results)).toBe(true);
    });

    it('does not flag stable response times', () => {
      const results: ExerciseResultInput[] = [
        makeResult({ responseTimeMs: 3000 }),
        makeResult({ responseTimeMs: 3200 }),
        makeResult({ responseTimeMs: 2800 }),
        makeResult({ responseTimeMs: 3100 }),
        makeResult({ responseTimeMs: 3000 }),
        makeResult({ responseTimeMs: 2900 }),
      ];

      expect(detectFatigueSignals(results)).toBe(false);
    });

    it('returns false for insufficient data', () => {
      expect(detectFatigueSignals([makeResult()])).toBe(false);
      expect(detectFatigueSignals([])).toBe(false);
    });
  });
});
