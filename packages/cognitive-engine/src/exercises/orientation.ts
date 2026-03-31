import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';
import { GeneratedPrompt, AnswerEvaluation, PatientContext } from './types';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function generateDatePrompt(): GeneratedPrompt {
  const now = new Date();
  const dayName = DAY_NAMES[now.getDay()];

  return {
    type: ExerciseType.ORIENTATION_DATE,
    domain: CognitiveDomain.ORIENTATION,
    prompt: 'What day of the week is it today?',
    expectedAnswer: dayName,
    acceptableAnswers: [dayName, dayName.toLowerCase()],
    options: getDateOptions(dayName),
    hints: [
      `Today is a day that starts with "${dayName[0]}"`,
      `It comes after ${DAY_NAMES[(now.getDay() + 6) % 7]}`,
    ],
  };
}

export function generateNamePrompt(context: PatientContext): GeneratedPrompt {
  return {
    type: ExerciseType.ORIENTATION_NAME,
    domain: CognitiveDomain.ORIENTATION,
    prompt: 'What is your name?',
    expectedAnswer: context.preferredName,
    acceptableAnswers: [context.preferredName, context.preferredName.toLowerCase()],
    hints: [
      `Your name starts with "${context.preferredName[0]}"`,
      `It has ${context.preferredName.length} letters`,
    ],
  };
}

export function generateLocationPrompt(context: PatientContext): GeneratedPrompt {
  return {
    type: ExerciseType.ORIENTATION_LOCATION,
    domain: CognitiveDomain.ORIENTATION,
    prompt: 'What city are we in?',
    expectedAnswer: context.city,
    acceptableAnswers: [context.city, context.city.toLowerCase()],
    hints: [
      `The city starts with "${context.city[0]}"`,
      `It has ${context.city.length} letters`,
    ],
  };
}

export function evaluateOrientationAnswer(
  givenAnswer: string,
  expectedAnswer: string,
  acceptableAnswers: string[],
): AnswerEvaluation {
  const normalizedGiven = givenAnswer.trim().toLowerCase();
  const isCorrect = acceptableAnswers.some(
    (acceptable) => normalizedGiven === acceptable.toLowerCase(),
  );

  if (isCorrect) {
    return {
      isCorrect: true,
      feedbackType: FeedbackType.CELEBRATED,
      score: 1.0,
      feedbackMessage: "That's exactly right! Well done!",
      correctAnswer: expectedAnswer,
    };
  }

  // Check for partial match (e.g., "Port" for "Portland")
  const isPartial = expectedAnswer.toLowerCase().startsWith(normalizedGiven) && normalizedGiven.length >= 3;

  if (isPartial) {
    return {
      isCorrect: false,
      feedbackType: FeedbackType.GUIDED,
      score: 0.5,
      feedbackMessage: `You're very close! The answer is ${expectedAnswer}.`,
      correctAnswer: expectedAnswer,
    };
  }

  return {
    isCorrect: false,
    feedbackType: FeedbackType.SUPPORTED,
    score: 0.0,
    feedbackMessage: `That's okay. The answer is ${expectedAnswer}. Let's keep going!`,
    correctAnswer: expectedAnswer,
  };
}

function getDateOptions(correctDay: string): string[] {
  const allDays = [...DAY_NAMES];
  const filtered = allDays.filter((d) => d !== correctDay);
  // Pick 2 random wrong answers
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  const options = [correctDay, shuffled[0], shuffled[1]];
  // Shuffle the options
  return options.sort(() => Math.random() - 0.5);
}

export function generateMonthPrompt(): GeneratedPrompt {
  const now = new Date();
  const monthName = MONTH_NAMES[now.getMonth()];

  return {
    type: ExerciseType.ORIENTATION_DATE,
    domain: CognitiveDomain.ORIENTATION,
    prompt: 'What month are we in?',
    expectedAnswer: monthName,
    acceptableAnswers: [monthName, monthName.toLowerCase(), String(now.getMonth() + 1)],
    options: getMonthOptions(monthName),
    hints: [
      `This month starts with "${monthName[0]}"`,
      `We are in month number ${now.getMonth() + 1}`,
    ],
  };
}

function getMonthOptions(correctMonth: string): string[] {
  const filtered = MONTH_NAMES.filter((m) => m !== correctMonth);
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return [correctMonth, shuffled[0], shuffled[1]].sort(() => Math.random() - 0.5);
}
