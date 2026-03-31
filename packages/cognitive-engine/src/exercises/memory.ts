import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';
import { GeneratedPrompt, AnswerEvaluation } from './types';

const CATEGORY_PROMPTS = [
  {
    prompt: 'Can you name three fruits?',
    examples: ['apple', 'banana', 'orange', 'grape', 'strawberry', 'pear', 'peach', 'mango', 'watermelon', 'blueberry'],
    category: 'fruits',
  },
  {
    prompt: 'Can you name three animals?',
    examples: ['dog', 'cat', 'horse', 'bird', 'fish', 'rabbit', 'cow', 'pig', 'sheep', 'chicken'],
    category: 'animals',
  },
  {
    prompt: 'Can you name three colors?',
    examples: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'white', 'black', 'brown'],
    category: 'colors',
  },
];

const OBJECT_PROMPTS = [
  {
    prompt: 'What do you use to cut paper?',
    expectedAnswer: 'scissors',
    acceptableAnswers: ['scissors', 'knife', 'cutter', 'shears'],
  },
  {
    prompt: 'What do you use to tell the time?',
    expectedAnswer: 'clock',
    acceptableAnswers: ['clock', 'watch', 'phone', 'timepiece'],
  },
  {
    prompt: 'What do you use to eat soup?',
    expectedAnswer: 'spoon',
    acceptableAnswers: ['spoon', 'ladle', 'bowl and spoon'],
  },
  {
    prompt: 'What keeps you dry when it rains?',
    expectedAnswer: 'umbrella',
    acceptableAnswers: ['umbrella', 'raincoat', 'coat', 'jacket'],
  },
];

const SEQUENCE_ITEMS = ['apple', 'book', 'chair', 'dog', 'egg', 'flower', 'glass', 'hat'];

export function generateCategoryPrompt(): GeneratedPrompt {
  const category = CATEGORY_PROMPTS[Math.floor(Math.random() * CATEGORY_PROMPTS.length)];

  return {
    type: ExerciseType.MEMORY_CATEGORY,
    domain: CognitiveDomain.MEMORY,
    prompt: category.prompt,
    expectedAnswer: category.examples.slice(0, 3).join(', '),
    acceptableAnswers: category.examples,
    hints: [
      `Think about ${category.category} you might see at a market`,
      `One common ${category.category.slice(0, -1)} is "${category.examples[0]}"`,
    ],
  };
}

export function generateObjectPrompt(): GeneratedPrompt {
  const object = OBJECT_PROMPTS[Math.floor(Math.random() * OBJECT_PROMPTS.length)];

  return {
    type: ExerciseType.MEMORY_OBJECT,
    domain: CognitiveDomain.MEMORY,
    prompt: object.prompt,
    expectedAnswer: object.expectedAnswer,
    acceptableAnswers: object.acceptableAnswers,
    options: getObjectOptions(object.expectedAnswer),
    hints: [
      `It starts with the letter "${object.expectedAnswer[0].toUpperCase()}"`,
      `The answer is "${object.expectedAnswer}"`,
    ],
  };
}

export function generateSequencePrompt(length: number = 3): GeneratedPrompt {
  const shuffled = [...SEQUENCE_ITEMS].sort(() => Math.random() - 0.5);
  const sequence = shuffled.slice(0, Math.min(length, SEQUENCE_ITEMS.length));

  return {
    type: ExerciseType.MEMORY_SEQUENCE,
    domain: CognitiveDomain.MEMORY,
    prompt: `Remember these words: ${sequence.join(', ')}. Can you repeat them back?`,
    expectedAnswer: sequence.join(', '),
    acceptableAnswers: sequence,
    hints: [
      `The first word was "${sequence[0]}"`,
      `There were ${sequence.length} words to remember`,
    ],
  };
}

export function evaluateCategoryAnswer(
  givenAnswer: string,
  acceptableAnswers: string[],
  expectedCount: number = 3,
): AnswerEvaluation {
  const givenItems = givenAnswer
    .split(/[,\s]+/)
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0);

  const validItems = givenItems.filter((item) =>
    acceptableAnswers.some((acceptable) => acceptable.toLowerCase() === item),
  );

  const score = Math.min(validItems.length / expectedCount, 1.0);

  if (validItems.length >= expectedCount) {
    return {
      isCorrect: true,
      feedbackType: FeedbackType.CELEBRATED,
      score: 1.0,
      feedbackMessage: `Wonderful! You named ${validItems.length} - that's great!`,
      correctAnswer: acceptableAnswers.slice(0, expectedCount).join(', '),
    };
  }

  if (validItems.length > 0) {
    return {
      isCorrect: false,
      feedbackType: FeedbackType.GUIDED,
      score,
      feedbackMessage: `Great job naming ${validItems.length}! Some others could be ${acceptableAnswers
        .filter((a) => !validItems.includes(a.toLowerCase()))
        .slice(0, 2)
        .join(' and ')}.`,
      correctAnswer: acceptableAnswers.slice(0, expectedCount).join(', '),
    };
  }

  return {
    isCorrect: false,
    feedbackType: FeedbackType.SUPPORTED,
    score: 0.0,
    feedbackMessage: `That's alright! Some examples are ${acceptableAnswers.slice(0, 3).join(', ')}. Let's keep going!`,
    correctAnswer: acceptableAnswers.slice(0, expectedCount).join(', '),
  };
}

export function evaluateObjectAnswer(
  givenAnswer: string,
  acceptableAnswers: string[],
  expectedAnswer: string,
): AnswerEvaluation {
  const normalizedGiven = givenAnswer.trim().toLowerCase();
  const isCorrect = acceptableAnswers.some((a) => normalizedGiven === a.toLowerCase());

  if (isCorrect) {
    return {
      isCorrect: true,
      feedbackType: FeedbackType.CELEBRATED,
      score: 1.0,
      feedbackMessage: `That's right! ${givenAnswer} - well done!`,
      correctAnswer: expectedAnswer,
    };
  }

  return {
    isCorrect: false,
    feedbackType: FeedbackType.SUPPORTED,
    score: 0.0,
    feedbackMessage: `The answer is ${expectedAnswer}. That's a good one to remember!`,
    correctAnswer: expectedAnswer,
  };
}

export function evaluateSequenceAnswer(
  givenAnswer: string,
  expectedSequence: string[],
): AnswerEvaluation {
  const givenItems = givenAnswer
    .split(/[,\s]+/)
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0);

  let correctCount = 0;
  for (let i = 0; i < expectedSequence.length; i++) {
    if (givenItems[i]?.toLowerCase() === expectedSequence[i].toLowerCase()) {
      correctCount++;
    }
  }

  const score = correctCount / expectedSequence.length;

  if (correctCount === expectedSequence.length) {
    return {
      isCorrect: true,
      feedbackType: FeedbackType.CELEBRATED,
      score: 1.0,
      feedbackMessage: 'Perfect! You remembered all of them!',
      correctAnswer: expectedSequence.join(', '),
    };
  }

  if (correctCount > 0) {
    return {
      isCorrect: false,
      feedbackType: FeedbackType.GUIDED,
      score,
      feedbackMessage: `You remembered ${correctCount} out of ${expectedSequence.length}! The words were: ${expectedSequence.join(', ')}.`,
      correctAnswer: expectedSequence.join(', '),
    };
  }

  return {
    isCorrect: false,
    feedbackType: FeedbackType.SUPPORTED,
    score: 0.0,
    feedbackMessage: `The words were: ${expectedSequence.join(', ')}. Memory exercises help keep your mind sharp!`,
    correctAnswer: expectedSequence.join(', '),
  };
}

function getObjectOptions(correctAnswer: string): string[] {
  const allAnswers = OBJECT_PROMPTS.map((o) => o.expectedAnswer);
  const others = allAnswers.filter((a) => a !== correctAnswer);
  const shuffled = others.sort(() => Math.random() - 0.5);
  return [correctAnswer, shuffled[0], shuffled[1]].sort(() => Math.random() - 0.5);
}
