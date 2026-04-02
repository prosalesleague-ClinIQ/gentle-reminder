/**
 * Attention and Concentration Exercises
 *
 * Exercises targeting sustained attention, selective attention,
 * and working memory for dementia patients. Includes letter cancellation,
 * digit span, trail making, counting, word detection, and symbol search.
 */

import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';
import { GeneratedPrompt, AnswerEvaluation } from './types';

// ---------------------------------------------------------------------------
// Data sets
// ---------------------------------------------------------------------------

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const LETTER_GRID_TEMPLATES = [
  { target: 'A', grid: 'B A C D A E A F G H A I J A K', expectedCount: 5 },
  { target: 'E', grid: 'E F G H E I J E K L M E N O E', expectedCount: 5 },
  { target: 'S', grid: 'S T U S V W S X Y S Z A S B C', expectedCount: 5 },
  { target: 'O', grid: 'P O Q O R O S O T U V O W X O', expectedCount: 5 },
  { target: 'M', grid: 'M N O P M Q R M S T M U V W M', expectedCount: 5 },
  { target: 'T', grid: 'A T B C T D E T F G T H I J T', expectedCount: 5 },
  { target: 'R', grid: 'R S T R U V R W X R Y Z R A B', expectedCount: 5 },
  { target: 'L', grid: 'K L M N L O P L Q R L S T L U', expectedCount: 5 },
];

const DIGIT_SEQUENCES = {
  easy: [
    [3, 7],
    [5, 2],
    [8, 1],
    [4, 9],
    [6, 3],
  ],
  medium: [
    [4, 7, 2],
    [9, 1, 5],
    [3, 8, 6],
    [7, 2, 9],
    [1, 5, 3],
  ],
  hard: [
    [4, 7, 2, 9],
    [5, 1, 8, 3],
    [9, 6, 2, 7],
    [3, 8, 1, 5],
    [7, 4, 9, 2],
  ],
  veryHard: [
    [4, 7, 2, 9, 5],
    [6, 1, 8, 3, 7],
    [9, 5, 2, 7, 4],
    [3, 8, 6, 1, 9],
    [7, 2, 5, 8, 3],
  ],
};

const TRAIL_MAKING_SEQUENCES = [
  { sequence: '1-A-2-B-3-C', description: 'Connect numbers and letters in alternating order', expected: '1-A-2-B-3-C' },
  { sequence: '1-A-2-B-3-C-4-D', description: 'Connect numbers and letters alternating: 1, A, 2, B, 3, C, 4, D', expected: '1-A-2-B-3-C-4-D' },
  { sequence: 'A-1-B-2-C-3', description: 'Connect letters then numbers alternating: A, 1, B, 2, C, 3', expected: 'A-1-B-2-C-3' },
  { sequence: '1-A-2-B-3-C-4-D-5-E', description: 'Longer alternating sequence up to 5/E', expected: '1-A-2-B-3-C-4-D-5-E' },
];

const COUNTING_PROMPTS = [
  { prompt: 'Count backwards from 10 to 1', expected: '10, 9, 8, 7, 6, 5, 4, 3, 2, 1', acceptable: ['10 9 8 7 6 5 4 3 2 1', '10,9,8,7,6,5,4,3,2,1'] },
  { prompt: 'Count by twos from 2 to 10', expected: '2, 4, 6, 8, 10', acceptable: ['2 4 6 8 10', '2,4,6,8,10'] },
  { prompt: 'Count by fives from 5 to 25', expected: '5, 10, 15, 20, 25', acceptable: ['5 10 15 20 25', '5,10,15,20,25'] },
  { prompt: 'Count backwards from 20 to 15', expected: '20, 19, 18, 17, 16, 15', acceptable: ['20 19 18 17 16 15', '20,19,18,17,16,15'] },
  { prompt: 'Count by tens from 10 to 50', expected: '10, 20, 30, 40, 50', acceptable: ['10 20 30 40 50', '10,20,30,40,50'] },
  { prompt: 'Count backwards by twos from 10 to 2', expected: '10, 8, 6, 4, 2', acceptable: ['10 8 6 4 2', '10,8,6,4,2'] },
];

const WORD_DETECTION_PROMPTS = [
  {
    instruction: 'Listen to these words and raise your hand (or say "yes") when you hear an animal',
    words: ['table', 'dog', 'chair', 'lamp', 'cat', 'book', 'bird'],
    targetCategory: 'animal',
    targets: ['dog', 'cat', 'bird'],
  },
  {
    instruction: 'Say "yes" each time you hear a fruit',
    words: ['pencil', 'apple', 'shirt', 'banana', 'window', 'orange', 'hat'],
    targetCategory: 'fruit',
    targets: ['apple', 'banana', 'orange'],
  },
  {
    instruction: 'Identify the colours in this list',
    words: ['house', 'blue', 'garden', 'red', 'music', 'green', 'paper'],
    targetCategory: 'colour',
    targets: ['blue', 'red', 'green'],
  },
  {
    instruction: 'Say "yes" each time you hear a body part',
    words: ['book', 'hand', 'lamp', 'foot', 'chair', 'head', 'flower'],
    targetCategory: 'body part',
    targets: ['hand', 'foot', 'head'],
  },
  {
    instruction: 'Identify the items of clothing in this list',
    words: ['tree', 'shirt', 'river', 'hat', 'mountain', 'sock', 'cloud'],
    targetCategory: 'clothing',
    targets: ['shirt', 'hat', 'sock'],
  },
  {
    instruction: 'Say "yes" each time you hear something you can eat',
    words: ['door', 'bread', 'road', 'cheese', 'bridge', 'soup', 'wall'],
    targetCategory: 'food',
    targets: ['bread', 'cheese', 'soup'],
  },
];

const SYMBOL_SEARCH_PROMPTS = [
  {
    prompt: 'How many times does the star (*) appear? * + * - * + - * +',
    target: '*',
    sequence: '* + * - * + - * +',
    expectedCount: 4,
  },
  {
    prompt: 'How many times does the plus (+) appear? + - + + - - + - +',
    target: '+',
    sequence: '+ - + + - - + - +',
    expectedCount: 5,
  },
  {
    prompt: 'How many circles (O) are there? O X O X X O O X O',
    target: 'O',
    sequence: 'O X O X X O O X O',
    expectedCount: 5,
  },
  {
    prompt: 'Count the number signs (#): # @ # @ @ # # @ #',
    target: '#',
    sequence: '# @ # @ @ # # @ #',
    expectedCount: 5,
  },
  {
    prompt: 'How many question marks (?) are there? ? ! ? ! ? ? ! ? !',
    target: '?',
    sequence: '? ! ? ! ? ? ! ? !',
    expectedCount: 5,
  },
  {
    prompt: 'Count the arrows (>): > < > > < > < > <',
    target: '>',
    sequence: '> < > > < > < > <',
    expectedCount: 5,
  },
];

// ---------------------------------------------------------------------------
// Prompt Generators
// ---------------------------------------------------------------------------

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a letter cancellation exercise.
 * Patient counts how many times a target letter appears in a grid.
 */
export function generateLetterCancellationPrompt(): GeneratedPrompt {
  const template = pickRandom(LETTER_GRID_TEMPLATES);

  return {
    type: ExerciseType.ATTENTION_LETTER_CANCELLATION,
    domain: CognitiveDomain.ATTENTION,
    prompt: `Find all the letter "${template.target}" in this sequence:\n\n${template.grid}\n\nHow many times does "${template.target}" appear?`,
    expectedAnswer: String(template.expectedCount),
    acceptableAnswers: [
      String(template.expectedCount),
      `${template.expectedCount} times`,
      `there are ${template.expectedCount}`,
    ],
    hints: [
      `Look carefully at each letter one at a time`,
      `The letter "${template.target}" appears more than ${template.expectedCount - 2} times`,
    ],
  };
}

/**
 * Generate a digit span exercise.
 * Patient repeats back a sequence of numbers.
 */
export function generateDigitSpanPrompt(length: number = 3): GeneratedPrompt {
  let pool: number[][];
  if (length <= 2) pool = DIGIT_SEQUENCES.easy;
  else if (length === 3) pool = DIGIT_SEQUENCES.medium;
  else if (length === 4) pool = DIGIT_SEQUENCES.hard;
  else pool = DIGIT_SEQUENCES.veryHard;

  const sequence = pickRandom(pool);
  const seqStr = sequence.join(', ');
  const answerStr = sequence.join(', ');
  const altFormats = [
    sequence.join(' '),
    sequence.join(','),
    sequence.join(', '),
    sequence.join('-'),
  ];

  return {
    type: ExerciseType.ATTENTION_DIGIT_SPAN,
    domain: CognitiveDomain.ATTENTION,
    prompt: `I am going to say some numbers. Please repeat them back to me in the same order:\n\n${seqStr}`,
    expectedAnswer: answerStr,
    acceptableAnswers: altFormats,
    hints: [
      `The first number is ${sequence[0]}`,
      `There are ${sequence.length} numbers in total`,
    ],
  };
}

/**
 * Generate a trail-making exercise.
 * Patient connects numbers and letters in alternating order.
 */
export function generateTrailMakingPrompt(): GeneratedPrompt {
  const template = pickRandom(TRAIL_MAKING_SEQUENCES);

  return {
    type: ExerciseType.ATTENTION_TRAIL_MAKING,
    domain: CognitiveDomain.ATTENTION,
    prompt: `${template.description}:\n\nWhat is the correct order?`,
    expectedAnswer: template.expected,
    acceptableAnswers: [
      template.expected,
      template.expected.replace(/-/g, ', '),
      template.expected.replace(/-/g, ' '),
    ],
    hints: [
      'Start with the number 1, then the letter A, then 2, then B, and so on',
      `The sequence starts with: ${template.expected.split('-').slice(0, 3).join('-')}`,
    ],
  };
}

/**
 * Generate a counting exercise.
 * Patient counts in a specific pattern.
 */
export function generateCountingPrompt(): GeneratedPrompt {
  const template = pickRandom(COUNTING_PROMPTS);

  return {
    type: ExerciseType.ATTENTION_COUNTING,
    domain: CognitiveDomain.ATTENTION,
    prompt: template.prompt,
    expectedAnswer: template.expected,
    acceptableAnswers: [template.expected, ...template.acceptable],
    hints: [
      `Start with the first number in the sequence`,
      `The sequence has ${template.expected.split(', ').length} numbers`,
    ],
  };
}

/**
 * Generate a word detection exercise.
 * Patient identifies target words from a category within a list.
 */
export function generateWordDetectionPrompt(): GeneratedPrompt {
  const template = pickRandom(WORD_DETECTION_PROMPTS);
  const wordList = template.words.join(', ');
  const answerStr = template.targets.join(', ');

  return {
    type: ExerciseType.ATTENTION_WORD_DETECTION,
    domain: CognitiveDomain.ATTENTION,
    prompt: `${template.instruction}:\n\n${wordList}\n\nWhich words are ${template.targetCategory}s?`,
    expectedAnswer: answerStr,
    acceptableAnswers: [
      answerStr,
      template.targets.join(' '),
      template.targets.join(', '),
      template.targets.join(' and '),
      ...template.targets, // Accept individual answers too
    ],
    hints: [
      `There are ${template.targets.length} ${template.targetCategory}s in the list`,
      `One of them is "${template.targets[0]}"`,
    ],
  };
}

/**
 * Generate a symbol search exercise.
 * Patient counts occurrences of a target symbol in a sequence.
 */
export function generateSymbolSearchPrompt(): GeneratedPrompt {
  const template = pickRandom(SYMBOL_SEARCH_PROMPTS);

  return {
    type: ExerciseType.ATTENTION_SYMBOL_SEARCH,
    domain: CognitiveDomain.ATTENTION,
    prompt: template.prompt,
    expectedAnswer: String(template.expectedCount),
    acceptableAnswers: [
      String(template.expectedCount),
      `${template.expectedCount} times`,
      `there are ${template.expectedCount}`,
    ],
    hints: [
      `Count each "${template.target}" one at a time, from left to right`,
      `There are more than ${template.expectedCount - 2} of them`,
    ],
  };
}

// ---------------------------------------------------------------------------
// Answer Evaluation
// ---------------------------------------------------------------------------

/**
 * Evaluate an answer for any attention exercise type.
 */
export function evaluateAttentionAnswer(
  prompt: GeneratedPrompt,
  givenAnswer: string,
): AnswerEvaluation {
  const normalised = givenAnswer.trim().toLowerCase();
  const expectedNormalised = prompt.expectedAnswer.toLowerCase();

  // Check exact or acceptable match
  const isCorrect =
    normalised === expectedNormalised ||
    prompt.acceptableAnswers.some((a) => normalised === a.toLowerCase()) ||
    prompt.acceptableAnswers.some((a) => normalised.includes(a.toLowerCase()));

  // Partial credit for close numeric answers (off by 1)
  let isClose = false;
  const numericAnswer = parseInt(normalised, 10);
  const numericExpected = parseInt(expectedNormalised, 10);
  if (!isNaN(numericAnswer) && !isNaN(numericExpected)) {
    isClose = Math.abs(numericAnswer - numericExpected) === 1;
  }

  let score: number;
  let feedbackType: FeedbackType;
  let feedbackMessage: string;

  if (isCorrect) {
    score = 1.0;
    feedbackType = FeedbackType.CELEBRATED;
    feedbackMessage = 'Wonderful! You got that exactly right. Great focus!';
  } else if (isClose) {
    score = 0.7;
    feedbackType = FeedbackType.GUIDED;
    feedbackMessage = `Very close! You said ${givenAnswer}, and the answer is ${prompt.expectedAnswer}. You were almost there.`;
  } else {
    score = 0.3;
    feedbackType = FeedbackType.SUPPORTED;
    feedbackMessage = `That was a tricky one. The answer is ${prompt.expectedAnswer}. Let us try another one together.`;
  }

  return {
    isCorrect,
    feedbackType,
    score,
    feedbackMessage,
    correctAnswer: prompt.expectedAnswer,
  };
}
