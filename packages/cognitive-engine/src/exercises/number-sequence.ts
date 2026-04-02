import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';
import { GeneratedPrompt, AnswerEvaluation } from './types';

const COUNTING_PROMPTS = [
  { prompt: 'Count forward from 1 to 5', answer: '1, 2, 3, 4, 5', check: ['1', '2', '3', '4', '5'] },
  { prompt: 'Count backward from 5 to 1', answer: '5, 4, 3, 2, 1', check: ['5', '4', '3', '2', '1'] },
  { prompt: 'Count by twos: 2, 4, 6, ...', answer: '8, 10', check: ['8', '10'] },
  { prompt: 'What number comes after 7?', answer: '8', check: ['8'] },
  { prompt: 'What number comes before 10?', answer: '9', check: ['9'] },
];

const SIMPLE_MATH = [
  { prompt: 'What is 2 + 3?', answer: '5', acceptableAnswers: ['5', 'five'] },
  { prompt: 'What is 10 - 4?', answer: '6', acceptableAnswers: ['6', 'six'] },
  { prompt: 'What is 3 + 3?', answer: '6', acceptableAnswers: ['6', 'six'] },
  { prompt: 'How many fingers on one hand?', answer: '5', acceptableAnswers: ['5', 'five'] },
  { prompt: 'How many days in a week?', answer: '7', acceptableAnswers: ['7', 'seven'] },
];

export function generateNumberSequencePrompt(): GeneratedPrompt {
  const item = COUNTING_PROMPTS[Math.floor(Math.random() * COUNTING_PROMPTS.length)];
  return {
    type: ExerciseType.PATTERN_MATCHING,
    domain: CognitiveDomain.ATTENTION,
    prompt: item.prompt,
    expectedAnswer: item.answer,
    acceptableAnswers: item.check,
    hints: [`Think about the numbers in order...`],
  };
}

export function generateSimpleMathPrompt(): GeneratedPrompt {
  const item = SIMPLE_MATH[Math.floor(Math.random() * SIMPLE_MATH.length)];
  return {
    type: ExerciseType.PATTERN_MATCHING,
    domain: CognitiveDomain.ATTENTION,
    prompt: item.prompt,
    expectedAnswer: item.answer,
    acceptableAnswers: item.acceptableAnswers,
    hints: [`Take your time, there's no rush.`, `The answer is ${item.answer}.`],
  };
}

export function evaluateNumberAnswer(
  givenAnswer: string,
  acceptableAnswers: string[],
  expectedAnswer: string,
): AnswerEvaluation {
  const normalized = givenAnswer.trim().toLowerCase().replace(/,\s*/g, ', ');
  const isCorrect = acceptableAnswers.some(a => normalized.includes(a.toLowerCase()));

  if (isCorrect) {
    return {
      isCorrect: true,
      feedbackType: FeedbackType.CELEBRATED,
      score: 1.0,
      feedbackMessage: `That's right! ${expectedAnswer}. Wonderful.`,
      correctAnswer: expectedAnswer,
    };
  }

  // Check if they got some numbers right
  const correctCount = acceptableAnswers.filter(a => normalized.includes(a.toLowerCase())).length;
  if (correctCount > 0) {
    return {
      isCorrect: false,
      feedbackType: FeedbackType.GUIDED,
      score: correctCount / acceptableAnswers.length,
      feedbackMessage: `You're on the right track. The answer is ${expectedAnswer}.`,
      correctAnswer: expectedAnswer,
    };
  }

  return {
    isCorrect: false,
    feedbackType: FeedbackType.SUPPORTED,
    score: 0.0,
    feedbackMessage: `The answer is ${expectedAnswer}. Numbers are great brain exercise.`,
    correctAnswer: expectedAnswer,
  };
}
