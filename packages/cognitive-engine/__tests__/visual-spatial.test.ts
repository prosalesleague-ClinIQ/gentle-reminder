/**
 * Tests for Visual-Spatial Exercises
 */

import {
  generateDirectionPrompt,
  generateMazeDescriptionPrompt,
  generateSpatialRelationPrompt,
  generateClockPositionPrompt,
  generateMapReadingPrompt,
  generateShapeMatchingPrompt,
  evaluateVisualSpatialAnswer,
} from '../src/exercises/visual-spatial';
import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';

describe('Visual-Spatial Exercises', () => {
  // -----------------------------------------------------------------------
  // Direction
  // -----------------------------------------------------------------------

  describe('generateDirectionPrompt', () => {
    test('returns a valid direction prompt', () => {
      const prompt = generateDirectionPrompt();
      expect(prompt.type).toBe(ExerciseType.VISUAL_SPATIAL_DIRECTION);
      expect(prompt.domain).toBe(CognitiveDomain.VISUAL_SPATIAL);
      expect(prompt.expectedAnswer).toBeDefined();
      expect(prompt.hints.length).toBeGreaterThan(0);
    });
  });

  // -----------------------------------------------------------------------
  // Maze Description
  // -----------------------------------------------------------------------

  describe('generateMazeDescriptionPrompt', () => {
    test('returns a maze/direction following prompt', () => {
      const prompt = generateMazeDescriptionPrompt();
      expect(prompt.type).toBe(ExerciseType.VISUAL_SPATIAL_MAZE);
      expect(prompt.expectedAnswer).toBeDefined();
    });
  });

  // -----------------------------------------------------------------------
  // Spatial Relation
  // -----------------------------------------------------------------------

  describe('generateSpatialRelationPrompt', () => {
    test('returns a spatial relationship prompt', () => {
      const prompt = generateSpatialRelationPrompt();
      expect(prompt.type).toBe(ExerciseType.VISUAL_SPATIAL_RELATION);
      expect(prompt.prompt).toContain('?');
    });
  });

  // -----------------------------------------------------------------------
  // Clock Position
  // -----------------------------------------------------------------------

  describe('generateClockPositionPrompt', () => {
    test('returns a clock-based spatial prompt', () => {
      const prompt = generateClockPositionPrompt();
      expect(prompt.type).toBe(ExerciseType.VISUAL_SPATIAL_CLOCK_POSITION);
      expect(prompt.prompt.toLowerCase()).toContain('clock');
    });
  });

  // -----------------------------------------------------------------------
  // Map Reading
  // -----------------------------------------------------------------------

  describe('generateMapReadingPrompt', () => {
    test('returns a map reading prompt', () => {
      const prompt = generateMapReadingPrompt();
      expect(prompt.type).toBe(ExerciseType.VISUAL_SPATIAL_MAP_READING);
      expect(prompt.prompt.toLowerCase()).toContain('map');
    });
  });

  // -----------------------------------------------------------------------
  // Shape Matching
  // -----------------------------------------------------------------------

  describe('generateShapeMatchingPrompt', () => {
    test('returns a shape matching prompt with options', () => {
      const prompt = generateShapeMatchingPrompt();
      expect(prompt.type).toBe(ExerciseType.VISUAL_SPATIAL_SHAPE_MATCHING);
      expect(prompt.options).toBeDefined();
      expect(prompt.options!.length).toBe(3);
    });
  });

  // -----------------------------------------------------------------------
  // Answer Evaluation
  // -----------------------------------------------------------------------

  describe('evaluateVisualSpatialAnswer', () => {
    test('correct answer is celebrated', () => {
      const prompt = generateDirectionPrompt();
      const result = evaluateVisualSpatialAnswer(prompt, prompt.expectedAnswer);
      expect(result.isCorrect).toBe(true);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
      expect(result.score).toBe(1.0);
    });

    test('case-insensitive matching works', () => {
      const prompt = generateDirectionPrompt();
      const result = evaluateVisualSpatialAnswer(prompt, prompt.expectedAnswer.toUpperCase());
      expect(result.isCorrect).toBe(true);
    });

    test('completely wrong answer gets supported feedback', () => {
      const prompt = generateDirectionPrompt();
      const result = evaluateVisualSpatialAnswer(prompt, 'purple');
      expect(result.isCorrect).toBe(false);
      expect(result.feedbackType).toBe(FeedbackType.SUPPORTED);
      expect(result.score).toBe(0.2);
    });

    test('spatial relation correct answer works', () => {
      const prompt = generateSpatialRelationPrompt();
      const result = evaluateVisualSpatialAnswer(prompt, prompt.expectedAnswer);
      expect(result.isCorrect).toBe(true);
    });

    test('shape matching correct answer works', () => {
      const prompt = generateShapeMatchingPrompt();
      const result = evaluateVisualSpatialAnswer(prompt, prompt.expectedAnswer);
      expect(result.isCorrect).toBe(true);
      expect(result.score).toBe(1.0);
    });

    test('clock position correct answer works', () => {
      const prompt = generateClockPositionPrompt();
      const result = evaluateVisualSpatialAnswer(prompt, prompt.expectedAnswer);
      expect(result.isCorrect).toBe(true);
    });

    test('feedback message always includes correct answer on wrong response', () => {
      const prompt = generateMapReadingPrompt();
      const result = evaluateVisualSpatialAnswer(prompt, 'wrong_answer_xyz');
      expect(result.feedbackMessage).toContain(prompt.expectedAnswer);
    });
  });
});
