import { FeedbackType } from '@gentle-reminder/shared-types';
import {
  generateDatePrompt,
  generateNamePrompt,
  generateLocationPrompt,
  evaluateOrientationAnswer,
} from '../src/exercises/orientation';
import { PatientContext } from '../src/exercises/types';

const mockContext: PatientContext = {
  preferredName: 'Maggie',
  city: 'Portland',
  timezone: 'America/Los_Angeles',
  familyMembers: [],
};

describe('Orientation Exercises', () => {
  describe('generateDatePrompt', () => {
    it('generates a valid date prompt', () => {
      const prompt = generateDatePrompt();
      expect(prompt.prompt).toBe('What day of the week is it today?');
      expect(prompt.expectedAnswer).toBeTruthy();
      expect(prompt.acceptableAnswers.length).toBeGreaterThan(0);
    });

    it('provides 3 options', () => {
      const prompt = generateDatePrompt();
      expect(prompt.options).toHaveLength(3);
      expect(prompt.options).toContain(prompt.expectedAnswer);
    });

    it('provides hints', () => {
      const prompt = generateDatePrompt();
      expect(prompt.hints.length).toBeGreaterThan(0);
    });
  });

  describe('generateNamePrompt', () => {
    it('uses the patient preferred name', () => {
      const prompt = generateNamePrompt(mockContext);
      expect(prompt.expectedAnswer).toBe('Maggie');
      expect(prompt.prompt).toBe('What is your name?');
    });
  });

  describe('generateLocationPrompt', () => {
    it('uses the patient city', () => {
      const prompt = generateLocationPrompt(mockContext);
      expect(prompt.expectedAnswer).toBe('Portland');
    });
  });

  describe('evaluateOrientationAnswer', () => {
    it('celebrates correct answers', () => {
      const result = evaluateOrientationAnswer('Portland', 'Portland', ['Portland', 'portland']);
      expect(result.isCorrect).toBe(true);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
      expect(result.score).toBe(1.0);
    });

    it('celebrates case-insensitive matches', () => {
      const result = evaluateOrientationAnswer('portland', 'Portland', ['Portland', 'portland']);
      expect(result.isCorrect).toBe(true);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
    });

    it('guides on partial matches', () => {
      const result = evaluateOrientationAnswer('Port', 'Portland', ['Portland', 'portland']);
      expect(result.isCorrect).toBe(false);
      expect(result.feedbackType).toBe(FeedbackType.GUIDED);
      expect(result.score).toBe(0.5);
    });

    it('supports on wrong answers', () => {
      const result = evaluateOrientationAnswer('Seattle', 'Portland', ['Portland', 'portland']);
      expect(result.isCorrect).toBe(false);
      expect(result.feedbackType).toBe(FeedbackType.SUPPORTED);
      expect(result.score).toBe(0.0);
    });

    it('NEVER produces negative feedback', () => {
      const wrongAnswers = ['', 'xyz', '12345', 'completely wrong', '!@#$'];
      for (const answer of wrongAnswers) {
        const result = evaluateOrientationAnswer(answer, 'Portland', ['Portland']);
        expect([FeedbackType.CELEBRATED, FeedbackType.GUIDED, FeedbackType.SUPPORTED]).toContain(
          result.feedbackType,
        );
        expect(result.feedbackMessage).not.toMatch(/wrong|incorrect|fail|bad|no/i);
      }
    });
  });
});
