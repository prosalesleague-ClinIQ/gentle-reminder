import { FeedbackType } from '@gentle-reminder/shared-types';
import { generatePatternPrompt, evaluatePatternAnswer } from '../src/exercises/pattern';

describe('Pattern Matching Exercises', () => {
  describe('generatePatternPrompt', () => {
    it('generates a valid pattern prompt', () => {
      const prompt = generatePatternPrompt();
      expect(prompt.prompt).toBeTruthy();
      expect(prompt.expectedAnswer).toBeTruthy();
      expect(prompt.acceptableAnswers.length).toBeGreaterThan(0);
    });

    it('generates a prompt with hints', () => {
      const prompt = generatePatternPrompt();
      expect(prompt.hints.length).toBeGreaterThan(0);
    });

    it('includes a question mark in the prompt', () => {
      const prompt = generatePatternPrompt();
      expect(prompt.prompt).toContain('?');
    });
  });

  describe('evaluatePatternAnswer', () => {
    it('celebrates correct answers', () => {
      const prompt = generatePatternPrompt();
      const result = evaluatePatternAnswer(prompt.expectedAnswer, prompt.expectedAnswer);
      expect(result.isCorrect).toBe(true);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
      expect(result.score).toBe(1.0);
    });

    it('NEVER produces negative feedback', () => {
      const wrongAnswers = ['', 'abc', '999', '-1', '!!!'];
      for (const answer of wrongAnswers) {
        const result = evaluatePatternAnswer(answer, '10');
        expect([FeedbackType.CELEBRATED, FeedbackType.GUIDED, FeedbackType.SUPPORTED]).toContain(
          result.feedbackType,
        );
        expect(result.feedbackMessage).not.toMatch(/wrong|incorrect|fail|bad/i);
      }
    });

    it('returns supported for completely wrong answers', () => {
      const result = evaluatePatternAnswer('xyz', '10');
      expect(result.feedbackType).toBe(FeedbackType.SUPPORTED);
      expect(result.score).toBe(0.0);
    });
  });
});
