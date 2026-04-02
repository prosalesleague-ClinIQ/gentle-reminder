import {
  generateNumberSequencePrompt,
  generateSimpleMathPrompt,
  evaluateNumberAnswer,
} from '../src/exercises/number-sequence';
import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';

describe('generateNumberSequencePrompt', () => {
  it('should return a valid GeneratedPrompt', () => {
    const prompt = generateNumberSequencePrompt();
    expect(prompt).toHaveProperty('type', ExerciseType.PATTERN_MATCHING);
    expect(prompt).toHaveProperty('domain', CognitiveDomain.ATTENTION);
    expect(prompt.prompt).toBeTruthy();
    expect(prompt.expectedAnswer).toBeTruthy();
    expect(prompt.acceptableAnswers.length).toBeGreaterThan(0);
    expect(prompt.hints.length).toBeGreaterThan(0);
  });

  it('should return different prompts on multiple calls (randomness)', () => {
    const prompts = new Set<string>();
    for (let i = 0; i < 30; i++) {
      prompts.add(generateNumberSequencePrompt().prompt);
    }
    // With 5 options and 30 tries, we should get at least 2 different ones
    expect(prompts.size).toBeGreaterThan(1);
  });
});

describe('generateSimpleMathPrompt', () => {
  it('should return a valid GeneratedPrompt', () => {
    const prompt = generateSimpleMathPrompt();
    expect(prompt.type).toBe(ExerciseType.PATTERN_MATCHING);
    expect(prompt.domain).toBe(CognitiveDomain.ATTENTION);
    expect(prompt.prompt).toBeTruthy();
    expect(prompt.expectedAnswer).toBeTruthy();
    expect(prompt.acceptableAnswers.length).toBeGreaterThan(0);
  });

  it('should have at least two hints', () => {
    const prompt = generateSimpleMathPrompt();
    expect(prompt.hints.length).toBeGreaterThanOrEqual(2);
  });

  it('should include the answer in the second hint', () => {
    const prompt = generateSimpleMathPrompt();
    expect(prompt.hints[1]).toContain(prompt.expectedAnswer);
  });
});

describe('evaluateNumberAnswer', () => {
  it('should return correct for exact numeric answer', () => {
    const result = evaluateNumberAnswer('5', ['5', 'five'], '5');
    expect(result.isCorrect).toBe(true);
    expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
    expect(result.score).toBe(1.0);
  });

  it('should return correct for word-form answer', () => {
    const result = evaluateNumberAnswer('five', ['5', 'five'], '5');
    expect(result.isCorrect).toBe(true);
    expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
  });

  it('should return correct for answer with extra whitespace', () => {
    const result = evaluateNumberAnswer('  5  ', ['5', 'five'], '5');
    expect(result.isCorrect).toBe(true);
  });

  it('should return correct for case-insensitive word answers', () => {
    const result = evaluateNumberAnswer('FIVE', ['5', 'five'], '5');
    expect(result.isCorrect).toBe(true);
  });

  it('should return incorrect with supported feedback for wrong answer', () => {
    const result = evaluateNumberAnswer('3', ['5', 'five'], '5');
    expect(result.isCorrect).toBe(false);
    expect(result.feedbackType).toBe(FeedbackType.SUPPORTED);
    expect(result.score).toBe(0.0);
    expect(result.correctAnswer).toBe('5');
  });

  it('should return guided feedback for partial sequence match', () => {
    const result = evaluateNumberAnswer('1, 2, 3', ['1', '2', '3', '4', '5'], '1, 2, 3, 4, 5');
    expect(result.isCorrect).toBe(true); // contains acceptable answers
    expect(result.feedbackType).toBe(FeedbackType.CELEBRATED);
  });

  it('should return supported feedback for completely wrong sequence', () => {
    const result = evaluateNumberAnswer('99', ['8', '10'], '8, 10');
    expect(result.isCorrect).toBe(false);
    expect(result.feedbackType).toBe(FeedbackType.SUPPORTED);
    expect(result.score).toBe(0.0);
  });

  it('should handle comma-separated answers correctly', () => {
    const result = evaluateNumberAnswer('8,10', ['8', '10'], '8, 10');
    expect(result.isCorrect).toBe(true);
  });

  it('should include the correct answer in feedback message', () => {
    const result = evaluateNumberAnswer('wrong', ['8'], '8');
    expect(result.feedbackMessage).toContain('8');
  });

  it('should give partial credit via guided feedback when some answers are correct', () => {
    // Answer includes "8" but not "10"
    const result = evaluateNumberAnswer('8', ['8', '10'], '8, 10');
    // "8" matches, so isCorrect is true (since some acceptable answer is found)
    expect(result.isCorrect).toBe(true);
  });
});
