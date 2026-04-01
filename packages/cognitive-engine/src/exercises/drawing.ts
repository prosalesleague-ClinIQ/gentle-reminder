import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';
import { GeneratedPrompt, AnswerEvaluation } from './types';

const CLOCK_PROMPTS = [
  {
    prompt: 'Draw a clock showing 3 o\'clock. What numbers would be at the top?',
    answer: '12',
    acceptableAnswers: ['12', 'twelve', '12 oclock'],
    hint: 'The number at the very top of a clock',
  },
  {
    prompt: 'On a clock face, what number is directly opposite the 12?',
    answer: '6',
    acceptableAnswers: ['6', 'six'],
    hint: 'It\'s at the bottom of the clock',
  },
  {
    prompt: 'If the hour hand points to 9 and the minute hand points to 12, what time is it?',
    answer: '9 o\'clock',
    acceptableAnswers: ['9', '9:00', 'nine', '9 oclock', "9 o'clock", 'nine oclock'],
    hint: 'The hour hand tells us the hour',
  },
];

const SHAPE_PROMPTS = [
  {
    prompt: 'How many sides does a triangle have?',
    answer: '3',
    acceptableAnswers: ['3', 'three'],
  },
  {
    prompt: 'What shape has 4 equal sides?',
    answer: 'square',
    acceptableAnswers: ['square', 'a square'],
  },
  {
    prompt: 'What shape is a ball?',
    answer: 'circle',
    acceptableAnswers: ['circle', 'round', 'sphere', 'a circle'],
  },
];

export function generateClockDrawingPrompt(): GeneratedPrompt {
  const item = CLOCK_PROMPTS[Math.floor(Math.random() * CLOCK_PROMPTS.length)];
  return {
    type: ExerciseType.CLOCK_TIME,
    domain: CognitiveDomain.EXECUTIVE_FUNCTION,
    prompt: item.prompt,
    expectedAnswer: item.answer,
    acceptableAnswers: item.acceptableAnswers,
    hints: [item.hint || `Think about what a clock looks like...`],
  };
}

export function generateShapePrompt(): GeneratedPrompt {
  const item = SHAPE_PROMPTS[Math.floor(Math.random() * SHAPE_PROMPTS.length)];
  return {
    type: ExerciseType.PATTERN_MATCHING,
    domain: CognitiveDomain.EXECUTIVE_FUNCTION,
    prompt: item.prompt,
    expectedAnswer: item.answer,
    acceptableAnswers: item.acceptableAnswers,
    hints: [`Think about common shapes...`],
  };
}

export function evaluateDrawingAnswer(
  givenAnswer: string,
  acceptableAnswers: string[],
  expectedAnswer: string,
): AnswerEvaluation {
  const normalized = givenAnswer.trim().toLowerCase();
  const isCorrect = acceptableAnswers.some(a => normalized === a.toLowerCase());

  if (isCorrect) {
    return {
      isCorrect: true,
      feedbackType: FeedbackType.CELEBRATED,
      score: 1.0,
      feedbackMessage: `That's right! The answer is ${expectedAnswer}. Wonderful.`,
      correctAnswer: expectedAnswer,
    };
  }

  return {
    isCorrect: false,
    feedbackType: FeedbackType.SUPPORTED,
    score: 0.0,
    feedbackMessage: `The answer is ${expectedAnswer}. Clocks and shapes are great brain exercise.`,
    correctAnswer: expectedAnswer,
  };
}
