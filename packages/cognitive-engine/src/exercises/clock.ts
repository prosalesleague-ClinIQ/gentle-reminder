import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';
import { GeneratedPrompt, AnswerEvaluation } from './types';

const CLOCK_PROMPTS = [
  {
    prompt: 'If the short hand points to 3 and the long hand points to 12, what time is it?',
    expectedAnswer: '3:00',
    acceptableAnswers: ['3:00', '3 o\'clock', '3 oclock', 'three', 'three o\'clock', '3'],
    hint: 'The short hand tells the hour',
  },
  {
    prompt: 'If the short hand is between 6 and 7, and the long hand points to 6, what time is it?',
    expectedAnswer: '6:30',
    acceptableAnswers: ['6:30', 'half past 6', 'half past six', 'six thirty', '6 30'],
    hint: 'When the long hand points to 6, it means 30 minutes',
  },
  {
    prompt: 'What time do you usually eat lunch?',
    expectedAnswer: '12:00',
    acceptableAnswers: [
      '12:00', '12', 'noon', '12:30', '1:00', '1', '11:30', '11:00',
      'twelve', 'one', 'eleven', 'around noon', 'midday',
    ],
    hint: 'Most people eat lunch around the middle of the day',
  },
  {
    prompt: 'What time does the sun usually come up in the morning?',
    expectedAnswer: '6:00',
    acceptableAnswers: [
      '6:00', '6', '6:30', '7:00', '7', '5:30', '5:00', '5',
      'six', 'seven', 'early', 'sunrise', 'dawn',
    ],
    hint: 'Think about early morning, before most people start their day',
  },
];

export function generateClockPrompt(): GeneratedPrompt {
  const clock = CLOCK_PROMPTS[Math.floor(Math.random() * CLOCK_PROMPTS.length)];

  return {
    type: ExerciseType.CLOCK_TIME,
    domain: CognitiveDomain.ORIENTATION,
    prompt: clock.prompt,
    expectedAnswer: clock.expectedAnswer,
    acceptableAnswers: clock.acceptableAnswers,
    hints: [
      clock.hint,
      `A good answer would be "${clock.expectedAnswer}"`,
    ],
  };
}

export function evaluateClockAnswer(
  givenAnswer: string,
  acceptableAnswers: string[],
): AnswerEvaluation {
  const normalizedGiven = givenAnswer.trim().toLowerCase();

  const isCorrect = acceptableAnswers.some(
    (a) => normalizedGiven === a.toLowerCase(),
  );

  // Find the expected answer (first in the list is the canonical one)
  const expectedAnswer = acceptableAnswers[0] ?? '';

  if (isCorrect) {
    return {
      isCorrect: true,
      feedbackType: FeedbackType.CELEBRATED,
      score: 1.0,
      feedbackMessage: `That's right! Great job with time!`,
      correctAnswer: expectedAnswer,
    };
  }

  // Check if they gave a time-like answer (contains digits or time words)
  const isTimeRelated = /\d|o'clock|half|quarter|morning|evening|noon/.test(normalizedGiven);

  if (isTimeRelated) {
    return {
      isCorrect: false,
      feedbackType: FeedbackType.GUIDED,
      score: 0.25,
      feedbackMessage: `Close! The answer we were looking for is ${expectedAnswer}. You're doing great with time!`,
      correctAnswer: expectedAnswer,
    };
  }

  return {
    isCorrect: false,
    feedbackType: FeedbackType.SUPPORTED,
    score: 0.0,
    feedbackMessage: `The answer is ${expectedAnswer}. Thinking about time is a wonderful exercise!`,
    correctAnswer: expectedAnswer,
  };
}
