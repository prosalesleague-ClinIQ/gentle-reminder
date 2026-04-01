import { FeedbackType } from '@gentle-reminder/shared-types';
import {
  generateCategoryPrompt,
  generateObjectPrompt,
  generateSequencePrompt,
  evaluateCategoryAnswer,
  evaluateObjectAnswer,
  evaluateSequenceAnswer,
} from '../src/exercises/memory';

describe('Memory Exercises', () => {
  describe('generateCategoryPrompt', () => {
    it('generates a valid prompt', () => {
      const prompt = generateCategoryPrompt();
      expect(prompt.prompt).toBeTruthy();
      expect(prompt.acceptableAnswers.length).toBeGreaterThan(0);
    });

    it('includes hints for gentle guidance', () => {
      const prompt = generateCategoryPrompt();
      expect(prompt.hints.length).toBeGreaterThan(0);
    });

    it('sets correct exercise type and domain', () => {
      const prompt = generateCategoryPrompt();
      expect(prompt.type).toBe('memory_category');
      expect(prompt.domain).toBe('memory');
    });
  });

  describe('generateObjectPrompt', () => {
    it('generates prompt with options', () => {
      const prompt = generateObjectPrompt();
      expect(prompt.options).toBeDefined();
      expect(prompt.options!.length).toBe(3);
    });

    it('includes the correct answer among options', () => {
      const prompt = generateObjectPrompt();
      expect(prompt.options).toContain(prompt.expectedAnswer);
    });
  });

  describe('generateSequencePrompt', () => {
    it('generates correct length sequence', () => {
      const prompt = generateSequencePrompt(3);
      expect(prompt.acceptableAnswers.length).toBe(3);
    });

    it('defaults to length 3', () => {
      const prompt = generateSequencePrompt();
      expect(prompt.acceptableAnswers.length).toBe(3);
    });

    it('includes sequence words in the prompt text', () => {
      const prompt = generateSequencePrompt(3);
      for (const word of prompt.acceptableAnswers) {
        expect(prompt.prompt.toLowerCase()).toContain(word.toLowerCase());
      }
    });
  });

  describe('evaluateCategoryAnswer', () => {
    it('celebrates naming 3+ valid items', () => {
      const result = evaluateCategoryAnswer('apple, banana, orange', ['apple', 'banana', 'orange', 'grape'], 3);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
      expect(result.score).toBe(1.0);
    });

    it('guides on partial answers', () => {
      const result = evaluateCategoryAnswer('apple, banana', ['apple', 'banana', 'orange'], 3);
      expect(result.feedbackType).toBe(FeedbackType.GUIDED);
      expect(result.score).toBeGreaterThan(0);
      expect(result.score).toBeLessThan(1);
    });

    it('supports on empty answer', () => {
      const result = evaluateCategoryAnswer('', ['apple', 'banana', 'orange'], 3);
      expect(result.feedbackType).toBe(FeedbackType.SUPPORTED);
      expect(result.score).toBe(0);
    });

    it('is case-insensitive', () => {
      const result = evaluateCategoryAnswer('APPLE, BANANA, ORANGE', ['apple', 'banana', 'orange'], 3);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
      expect(result.score).toBe(1.0);
    });

    it('handles space-separated answers', () => {
      const result = evaluateCategoryAnswer('apple banana orange', ['apple', 'banana', 'orange'], 3);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
    });

    it('NEVER produces negative feedback', () => {
      const badAnswers = ['xyz', '', '!!!', 'nothing'];
      for (const answer of badAnswers) {
        const result = evaluateCategoryAnswer(answer, ['apple', 'banana'], 3);
        expect(result.feedbackMessage).not.toMatch(/wrong|incorrect|fail|bad/i);
      }
    });
  });

  describe('evaluateObjectAnswer', () => {
    it('celebrates correct answer', () => {
      const result = evaluateObjectAnswer('scissors', ['scissors', 'knife'], 'scissors');
      expect(result.isCorrect).toBe(true);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
    });

    it('accepts alternative answers', () => {
      const result = evaluateObjectAnswer('knife', ['scissors', 'knife'], 'scissors');
      expect(result.isCorrect).toBe(true);
    });

    it('is case-insensitive', () => {
      const result = evaluateObjectAnswer('Scissors', ['scissors', 'knife'], 'scissors');
      expect(result.isCorrect).toBe(true);
    });

    it('supports gently on wrong answer', () => {
      const result = evaluateObjectAnswer('hammer', ['scissors', 'knife'], 'scissors');
      expect(result.isCorrect).toBe(false);
      expect(result.feedbackType).toBe(FeedbackType.SUPPORTED);
      expect(result.feedbackMessage).not.toMatch(/wrong|incorrect|fail|bad/i);
    });
  });

  describe('evaluateSequenceAnswer', () => {
    it('celebrates perfect recall', () => {
      const result = evaluateSequenceAnswer('apple, book, chair', ['apple', 'book', 'chair']);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
      expect(result.score).toBe(1.0);
    });

    it('guides on partial recall', () => {
      const result = evaluateSequenceAnswer('apple, book', ['apple', 'book', 'chair']);
      expect(result.feedbackType).toBe(FeedbackType.GUIDED);
    });

    it('supports on no recall', () => {
      const result = evaluateSequenceAnswer('xyz', ['apple', 'book', 'chair']);
      expect(result.feedbackType).toBe(FeedbackType.SUPPORTED);
      expect(result.score).toBe(0);
    });

    it('checks order - wrong order scores partial', () => {
      const result = evaluateSequenceAnswer('book, apple, chair', ['apple', 'book', 'chair']);
      // Only 'chair' is in correct position (index 2)
      expect(result.score).toBeLessThan(1.0);
      expect(result.score).toBeGreaterThan(0);
    });

    it('NEVER produces negative feedback on any input', () => {
      const inputs = ['', 'xyz abc', 'wrong wrong wrong'];
      for (const input of inputs) {
        const result = evaluateSequenceAnswer(input, ['apple', 'book', 'chair']);
        expect(result.feedbackMessage).not.toMatch(/wrong|incorrect|fail|bad/i);
      }
    });
  });
});
