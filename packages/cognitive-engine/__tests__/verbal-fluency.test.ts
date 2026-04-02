/**
 * Tests for Verbal Fluency Exercises
 */

import {
  generateLetterFluencyPrompt,
  generateSemanticFluencyPrompt,
  generateSentenceBuildingPrompt,
  generateWordDefinitionPrompt,
  generateRhymingPrompt,
  generateStorytellingPrompt,
  evaluateVerbalFluencyAnswer,
} from '../src/exercises/verbal-fluency';
import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';

describe('Verbal Fluency Exercises', () => {
  // -----------------------------------------------------------------------
  // Letter Fluency
  // -----------------------------------------------------------------------

  describe('generateLetterFluencyPrompt', () => {
    test('returns a valid letter fluency prompt', () => {
      const prompt = generateLetterFluencyPrompt();
      expect(prompt.type).toBe(ExerciseType.VERBAL_LETTER_FLUENCY);
      expect(prompt.domain).toBe(CognitiveDomain.VERBAL_FLUENCY);
      expect(prompt.prompt).toContain('letter');
      expect(prompt.acceptableAnswers.length).toBeGreaterThan(5);
    });
  });

  // -----------------------------------------------------------------------
  // Semantic Fluency
  // -----------------------------------------------------------------------

  describe('generateSemanticFluencyPrompt', () => {
    test('returns a category-based prompt', () => {
      const prompt = generateSemanticFluencyPrompt();
      expect(prompt.type).toBe(ExerciseType.VERBAL_SEMANTIC_FLUENCY);
      expect(prompt.prompt).toContain('Name things');
    });
  });

  // -----------------------------------------------------------------------
  // Sentence Building
  // -----------------------------------------------------------------------

  describe('generateSentenceBuildingPrompt', () => {
    test('returns a sentence building prompt with a target word', () => {
      const prompt = generateSentenceBuildingPrompt();
      expect(prompt.type).toBe(ExerciseType.VERBAL_SENTENCE_BUILDING);
      expect(prompt.prompt).toContain('Make a sentence');
    });
  });

  // -----------------------------------------------------------------------
  // Word Definition
  // -----------------------------------------------------------------------

  describe('generateWordDefinitionPrompt', () => {
    test('returns a definition prompt', () => {
      const prompt = generateWordDefinitionPrompt();
      expect(prompt.type).toBe(ExerciseType.VERBAL_WORD_DEFINITION);
      expect(prompt.prompt).toContain('What is');
    });
  });

  // -----------------------------------------------------------------------
  // Rhyming
  // -----------------------------------------------------------------------

  describe('generateRhymingPrompt', () => {
    test('returns a rhyming prompt', () => {
      const prompt = generateRhymingPrompt();
      expect(prompt.type).toBe(ExerciseType.VERBAL_RHYMING);
      expect(prompt.prompt).toContain('rhymes with');
    });
  });

  // -----------------------------------------------------------------------
  // Storytelling
  // -----------------------------------------------------------------------

  describe('generateStorytellingPrompt', () => {
    test('returns a storytelling prompt with a starter', () => {
      const prompt = generateStorytellingPrompt();
      expect(prompt.type).toBe(ExerciseType.VERBAL_STORYTELLING);
      expect(prompt.prompt.length).toBeGreaterThan(20);
    });
  });

  // -----------------------------------------------------------------------
  // Answer Evaluation
  // -----------------------------------------------------------------------

  describe('evaluateVerbalFluencyAnswer', () => {
    test('empty answer gets supported feedback', () => {
      const prompt = generateLetterFluencyPrompt();
      const result = evaluateVerbalFluencyAnswer(prompt, '');
      expect(result.isCorrect).toBe(false);
      expect(result.feedbackType).toBe(FeedbackType.SUPPORTED);
      expect(result.score).toBe(0.1);
    });

    test('multiple valid words for letter fluency gets celebrated', () => {
      const prompt = generateLetterFluencyPrompt();
      // Use three of the acceptable answers
      const answer = prompt.acceptableAnswers.slice(0, 3).join(', ');
      const result = evaluateVerbalFluencyAnswer(prompt, answer);
      expect(result.isCorrect).toBe(true);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
      expect(result.score).toBe(1.0);
    });

    test('one valid word for letter fluency gets guided feedback', () => {
      const prompt = generateLetterFluencyPrompt();
      const answer = prompt.acceptableAnswers[0];
      const result = evaluateVerbalFluencyAnswer(prompt, answer);
      expect(result.isCorrect).toBe(true);
      expect(result.feedbackType).toBe(FeedbackType.GUIDED);
    });

    test('sentence building with target word is correct', () => {
      const prompt = generateSentenceBuildingPrompt();
      const targetWord = prompt.prompt.match(/word "(\w+)"/)?.[1] || '';
      const sentence = `I really enjoy the ${targetWord} very much today`;
      const result = evaluateVerbalFluencyAnswer(prompt, sentence);
      expect(result.isCorrect).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(0.7);
    });

    test('word definition with keywords scores well', () => {
      const prompt = generateWordDefinitionPrompt();
      // Use the keyword-based acceptable answers
      const keywords = prompt.acceptableAnswers.slice(1, 3);
      const answer = `It is something related to ${keywords.join(' and ')}`;
      const result = evaluateVerbalFluencyAnswer(prompt, answer);
      expect(result.isCorrect).toBe(true);
    });

    test('storytelling with several words is celebrated', () => {
      const prompt = generateStorytellingPrompt();
      const result = evaluateVerbalFluencyAnswer(prompt, 'The character went on a long adventure through the forest and found many wonderful things along the way');
      expect(result.isCorrect).toBe(true);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
    });

    test('rhyming with valid rhyme is accepted', () => {
      const prompt = generateRhymingPrompt();
      const answer = prompt.acceptableAnswers.slice(0, 3).join(', ');
      const result = evaluateVerbalFluencyAnswer(prompt, answer);
      expect(result.isCorrect).toBe(true);
    });

    test('completely wrong answer gets supported feedback', () => {
      const prompt = generateSemanticFluencyPrompt();
      const result = evaluateVerbalFluencyAnswer(prompt, 'xyz123');
      expect(result.isCorrect).toBe(false);
      expect(result.feedbackType).toBe(FeedbackType.SUPPORTED);
    });
  });
});
