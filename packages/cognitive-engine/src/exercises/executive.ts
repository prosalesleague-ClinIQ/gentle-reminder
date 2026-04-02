/**
 * Executive Function Exercises
 *
 * Exercises targeting categorization, problem solving, sequencing,
 * planning, inhibition, and cognitive flexibility for dementia patients.
 */

import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';
import { GeneratedPrompt, AnswerEvaluation } from './types';

// ---------------------------------------------------------------------------
// Data sets
// ---------------------------------------------------------------------------

const CATEGORIZATION_PROMPTS = [
  {
    prompt: 'Which one does not belong: apple, banana, car, orange?',
    expected: 'car',
    acceptable: ['car', 'the car', 'a car'],
    explanation: 'Apple, banana, and orange are all fruits, but a car is not.',
  },
  {
    prompt: 'Which one does not belong: dog, cat, table, rabbit?',
    expected: 'table',
    acceptable: ['table', 'the table', 'a table'],
    explanation: 'Dog, cat, and rabbit are all animals, but a table is furniture.',
  },
  {
    prompt: 'Which one does not belong: shirt, pants, book, hat?',
    expected: 'book',
    acceptable: ['book', 'the book', 'a book'],
    explanation: 'Shirt, pants, and hat are all clothing, but a book is not.',
  },
  {
    prompt: 'Which one does not belong: hammer, saw, wrench, flower?',
    expected: 'flower',
    acceptable: ['flower', 'the flower', 'a flower'],
    explanation: 'Hammer, saw, and wrench are all tools, but a flower is a plant.',
  },
  {
    prompt: 'Which one does not belong: piano, guitar, lamp, drum?',
    expected: 'lamp',
    acceptable: ['lamp', 'the lamp', 'a lamp'],
    explanation: 'Piano, guitar, and drum are all musical instruments, but a lamp is not.',
  },
  {
    prompt: 'Which one does not belong: red, blue, green, chair?',
    expected: 'chair',
    acceptable: ['chair', 'the chair', 'a chair'],
    explanation: 'Red, blue, and green are all colours, but a chair is furniture.',
  },
  {
    prompt: 'Which one does not belong: rose, tulip, daisy, pencil?',
    expected: 'pencil',
    acceptable: ['pencil', 'the pencil', 'a pencil'],
    explanation: 'Rose, tulip, and daisy are all flowers, but a pencil is not.',
  },
  {
    prompt: 'Which one does not belong: car, bus, train, sandwich?',
    expected: 'sandwich',
    acceptable: ['sandwich', 'the sandwich', 'a sandwich'],
    explanation: 'Car, bus, and train are all vehicles, but a sandwich is food.',
  },
];

const PROBLEM_SOLVING_PROMPTS = [
  {
    prompt: 'If it is raining outside, what should you take with you?',
    expected: 'umbrella',
    acceptable: ['umbrella', 'an umbrella', 'raincoat', 'a raincoat', 'rain jacket'],
  },
  {
    prompt: 'If you are hungry, what should you do?',
    expected: 'eat',
    acceptable: ['eat', 'eat something', 'have a meal', 'eat food', 'have some food', 'make food', 'cook'],
  },
  {
    prompt: 'If the room is dark, what should you do?',
    expected: 'turn on the light',
    acceptable: ['turn on the light', 'switch on the light', 'turn the light on', 'open the curtains', 'turn on a lamp'],
  },
  {
    prompt: 'If you are cold, what should you do?',
    expected: 'put on a sweater',
    acceptable: ['put on a sweater', 'wear a jumper', 'put on warm clothes', 'get a blanket', 'turn on the heater', 'put on a coat', 'get warm'],
  },
  {
    prompt: 'If you cannot reach something on a high shelf, what could you use?',
    expected: 'a step stool',
    acceptable: ['step stool', 'a step stool', 'a ladder', 'ladder', 'a chair', 'chair', 'stool', 'ask for help'],
  },
  {
    prompt: 'If your hands are dirty, what should you do?',
    expected: 'wash them',
    acceptable: ['wash them', 'wash my hands', 'wash your hands', 'clean them', 'use soap and water'],
  },
  {
    prompt: 'If you hear a fire alarm, what should you do?',
    expected: 'leave the building',
    acceptable: ['leave', 'leave the building', 'go outside', 'evacuate', 'get out', 'exit the building'],
  },
  {
    prompt: 'If you need to remember an appointment, what could you do?',
    expected: 'write it down',
    acceptable: ['write it down', 'put it in a calendar', 'set a reminder', 'use a calendar', 'make a note', 'set an alarm'],
  },
];

const SEQUENCING_PROMPTS = [
  {
    prompt: 'Put these in the correct order: get dressed, wake up, eat breakfast',
    expected: 'wake up, get dressed, eat breakfast',
    acceptable: [
      'wake up, get dressed, eat breakfast',
      'wake up get dressed eat breakfast',
      '1. wake up 2. get dressed 3. eat breakfast',
    ],
  },
  {
    prompt: 'Put these in the correct order: pour tea, boil water, add tea bag to cup',
    expected: 'boil water, add tea bag to cup, pour tea',
    acceptable: [
      'boil water, add tea bag to cup, pour tea',
      'boil water add tea bag pour tea',
      'boil water, add tea bag, pour tea',
    ],
  },
  {
    prompt: 'Put these in the correct order: put on shoes, put on socks, tie shoelaces',
    expected: 'put on socks, put on shoes, tie shoelaces',
    acceptable: [
      'put on socks, put on shoes, tie shoelaces',
      'socks, shoes, tie laces',
      'socks shoes tie shoelaces',
    ],
  },
  {
    prompt: 'Put these in order from smallest to biggest: elephant, mouse, cat',
    expected: 'mouse, cat, elephant',
    acceptable: ['mouse, cat, elephant', 'mouse cat elephant'],
  },
  {
    prompt: 'Put these meals in order for the day: dinner, breakfast, lunch',
    expected: 'breakfast, lunch, dinner',
    acceptable: ['breakfast, lunch, dinner', 'breakfast lunch dinner'],
  },
  {
    prompt: 'Put these in order: plant the seed, water the plant, the flower grows',
    expected: 'plant the seed, water the plant, the flower grows',
    acceptable: [
      'plant the seed, water the plant, the flower grows',
      'plant seed, water, flower grows',
      'plant water grow',
    ],
  },
];

const PLANNING_PROMPTS = [
  {
    prompt: 'You want to make a sandwich. What are the steps you would take?',
    expected: 'get bread, add filling, close the sandwich',
    acceptable: [
      'get bread, add filling, close the sandwich',
      'bread, butter, filling, close',
      'get bread, put butter, add meat, close',
    ],
    keywords: ['bread', 'fill', 'close'],
  },
  {
    prompt: 'You want to send a letter. What steps would you take?',
    expected: 'write the letter, put it in an envelope, add a stamp, post it',
    acceptable: [
      'write the letter, put it in an envelope, add a stamp, post it',
      'write, envelope, stamp, post',
    ],
    keywords: ['write', 'envelope', 'stamp', 'post'],
  },
  {
    prompt: 'You want to go to the shops. What do you need to prepare?',
    expected: 'make a shopping list, get your wallet, get your keys',
    acceptable: [
      'make a list, get wallet, get keys',
      'list, money, keys',
    ],
    keywords: ['list', 'money', 'keys'],
  },
  {
    prompt: 'You are going to plant a flower in a pot. What steps would you take?',
    expected: 'get a pot, add soil, put in the seed, water it',
    acceptable: [
      'get a pot, add soil, put in the seed, water it',
      'pot, soil, seed, water',
    ],
    keywords: ['pot', 'soil', 'seed', 'water'],
  },
  {
    prompt: 'You want to bake a simple cake. What are some important steps?',
    expected: 'gather ingredients, mix them together, pour in pan, bake in oven',
    acceptable: [
      'gather ingredients, mix, pour, bake',
      'ingredients, mix, bake',
    ],
    keywords: ['ingredient', 'mix', 'bake'],
  },
  {
    prompt: 'You want to wash your clothes. What steps would you take?',
    expected: 'sort the clothes, put them in the machine, add soap, start the machine',
    acceptable: [
      'sort, load, soap, start',
      'put clothes in machine, add soap, turn on',
    ],
    keywords: ['clothes', 'soap', 'machine'],
  },
];

const INHIBITION_PROMPTS = [
  {
    prompt: 'Say the OPPOSITE: If I say "up", you say...',
    expected: 'down',
    acceptable: ['down'],
  },
  {
    prompt: 'Say the OPPOSITE: If I say "big", you say...',
    expected: 'small',
    acceptable: ['small', 'little', 'tiny'],
  },
  {
    prompt: 'Say the OPPOSITE: If I say "hot", you say...',
    expected: 'cold',
    acceptable: ['cold', 'cool'],
  },
  {
    prompt: 'Say the OPPOSITE: If I say "happy", you say...',
    expected: 'sad',
    acceptable: ['sad', 'unhappy'],
  },
  {
    prompt: 'Say the OPPOSITE: If I say "fast", you say...',
    expected: 'slow',
    acceptable: ['slow'],
  },
  {
    prompt: 'Say the OPPOSITE: If I say "day", you say...',
    expected: 'night',
    acceptable: ['night', 'nighttime'],
  },
];

const FLEXIBILITY_PROMPTS = [
  {
    prompt: 'Name something that is both round AND red.',
    expected: 'apple',
    acceptable: ['apple', 'tomato', 'cherry', 'ball', 'red ball', 'strawberry'],
  },
  {
    prompt: 'Name something that is both soft AND white.',
    expected: 'pillow',
    acceptable: ['pillow', 'cloud', 'cotton', 'snow', 'marshmallow', 'tissue', 'wool'],
  },
  {
    prompt: 'Name something that is both cold AND sweet.',
    expected: 'ice cream',
    acceptable: ['ice cream', 'frozen yogurt', 'popsicle', 'sorbet', 'gelato', 'iced tea'],
  },
  {
    prompt: 'Name something that is both tall AND green.',
    expected: 'tree',
    acceptable: ['tree', 'a tree', 'pine tree', 'cactus', 'bamboo'],
  },
  {
    prompt: 'Name something that can be used for writing AND drawing.',
    expected: 'pencil',
    acceptable: ['pencil', 'pen', 'crayon', 'marker', 'chalk'],
  },
  {
    prompt: 'Name something that makes noise AND helps you wake up.',
    expected: 'alarm clock',
    acceptable: ['alarm clock', 'alarm', 'phone alarm', 'rooster', 'bell'],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------------------------------------
// Prompt Generators
// ---------------------------------------------------------------------------

/**
 * Generate a categorization exercise where one item does not belong.
 */
export function generateCategorizationPrompt(): GeneratedPrompt {
  const template = pickRandom(CATEGORIZATION_PROMPTS);

  return {
    type: ExerciseType.EXECUTIVE_CATEGORIZATION,
    domain: CognitiveDomain.EXECUTIVE_FUNCTION,
    prompt: template.prompt,
    expectedAnswer: template.expected,
    acceptableAnswers: template.acceptable,
    hints: [
      'Think about what three of these items have in common',
      template.explanation,
    ],
  };
}

/**
 * Generate a practical problem-solving question.
 */
export function generateProblemSolvingPrompt(): GeneratedPrompt {
  const template = pickRandom(PROBLEM_SOLVING_PROMPTS);

  return {
    type: ExerciseType.EXECUTIVE_PROBLEM_SOLVING,
    domain: CognitiveDomain.EXECUTIVE_FUNCTION,
    prompt: template.prompt,
    expectedAnswer: template.expected,
    acceptableAnswers: template.acceptable,
    hints: [
      'Think about what you would normally do in this situation',
      `The answer starts with the letter "${template.expected[0].toUpperCase()}"`,
    ],
  };
}

/**
 * Generate a sequencing exercise to put steps in order.
 */
export function generateSequencingPrompt(): GeneratedPrompt {
  const template = pickRandom(SEQUENCING_PROMPTS);

  return {
    type: ExerciseType.EXECUTIVE_SEQUENCING,
    domain: CognitiveDomain.EXECUTIVE_FUNCTION,
    prompt: template.prompt,
    expectedAnswer: template.expected,
    acceptableAnswers: template.acceptable,
    hints: [
      'Think about what happens first, then second, then third',
      `The first step is: "${template.expected.split(',')[0].trim()}"`,
    ],
  };
}

/**
 * Generate a planning exercise where patient describes steps.
 */
export function generatePlanningPrompt(): GeneratedPrompt {
  const template = pickRandom(PLANNING_PROMPTS);

  return {
    type: ExerciseType.EXECUTIVE_PLANNING,
    domain: CognitiveDomain.EXECUTIVE_FUNCTION,
    prompt: template.prompt,
    expectedAnswer: template.expected,
    acceptableAnswers: template.acceptable,
    hints: [
      'Think about what you need to do first',
      `Some key things to think about: ${template.keywords.slice(0, 2).join(', ')}`,
    ],
  };
}

/**
 * Generate an inhibition exercise (say the opposite).
 */
export function generateInhibitionPrompt(): GeneratedPrompt {
  const template = pickRandom(INHIBITION_PROMPTS);

  return {
    type: ExerciseType.EXECUTIVE_INHIBITION,
    domain: CognitiveDomain.EXECUTIVE_FUNCTION,
    prompt: template.prompt,
    expectedAnswer: template.expected,
    acceptableAnswers: template.acceptable,
    hints: [
      'Remember, you need to say the OPPOSITE word',
      `Think of the word that means the reverse of what I said`,
    ],
  };
}

/**
 * Generate a cognitive flexibility exercise (multiple attributes).
 */
export function generateFlexibilityPrompt(): GeneratedPrompt {
  const template = pickRandom(FLEXIBILITY_PROMPTS);

  return {
    type: ExerciseType.EXECUTIVE_FLEXIBILITY,
    domain: CognitiveDomain.EXECUTIVE_FUNCTION,
    prompt: template.prompt,
    expectedAnswer: template.expected,
    acceptableAnswers: template.acceptable,
    hints: [
      'Think of something that matches BOTH descriptions at the same time',
      `One possible answer starts with "${template.expected[0].toUpperCase()}"`,
    ],
  };
}

// ---------------------------------------------------------------------------
// Answer Evaluation
// ---------------------------------------------------------------------------

/**
 * Evaluate an answer for any executive function exercise.
 */
export function evaluateExecutiveAnswer(
  prompt: GeneratedPrompt,
  givenAnswer: string,
): AnswerEvaluation {
  const normalised = givenAnswer.trim().toLowerCase();
  const expectedNormalised = prompt.expectedAnswer.toLowerCase();

  const isExactMatch = normalised === expectedNormalised;
  const isAcceptable = prompt.acceptableAnswers.some(
    (a) => normalised === a.toLowerCase() || normalised.includes(a.toLowerCase()),
  );
  const isCorrect = isExactMatch || isAcceptable;

  // Check for partial matches on planning/sequencing (keyword-based)
  let isPartiallyCorrect = false;
  if (!isCorrect && (prompt.type === ExerciseType.EXECUTIVE_PLANNING || prompt.type === ExerciseType.EXECUTIVE_SEQUENCING)) {
    const expectedWords = expectedNormalised.split(/[\s,]+/).filter((w) => w.length > 3);
    const matchedWords = expectedWords.filter((w) => normalised.includes(w));
    isPartiallyCorrect = matchedWords.length >= Math.ceil(expectedWords.length / 2);
  }

  let score: number;
  let feedbackType: FeedbackType;
  let feedbackMessage: string;

  if (isCorrect) {
    score = 1.0;
    feedbackType = FeedbackType.CELEBRATED;
    feedbackMessage = 'Excellent thinking! That is exactly right. Well done!';
  } else if (isPartiallyCorrect) {
    score = 0.6;
    feedbackType = FeedbackType.GUIDED;
    feedbackMessage = `Good effort! You had some of the right ideas. The complete answer is: ${prompt.expectedAnswer}`;
  } else {
    score = 0.2;
    feedbackType = FeedbackType.SUPPORTED;
    feedbackMessage = `That is a thoughtful answer. The answer we were looking for is: ${prompt.expectedAnswer}. Let us try another one.`;
  }

  return {
    isCorrect: isCorrect || isPartiallyCorrect,
    feedbackType,
    score,
    feedbackMessage,
    correctAnswer: prompt.expectedAnswer,
  };
}
