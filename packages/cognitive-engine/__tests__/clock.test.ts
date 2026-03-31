import { FeedbackType } from '@gentle-reminder/shared-types';
import { generateClockPrompt, evaluateClockAnswer } from '../src/exercises/clock';

describe('Clock/Time Exercises', () => {
  describe('generateClockPrompt', () => {
    it('generates a valid clock prompt', () => {
      const prompt = generateClockPrompt();
      expect(prompt.prompt).toBeTruthy();
      expect(prompt.expectedAnswer).toBeTruthy();
      expect(prompt.acceptableAnswers.length).toBeGreaterThan(0);
    });

    it('generates a prompt with hints', () => {
      const prompt = generateClockPrompt();
      expect(prompt.hints.length).toBeGreaterThan(0);
    });
  });

  describe('evaluateClockAnswer', () => {
    it('celebrates correct answers', () => {
      const prompt = generateClockPrompt();
      const result = evaluateClockAnswer(prompt.expectedAnswer, prompt.acceptableAnswers);
      expect(result.isCorrect).toBe(true);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
      expect(result.score).toBe(1.0);
    });

    it('celebrates acceptable alternative answers', () => {
      const prompt = generateClockPrompt();
      for (const acceptable of prompt.acceptableAnswers) {
        const result = evaluateClockAnswer(acceptable, prompt.acceptableAnswers);
        expect(result.isCorrect).toBe(true);
        expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
      }
    });

    it('is case insensitive', () => {
      const prompt = generateClockPrompt();
      const upper = prompt.expectedAnswer.toUpperCase();
      const result = evaluateClockAnswer(upper, prompt.acceptableAnswers);
      expect(result.isCorrect).toBe(true);
    });

    it('NEVER produces negative feedback', () => {
      const wrongAnswers = ['', 'midnight', '99:99', 'yesterday'];
      for (const answer of wrongAnswers) {
        const result = evaluateClockAnswer(answer, ['3:00', '3 o\'clock']);
        expect([FeedbackType.CELEBRATED, FeedbackType.GUIDED, FeedbackType.SUPPORTED]).toContain(
          result.feedbackType,
        );
        expect(result.feedbackMessage).not.toMatch(/wrong|incorrect|fail|bad/i);
      }
    });
  });
});
