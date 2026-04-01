import { FeedbackType, CognitiveDomain } from '@gentle-reminder/shared-types';
import {
  generateSentenceCompletionPrompt,
  generateWordAssociationPrompt,
  evaluateLanguageAnswer,
} from '../src/exercises/language';

describe('Language Exercises', () => {
  describe('generateSentenceCompletionPrompt', () => {
    it('should return a valid prompt with all required fields', () => {
      const prompt = generateSentenceCompletionPrompt();
      expect(prompt.domain).toBe(CognitiveDomain.LANGUAGE);
      expect(prompt.prompt).toBeDefined();
      expect(prompt.expectedAnswer).toBeDefined();
      expect(prompt.acceptableAnswers.length).toBeGreaterThan(0);
      expect(prompt.hints.length).toBeGreaterThan(0);
    });

    it('should include a blank (___) in the prompt text', () => {
      const prompt = generateSentenceCompletionPrompt();
      expect(prompt.prompt).toContain('___');
    });

    it('should have the expected answer included in acceptable answers', () => {
      const prompt = generateSentenceCompletionPrompt();
      expect(prompt.acceptableAnswers).toContain(prompt.expectedAnswer);
    });
  });

  describe('generateWordAssociationPrompt', () => {
    it('should return a valid prompt with all required fields', () => {
      const prompt = generateWordAssociationPrompt();
      expect(prompt.domain).toBe(CognitiveDomain.LANGUAGE);
      expect(prompt.prompt).toBeDefined();
      expect(prompt.expectedAnswer).toBeDefined();
      expect(prompt.acceptableAnswers.length).toBeGreaterThan(0);
      expect(prompt.hints.length).toBeGreaterThan(0);
    });

    it('should contain a word association pattern in the prompt', () => {
      const prompt = generateWordAssociationPrompt();
      expect(prompt.prompt).toContain('goes with');
    });

    it('should have the expected answer included in acceptable answers', () => {
      const prompt = generateWordAssociationPrompt();
      expect(prompt.acceptableAnswers).toContain(prompt.expectedAnswer);
    });
  });

  describe('evaluateLanguageAnswer', () => {
    it('should return CELEBRATED feedback for a correct exact answer', () => {
      const result = evaluateLanguageAnswer('east', ['east', 'morning', 'sky'], 'east');
      expect(result.isCorrect).toBe(true);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
      expect(result.score).toBe(1.0);
    });

    it('should accept case-insensitive answers', () => {
      const result = evaluateLanguageAnswer('EAST', ['east', 'morning', 'sky'], 'east');
      expect(result.isCorrect).toBe(true);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
    });

    it('should accept alternative correct answers', () => {
      const result = evaluateLanguageAnswer('morning', ['east', 'morning', 'sky'], 'east');
      expect(result.isCorrect).toBe(true);
      expect(result.score).toBe(1.0);
    });

    it('should trim whitespace from answers', () => {
      const result = evaluateLanguageAnswer('  east  ', ['east', 'morning', 'sky'], 'east');
      expect(result.isCorrect).toBe(true);
    });

    it('should give partial credit for prefix matches', () => {
      const result = evaluateLanguageAnswer('tooth', ['toothbrush', 'brush'], 'toothbrush');
      expect(result.isCorrect).toBe(false);
      expect(result.feedbackType).toBe(FeedbackType.GUIDED);
      expect(result.score).toBe(0.5);
    });

    it('should return SUPPORTED feedback for incorrect answers - never negative', () => {
      const result = evaluateLanguageAnswer('wrong', ['east', 'morning', 'sky'], 'east');
      expect(result.isCorrect).toBe(false);
      expect(result.feedbackType).toBe(FeedbackType.SUPPORTED);
      expect(result.score).toBe(0.0);
      // NEVER-negative-feedback rule: message should be encouraging
      expect(result.feedbackMessage).toContain('good one to remember');
      expect(result.feedbackMessage).not.toMatch(/wrong|incorrect|fail|bad/i);
    });

    it('should never use negative language in any feedback message', () => {
      // Test correct answer feedback
      const correct = evaluateLanguageAnswer('butter', ['butter', 'jam'], 'butter');
      expect(correct.feedbackMessage).not.toMatch(/wrong|incorrect|fail|bad|no\b/i);

      // Test partial match feedback
      const partial = evaluateLanguageAnswer('but', ['butter', 'jam'], 'butter');
      expect(partial.feedbackMessage).not.toMatch(/wrong|incorrect|fail|bad/i);

      // Test wrong answer feedback
      const wrong = evaluateLanguageAnswer('xyz', ['butter', 'jam'], 'butter');
      expect(wrong.feedbackMessage).not.toMatch(/wrong|incorrect|fail|bad/i);
    });

    it('should not give partial credit for very short inputs (< 2 chars)', () => {
      const result = evaluateLanguageAnswer('e', ['east', 'morning', 'sky'], 'east');
      expect(result.feedbackType).toBe(FeedbackType.SUPPORTED);
      expect(result.score).toBe(0.0);
    });

    it('should include the correct answer in feedback for wrong answers', () => {
      const result = evaluateLanguageAnswer('wrong', ['east', 'morning', 'sky'], 'east');
      expect(result.feedbackMessage).toContain('east');
      expect(result.correctAnswer).toBe('east');
    });
  });
});
