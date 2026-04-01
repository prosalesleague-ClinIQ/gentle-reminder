import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';
import { GeneratedPrompt, AnswerEvaluation } from './types';

const DESCRIPTION_PROMPTS = [
  {
    prompt: 'What is the word for the thing you use to open a door?',
    answer: 'key',
    acceptableAnswers: ['key', 'keys', 'door key', 'handle', 'doorknob'],
  },
  {
    prompt: 'What do you call the person who delivers your letters?',
    answer: 'mailman',
    acceptableAnswers: ['mailman', 'postman', 'mail carrier', 'letter carrier', 'postal worker'],
  },
  {
    prompt: 'What is the thing you wear on your wrist to tell the time?',
    answer: 'watch',
    acceptableAnswers: ['watch', 'wristwatch', 'clock'],
  },
  {
    prompt: 'What do you call the room where you cook food?',
    answer: 'kitchen',
    acceptableAnswers: ['kitchen', 'kitchenette'],
  },
  {
    prompt: 'What is the word for the vehicle that takes you to the hospital in an emergency?',
    answer: 'ambulance',
    acceptableAnswers: ['ambulance'],
  },
  {
    prompt: 'What do you call the warm drink made from tea leaves and hot water?',
    answer: 'tea',
    acceptableAnswers: ['tea', 'cup of tea', 'hot tea'],
  },
];

const OPPOSITE_PROMPTS = [
  { prompt: 'What is the opposite of hot?', answer: 'cold', acceptableAnswers: ['cold', 'cool', 'freezing'] },
  { prompt: 'What is the opposite of big?', answer: 'small', acceptableAnswers: ['small', 'little', 'tiny'] },
  { prompt: 'What is the opposite of happy?', answer: 'sad', acceptableAnswers: ['sad', 'unhappy', 'upset'] },
  { prompt: 'What is the opposite of day?', answer: 'night', acceptableAnswers: ['night', 'nighttime', 'dark'] },
];

export function generateWordFindingPrompt(): GeneratedPrompt {
  const all = [...DESCRIPTION_PROMPTS, ...OPPOSITE_PROMPTS];
  const item = all[Math.floor(Math.random() * all.length)];
  return {
    type: ExerciseType.ORIENTATION_NAME,
    domain: CognitiveDomain.LANGUAGE,
    prompt: item.prompt,
    expectedAnswer: item.answer,
    acceptableAnswers: item.acceptableAnswers,
    hints: [
      `The word starts with "${item.answer[0].toUpperCase()}"`,
      `It has ${item.answer.length} letters`,
    ],
  };
}

export function evaluateWordFindingAnswer(
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
      feedbackMessage: `Yes! "${expectedAnswer}" - that's exactly right. Well done.`,
      correctAnswer: expectedAnswer,
    };
  }

  const isClose = acceptableAnswers.some(a =>
    a.toLowerCase().includes(normalized) || normalized.includes(a.toLowerCase())
  ) && normalized.length >= 3;

  if (isClose) {
    return {
      isCorrect: false,
      feedbackType: FeedbackType.GUIDED,
      score: 0.5,
      feedbackMessage: `You're very close. The word is "${expectedAnswer}".`,
      correctAnswer: expectedAnswer,
    };
  }

  return {
    isCorrect: false,
    feedbackType: FeedbackType.SUPPORTED,
    score: 0.0,
    feedbackMessage: `The word is "${expectedAnswer}". That's a good one to remember.`,
    correctAnswer: expectedAnswer,
  };
}
