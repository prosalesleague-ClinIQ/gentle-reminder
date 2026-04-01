import { FeedbackType } from '@gentle-reminder/shared-types';
import {
  generateClockDrawingPrompt,
  generateShapePrompt,
  evaluateDrawingAnswer,
} from '../src/exercises/drawing';

describe('Drawing / Tracing Exercises', () => {
  describe('generateClockDrawingPrompt', () => {
    it('generates a valid clock drawing prompt', () => {
      const prompt = generateClockDrawingPrompt();
      expect(prompt.prompt).toBeTruthy();
      expect(prompt.expectedAnswer).toBeTruthy();
      expect(prompt.acceptableAnswers.length).toBeGreaterThan(0);
    });

    it('includes hints', () => {
      const prompt = generateClockDrawingPrompt();
      expect(prompt.hints.length).toBeGreaterThan(0);
      expect(typeof prompt.hints[0]).toBe('string');
    });

    it('has CLOCK_TIME exercise type', () => {
      const prompt = generateClockDrawingPrompt();
      expect(prompt.type).toBe('clock_time');
    });

    it('has executive_function domain', () => {
      const prompt = generateClockDrawingPrompt();
      expect(prompt.domain).toBe('executive_function');
    });
  });

  describe('generateShapePrompt', () => {
    it('generates a valid shape prompt', () => {
      const prompt = generateShapePrompt();
      expect(prompt.prompt).toBeTruthy();
      expect(prompt.expectedAnswer).toBeTruthy();
      expect(prompt.acceptableAnswers.length).toBeGreaterThan(0);
    });

    it('includes a shapes hint', () => {
      const prompt = generateShapePrompt();
      expect(prompt.hints[0]).toContain('shapes');
    });

    it('has PATTERN_MATCHING exercise type', () => {
      const prompt = generateShapePrompt();
      expect(prompt.type).toBe('pattern_matching');
    });
  });

  describe('evaluateDrawingAnswer', () => {
    it('celebrates correct answers', () => {
      const result = evaluateDrawingAnswer('12', ['12', 'twelve'], '12');
      expect(result.isCorrect).toBe(true);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
      expect(result.score).toBe(1.0);
    });

    it('celebrates acceptable alternative answers', () => {
      const result = evaluateDrawingAnswer('twelve', ['12', 'twelve'], '12');
      expect(result.isCorrect).toBe(true);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
    });

    it('supports incorrect answers gently', () => {
      const result = evaluateDrawingAnswer('5', ['12', 'twelve'], '12');
      expect(result.isCorrect).toBe(false);
      expect(result.feedbackType).toBe(FeedbackType.SUPPORTED);
      expect(result.score).toBe(0.0);
    });

    it('normalizes whitespace and case', () => {
      const result = evaluateDrawingAnswer('  TWELVE  ', ['12', 'twelve'], '12');
      expect(result.isCorrect).toBe(true);
    });

    it('includes the correct answer in feedback message', () => {
      const result = evaluateDrawingAnswer('wrong', ['square', 'a square'], 'square');
      expect(result.feedbackMessage).toContain('square');
      expect(result.correctAnswer).toBe('square');
    });

    it('returns correct answer in the result for both correct and incorrect', () => {
      const correct = evaluateDrawingAnswer('3', ['3', 'three'], '3');
      expect(correct.correctAnswer).toBe('3');

      const incorrect = evaluateDrawingAnswer('4', ['3', 'three'], '3');
      expect(incorrect.correctAnswer).toBe('3');
    });
  });
});
