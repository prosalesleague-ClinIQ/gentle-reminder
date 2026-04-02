/**
 * Tests for Attention and Concentration Exercises
 */

import {
  generateLetterCancellationPrompt,
  generateDigitSpanPrompt,
  generateTrailMakingPrompt,
  generateCountingPrompt,
  generateWordDetectionPrompt,
  generateSymbolSearchPrompt,
  evaluateAttentionAnswer,
} from '../src/exercises/attention';
import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';

describe('Attention Exercises', () => {
  // -----------------------------------------------------------------------
  // Letter Cancellation
  // -----------------------------------------------------------------------

  describe('generateLetterCancellationPrompt', () => {
    test('returns a valid prompt structure', () => {
      const prompt = generateLetterCancellationPrompt();
      expect(prompt.type).toBe(ExerciseType.ATTENTION_LETTER_CANCELLATION);
      expect(prompt.domain).toBe(CognitiveDomain.ATTENTION);
      expect(prompt.prompt).toContain('Find all the letter');
      expect(prompt.expectedAnswer).toBeDefined();
      expect(prompt.hints.length).toBeGreaterThan(0);
    });

    test('expected answer is a number', () => {
      const prompt = generateLetterCancellationPrompt();
      const num = parseInt(prompt.expectedAnswer, 10);
      expect(num).toBeGreaterThan(0);
    });
  });

  // -----------------------------------------------------------------------
  // Digit Span
  // -----------------------------------------------------------------------

  describe('generateDigitSpanPrompt', () => {
    test('returns a prompt with the correct type', () => {
      const prompt = generateDigitSpanPrompt(3);
      expect(prompt.type).toBe(ExerciseType.ATTENTION_DIGIT_SPAN);
      expect(prompt.prompt).toContain('repeat them back');
    });

    test('generates sequences of the requested length', () => {
      const prompt = generateDigitSpanPrompt(4);
      const digits = prompt.expectedAnswer.split(', ');
      expect(digits.length).toBe(4);
    });

    test('defaults to length 3', () => {
      const prompt = generateDigitSpanPrompt();
      const digits = prompt.expectedAnswer.split(', ');
      expect(digits.length).toBe(3);
    });
  });

  // -----------------------------------------------------------------------
  // Trail Making
  // -----------------------------------------------------------------------

  describe('generateTrailMakingPrompt', () => {
    test('returns a valid trail making prompt', () => {
      const prompt = generateTrailMakingPrompt();
      expect(prompt.type).toBe(ExerciseType.ATTENTION_TRAIL_MAKING);
      expect(prompt.expectedAnswer).toMatch(/\d/);
      expect(prompt.expectedAnswer).toMatch(/[A-Z]/);
    });
  });

  // -----------------------------------------------------------------------
  // Counting
  // -----------------------------------------------------------------------

  describe('generateCountingPrompt', () => {
    test('returns a counting prompt', () => {
      const prompt = generateCountingPrompt();
      expect(prompt.type).toBe(ExerciseType.ATTENTION_COUNTING);
      expect(prompt.prompt.toLowerCase()).toContain('count');
    });
  });

  // -----------------------------------------------------------------------
  // Word Detection
  // -----------------------------------------------------------------------

  describe('generateWordDetectionPrompt', () => {
    test('returns a word detection prompt with target category', () => {
      const prompt = generateWordDetectionPrompt();
      expect(prompt.type).toBe(ExerciseType.ATTENTION_WORD_DETECTION);
      expect(prompt.expectedAnswer).toBeDefined();
      expect(prompt.acceptableAnswers.length).toBeGreaterThan(0);
    });
  });

  // -----------------------------------------------------------------------
  // Symbol Search
  // -----------------------------------------------------------------------

  describe('generateSymbolSearchPrompt', () => {
    test('returns a symbol search prompt', () => {
      const prompt = generateSymbolSearchPrompt();
      expect(prompt.type).toBe(ExerciseType.ATTENTION_SYMBOL_SEARCH);
      const count = parseInt(prompt.expectedAnswer, 10);
      expect(count).toBeGreaterThan(0);
    });
  });

  // -----------------------------------------------------------------------
  // Answer Evaluation
  // -----------------------------------------------------------------------

  describe('evaluateAttentionAnswer', () => {
    test('correct answer gets celebrated feedback', () => {
      const prompt = generateLetterCancellationPrompt();
      const result = evaluateAttentionAnswer(prompt, prompt.expectedAnswer);
      expect(result.isCorrect).toBe(true);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
      expect(result.score).toBe(1.0);
    });

    test('close numeric answer gets guided feedback', () => {
      const prompt = generateLetterCancellationPrompt();
      const expectedNum = parseInt(prompt.expectedAnswer, 10);
      const closeAnswer = String(expectedNum + 1);
      const result = evaluateAttentionAnswer(prompt, closeAnswer);
      expect(result.score).toBe(0.7);
      expect(result.feedbackType).toBe(FeedbackType.GUIDED);
    });

    test('incorrect answer gets supported feedback', () => {
      const prompt = generateLetterCancellationPrompt();
      const result = evaluateAttentionAnswer(prompt, 'completely wrong');
      expect(result.isCorrect).toBe(false);
      expect(result.feedbackType).toBe(FeedbackType.SUPPORTED);
      expect(result.score).toBe(0.3);
    });

    test('digit span correct answer is celebrated', () => {
      const prompt = generateDigitSpanPrompt(3);
      const result = evaluateAttentionAnswer(prompt, prompt.expectedAnswer);
      expect(result.isCorrect).toBe(true);
      expect(result.score).toBe(1.0);
    });

    test('acceptable format variants are accepted', () => {
      const prompt = generateDigitSpanPrompt(3);
      // Try with space-separated format
      const spaceSeparated = prompt.expectedAnswer.replace(/, /g, ' ');
      const result = evaluateAttentionAnswer(prompt, spaceSeparated);
      expect(result.isCorrect).toBe(true);
    });
  });
});
