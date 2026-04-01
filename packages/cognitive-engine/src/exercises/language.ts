import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';
import { GeneratedPrompt, AnswerEvaluation } from './types';

const SENTENCE_COMPLETION = [
  { prompt: 'The sun rises in the ___', answer: 'east', acceptableAnswers: ['east', 'morning', 'sky'] },
  { prompt: 'You brush your teeth with a ___', answer: 'toothbrush', acceptableAnswers: ['toothbrush', 'brush'] },
  { prompt: 'Birds fly in the ___', answer: 'sky', acceptableAnswers: ['sky', 'air', 'clouds'] },
  { prompt: 'You sleep in a ___', answer: 'bed', acceptableAnswers: ['bed', 'bedroom'] },
];

const WORD_ASSOCIATION = [
  { prompt: 'What goes with "bread and ___"?', answer: 'butter', acceptableAnswers: ['butter', 'jam', 'cheese'] },
  { prompt: 'What goes with "salt and ___"?', answer: 'pepper', acceptableAnswers: ['pepper'] },
  { prompt: 'What goes with "cup and ___"?', answer: 'saucer', acceptableAnswers: ['saucer', 'plate', 'tea'] },
  { prompt: 'What goes with "shoes and ___"?', answer: 'socks', acceptableAnswers: ['socks', 'laces'] },
];

export function generateSentenceCompletionPrompt(): GeneratedPrompt {
  const item = SENTENCE_COMPLETION[Math.floor(Math.random() * SENTENCE_COMPLETION.length)];
  return {
    type: ExerciseType.ORIENTATION_NAME, // Reuse type for now
    domain: CognitiveDomain.LANGUAGE,
    prompt: item.prompt,
    expectedAnswer: item.answer,
    acceptableAnswers: item.acceptableAnswers,
    hints: [`The answer starts with "${item.answer[0].toUpperCase()}"`, `Think about everyday things...`],
  };
}

export function generateWordAssociationPrompt(): GeneratedPrompt {
  const item = WORD_ASSOCIATION[Math.floor(Math.random() * WORD_ASSOCIATION.length)];
  return {
    type: ExerciseType.ORIENTATION_NAME,
    domain: CognitiveDomain.LANGUAGE,
    prompt: item.prompt,
    expectedAnswer: item.answer,
    acceptableAnswers: item.acceptableAnswers,
    hints: [`It starts with "${item.answer[0].toUpperCase()}"`, `These two things go together...`],
  };
}

export function evaluateLanguageAnswer(
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
      feedbackMessage: `That's right! "${expectedAnswer}" - well done!`,
      correctAnswer: expectedAnswer,
    };
  }

  // Check partial match
  const isPartial = acceptableAnswers.some(a =>
    a.toLowerCase().startsWith(normalized) || normalized.startsWith(a.toLowerCase())
  ) && normalized.length >= 2;

  if (isPartial) {
    return {
      isCorrect: false,
      feedbackType: FeedbackType.GUIDED,
      score: 0.5,
      feedbackMessage: `You're close! The answer is "${expectedAnswer}".`,
      correctAnswer: expectedAnswer,
    };
  }

  return {
    isCorrect: false,
    feedbackType: FeedbackType.SUPPORTED,
    score: 0.0,
    feedbackMessage: `The answer is "${expectedAnswer}". That's a good one to remember!`,
    correctAnswer: expectedAnswer,
  };
}
