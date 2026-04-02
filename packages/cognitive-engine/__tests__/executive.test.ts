/**
 * Tests for Executive Function Exercises
 */

import {
  generateCategorizationPrompt,
  generateProblemSolvingPrompt,
  generateSequencingPrompt,
  generatePlanningPrompt,
  generateInhibitionPrompt,
  generateFlexibilityPrompt,
  evaluateExecutiveAnswer,
} from '../src/exercises/executive';
import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';

describe('Executive Function Exercises', () => {
  // -----------------------------------------------------------------------
  // Categorization
  // -----------------------------------------------------------------------

  describe('generateCategorizationPrompt', () => {
    test('returns a valid categorization prompt', () => {
      const prompt = generateCategorizationPrompt();
      expect(prompt.type).toBe(ExerciseType.EXECUTIVE_CATEGORIZATION);
      expect(prompt.domain).toBe(CognitiveDomain.EXECUTIVE_FUNCTION);
      expect(prompt.prompt).toContain('does not belong');
      expect(prompt.expectedAnswer).toBeDefined();
    });

    test('has meaningful hints', () => {
      const prompt = generateCategorizationPrompt();
      expect(prompt.hints.length).toBe(2);
      expect(prompt.hints[0]).toContain('common');
    });
  });

  // -----------------------------------------------------------------------
  // Problem Solving
  // -----------------------------------------------------------------------

  describe('generateProblemSolvingPrompt', () => {
    test('returns a practical problem', () => {
      const prompt = generateProblemSolvingPrompt();
      expect(prompt.type).toBe(ExerciseType.EXECUTIVE_PROBLEM_SOLVING);
      expect(prompt.prompt).toContain('?');
    });

    test('has multiple acceptable answers', () => {
      const prompt = generateProblemSolvingPrompt();
      expect(prompt.acceptableAnswers.length).toBeGreaterThan(1);
    });
  });

  // -----------------------------------------------------------------------
  // Sequencing
  // -----------------------------------------------------------------------

  describe('generateSequencingPrompt', () => {
    test('returns a valid sequencing prompt', () => {
      const prompt = generateSequencingPrompt();
      expect(prompt.type).toBe(ExerciseType.EXECUTIVE_SEQUENCING);
      expect(prompt.prompt.toLowerCase()).toContain('order');
    });
  });

  // -----------------------------------------------------------------------
  // Planning
  // -----------------------------------------------------------------------

  describe('generatePlanningPrompt', () => {
    test('returns a planning prompt', () => {
      const prompt = generatePlanningPrompt();
      expect(prompt.type).toBe(ExerciseType.EXECUTIVE_PLANNING);
      expect(prompt.prompt).toContain('?');
    });
  });

  // -----------------------------------------------------------------------
  // Inhibition
  // -----------------------------------------------------------------------

  describe('generateInhibitionPrompt', () => {
    test('asks for the opposite', () => {
      const prompt = generateInhibitionPrompt();
      expect(prompt.type).toBe(ExerciseType.EXECUTIVE_INHIBITION);
      expect(prompt.prompt).toContain('OPPOSITE');
    });
  });

  // -----------------------------------------------------------------------
  // Flexibility
  // -----------------------------------------------------------------------

  describe('generateFlexibilityPrompt', () => {
    test('asks for something matching two criteria', () => {
      const prompt = generateFlexibilityPrompt();
      expect(prompt.type).toBe(ExerciseType.EXECUTIVE_FLEXIBILITY);
      expect(prompt.prompt).toContain('AND');
    });
  });

  // -----------------------------------------------------------------------
  // Answer Evaluation
  // -----------------------------------------------------------------------

  describe('evaluateExecutiveAnswer', () => {
    test('correct categorization answer is celebrated', () => {
      const prompt = generateCategorizationPrompt();
      const result = evaluateExecutiveAnswer(prompt, prompt.expectedAnswer);
      expect(result.isCorrect).toBe(true);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
      expect(result.score).toBe(1.0);
    });

    test('acceptable answer variants are accepted', () => {
      const prompt = generateCategorizationPrompt();
      // Try "the X" format
      const withArticle = 'the ' + prompt.expectedAnswer;
      const result = evaluateExecutiveAnswer(prompt, withArticle);
      expect(result.isCorrect).toBe(true);
    });

    test('wrong answer gets supported feedback', () => {
      const prompt = generateCategorizationPrompt();
      const result = evaluateExecutiveAnswer(prompt, 'absolutely nothing');
      expect(result.isCorrect).toBe(false);
      expect(result.feedbackType).toBe(FeedbackType.SUPPORTED);
    });

    test('inhibition correct answer works', () => {
      const prompt = generateInhibitionPrompt();
      const result = evaluateExecutiveAnswer(prompt, prompt.expectedAnswer);
      expect(result.isCorrect).toBe(true);
      expect(result.score).toBe(1.0);
    });

    test('flexibility correct answer works', () => {
      const prompt = generateFlexibilityPrompt();
      const result = evaluateExecutiveAnswer(prompt, prompt.expectedAnswer);
      expect(result.isCorrect).toBe(true);
    });

    test('problem solving accepts multiple valid answers', () => {
      const prompt = generateProblemSolvingPrompt();
      // Try each acceptable answer
      for (const answer of prompt.acceptableAnswers.slice(0, 2)) {
        const result = evaluateExecutiveAnswer(prompt, answer);
        expect(result.isCorrect).toBe(true);
      }
    });
  });
});
