import { FeedbackType } from '@gentle-reminder/shared-types';
import { generateIdentityPrompt, evaluateIdentityAnswer } from '../src/exercises/identity';
import { PatientContext } from '../src/exercises/types';

const mockContext: PatientContext = {
  preferredName: 'Maggie',
  city: 'Portland',
  timezone: 'America/Los_Angeles',
  familyMembers: [
    { displayName: 'Lisa', relationship: 'child', photoUrl: 'https://example.com/lisa.jpg' },
    { displayName: 'Robert', relationship: 'spouse' },
    { displayName: 'Emma', relationship: 'grandchild' },
  ],
};

describe('Identity Exercises', () => {
  describe('generateIdentityPrompt', () => {
    it('generates a prompt from family members', () => {
      const prompt = generateIdentityPrompt(mockContext);
      expect(prompt).not.toBeNull();
      expect(prompt!.prompt).toBe('Who is this person?');
      expect(mockContext.familyMembers.map((m) => m.displayName)).toContain(
        prompt!.expectedAnswer,
      );
    });

    it('returns null when no family members', () => {
      const emptyContext: PatientContext = {
        ...mockContext,
        familyMembers: [],
      };
      const prompt = generateIdentityPrompt(emptyContext);
      expect(prompt).toBeNull();
    });

    it('provides options with max 3 choices', () => {
      const prompt = generateIdentityPrompt(mockContext);
      if (prompt?.options) {
        expect(prompt.options.length).toBeLessThanOrEqual(3);
        expect(prompt.options).toContain(prompt.expectedAnswer);
      }
    });
  });

  describe('evaluateIdentityAnswer', () => {
    it('celebrates correct answers', () => {
      const result = evaluateIdentityAnswer('Lisa', 'Lisa', ['Lisa', 'lisa']);
      expect(result.isCorrect).toBe(true);
      expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
      expect(result.score).toBe(1.0);
    });

    it('guides on partial matches', () => {
      const result = evaluateIdentityAnswer('Lis', 'Lisa', ['Lisa', 'lisa']);
      expect(result.isCorrect).toBe(false);
      expect(result.feedbackType).toBe(FeedbackType.GUIDED);
      expect(result.score).toBe(0.5);
    });

    it('supports on wrong answers warmly', () => {
      const result = evaluateIdentityAnswer('John', 'Lisa', ['Lisa', 'lisa']);
      expect(result.isCorrect).toBe(false);
      expect(result.feedbackType).toBe(FeedbackType.SUPPORTED);
      expect(result.feedbackMessage).toContain('Lisa');
      expect(result.feedbackMessage).not.toMatch(/wrong|incorrect|fail/i);
    });

    it('NEVER produces negative feedback types', () => {
      const answers = ['', 'xyz', 'wrong person', '!!!'];
      for (const answer of answers) {
        const result = evaluateIdentityAnswer(answer, 'Lisa', ['Lisa']);
        expect([FeedbackType.CELEBRATED, FeedbackType.GUIDED, FeedbackType.SUPPORTED]).toContain(
          result.feedbackType,
        );
      }
    });
  });
});
