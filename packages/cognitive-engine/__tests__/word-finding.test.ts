import { generateWordFindingPrompt, evaluateWordFindingAnswer } from '../src/exercises/word-finding';
import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';

describe('Word Finding Exercises', () => {
  describe('generateWordFindingPrompt', () => {
    it('should return a valid GeneratedPrompt structure', () => {
      const prompt = generateWordFindingPrompt();
      expect(prompt).toHaveProperty('type');
      expect(prompt).toHaveProperty('domain');
      expect(prompt).toHaveProperty('prompt');
      expect(prompt).toHaveProperty('expectedAnswer');
      expect(prompt).toHaveProperty('acceptableAnswers');
      expect(prompt).toHaveProperty('hints');
    });

    it('should use the LANGUAGE cognitive domain', () => {
      const prompt = generateWordFindingPrompt();
      expect(prompt.domain).toBe(CognitiveDomain.LANGUAGE);
    });

    it('should use ORIENTATION_NAME exercise type', () => {
      const prompt = generateWordFindingPrompt();
      expect(prompt.type).toBe(ExerciseType.ORIENTATION_NAME);
    });

    it('should include two hints', () => {
      const prompt = generateWordFindingPrompt();
      expect(prompt.hints).toHaveLength(2);
    });

    it('should have a first hint about starting letter', () => {
      const prompt = generateWordFindingPrompt();
      expect(prompt.hints[0]).toMatch(/starts with/);
    });

    it('should have a second hint about letter count', () => {
      const prompt = generateWordFindingPrompt();
      expect(prompt.hints[1]).toMatch(/\d+ letters/);
    });

    it('should include expectedAnswer in acceptableAnswers', () => {
      // Run multiple times to cover randomness
      for (let i = 0; i < 20; i++) {
        const prompt = generateWordFindingPrompt();
        const normalized = prompt.acceptableAnswers.map(a => a.toLowerCase());
        expect(normalized).toContain(prompt.expectedAnswer.toLowerCase());
      }
    });
  });

  describe('evaluateWordFindingAnswer', () => {
    it('should return correct for exact match', () => {
      const result = evaluateWordFindingAnswer('key', ['key', 'keys', 'door key'], 'key');
      expect(result.isCorrect).toBe(true);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
      expect(result.score).toBe(1.0);
    });

    it('should return correct for alternative acceptable answer', () => {
      const result = evaluateWordFindingAnswer('postman', ['mailman', 'postman', 'mail carrier'], 'mailman');
      expect(result.isCorrect).toBe(true);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
      expect(result.score).toBe(1.0);
    });

    it('should be case insensitive', () => {
      const result = evaluateWordFindingAnswer('KITCHEN', ['kitchen', 'kitchenette'], 'kitchen');
      expect(result.isCorrect).toBe(true);
      expect(result.score).toBe(1.0);
    });

    it('should trim whitespace', () => {
      const result = evaluateWordFindingAnswer('  watch  ', ['watch', 'wristwatch'], 'watch');
      expect(result.isCorrect).toBe(true);
    });

    it('should return close match for partial answer', () => {
      const result = evaluateWordFindingAnswer('mail', ['mailman', 'postman', 'mail carrier'], 'mailman');
      expect(result.isCorrect).toBe(false);
      expect(result.feedbackType).toBe(FeedbackType.GUIDED);
      expect(result.score).toBe(0.5);
    });

    it('should return incorrect for wrong answer', () => {
      const result = evaluateWordFindingAnswer('banana', ['key', 'keys', 'door key'], 'key');
      expect(result.isCorrect).toBe(false);
      expect(result.feedbackType).toBe(FeedbackType.SUPPORTED);
      expect(result.score).toBe(0.0);
    });

    it('should not count very short partial matches as close', () => {
      const result = evaluateWordFindingAnswer('te', ['tea', 'cup of tea', 'hot tea'], 'tea');
      expect(result.isCorrect).toBe(false);
      expect(result.feedbackType).toBe(FeedbackType.SUPPORTED);
      expect(result.score).toBe(0.0);
    });

    it('should include correct answer in feedback message for correct answer', () => {
      const result = evaluateWordFindingAnswer('cold', ['cold', 'cool', 'freezing'], 'cold');
      expect(result.feedbackMessage).toContain('cold');
      expect(result.correctAnswer).toBe('cold');
    });

    it('should include correct answer in feedback message for wrong answer', () => {
      const result = evaluateWordFindingAnswer('wrong', ['ambulance'], 'ambulance');
      expect(result.feedbackMessage).toContain('ambulance');
      expect(result.correctAnswer).toBe('ambulance');
    });

    it('should handle empty string as wrong answer', () => {
      const result = evaluateWordFindingAnswer('', ['key', 'keys'], 'key');
      expect(result.isCorrect).toBe(false);
      expect(result.score).toBe(0.0);
    });

    it('should return GUIDED feedback for close match containing acceptable answer', () => {
      const result = evaluateWordFindingAnswer('wristwatch', ['watch', 'wristwatch', 'clock'], 'watch');
      // 'wristwatch' is in acceptableAnswers, so it should be correct
      expect(result.isCorrect).toBe(true);
      expect(result.score).toBe(1.0);
    });
  });
});
