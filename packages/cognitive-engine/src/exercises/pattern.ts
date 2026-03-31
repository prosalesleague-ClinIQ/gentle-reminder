import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';
import { GeneratedPrompt, AnswerEvaluation } from './types';

const PATTERN_PROMPTS = [
  {
    prompt: 'What comes next? 2, 4, 6, 8, ?',
    expectedAnswer: '10',
    acceptableAnswers: ['10', 'ten'],
    hint: 'Each number goes up by 2',
    rule: 'counting by 2s',
  },
  {
    prompt: 'What comes next? 5, 10, 15, 20, ?',
    expectedAnswer: '25',
    acceptableAnswers: ['25', 'twenty-five', 'twenty five'],
    hint: 'Each number goes up by 5',
    rule: 'counting by 5s',
  },
  {
    prompt: 'What comes next? 1, 2, 4, 8, ?',
    expectedAnswer: '16',
    acceptableAnswers: ['16', 'sixteen'],
    hint: 'Each number doubles the one before it',
    rule: 'doubling',
  },
  {
    prompt: 'What comes next? 20, 18, 16, 14, ?',
    expectedAnswer: '12',
    acceptableAnswers: ['12', 'twelve'],
    hint: 'Each number goes down by 2',
    rule: 'counting down',
  },
];

export function generatePatternPrompt(): GeneratedPrompt {
  const pattern = PATTERN_PROMPTS[Math.floor(Math.random() * PATTERN_PROMPTS.length)];

  return {
    type: ExerciseType.PATTERN_MATCHING,
    domain: CognitiveDomain.EXECUTIVE_FUNCTION,
    prompt: pattern.prompt,
    expectedAnswer: pattern.expectedAnswer,
    acceptableAnswers: pattern.acceptableAnswers,
    hints: [
      pattern.hint,
      `The answer is ${pattern.expectedAnswer}`,
    ],
  };
}

export function evaluatePatternAnswer(
  givenAnswer: string,
  expectedAnswer: string,
): AnswerEvaluation {
  const normalizedGiven = givenAnswer.trim().toLowerCase();

  // Find the matching pattern to get acceptable answers
  const pattern = PATTERN_PROMPTS.find((p) => p.expectedAnswer === expectedAnswer);
  const acceptableAnswers = pattern?.acceptableAnswers ?? [expectedAnswer];

  const isCorrect = acceptableAnswers.some(
    (a) => normalizedGiven === a.toLowerCase(),
  );

  if (isCorrect) {
    return {
      isCorrect: true,
      feedbackType: FeedbackType.CELEBRATED,
      score: 1.0,
      feedbackMessage: `That's right, ${expectedAnswer}! You spotted the pattern!`,
      correctAnswer: expectedAnswer,
    };
  }

  // Check if the answer is a number but just wrong
  const givenNumber = parseInt(normalizedGiven, 10);
  if (!isNaN(givenNumber)) {
    return {
      isCorrect: false,
      feedbackType: FeedbackType.GUIDED,
      score: 0.25,
      feedbackMessage: `Good try! The pattern was ${pattern?.rule ?? 'a number pattern'}. The next number is ${expectedAnswer}.`,
      correctAnswer: expectedAnswer,
    };
  }

  return {
    isCorrect: false,
    feedbackType: FeedbackType.SUPPORTED,
    score: 0.0,
    feedbackMessage: `The answer is ${expectedAnswer}. Number patterns are great brain exercise!`,
    correctAnswer: expectedAnswer,
  };
}
