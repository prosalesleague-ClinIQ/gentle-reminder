/**
 * Verbal Fluency Exercises
 *
 * Exercises targeting language production, semantic retrieval, phonemic
 * fluency, sentence construction, definitions, rhyming, and storytelling
 * for dementia patients.
 */

import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';
import { GeneratedPrompt, AnswerEvaluation } from './types';

// ---------------------------------------------------------------------------
// Data sets
// ---------------------------------------------------------------------------

const LETTER_FLUENCY_PROMPTS = [
  {
    letter: 'S',
    examples: ['sun', 'sand', 'shoe', 'star', 'soup', 'sleep', 'smile', 'school', 'salt', 'summer', 'stone', 'silver', 'sing', 'sweet', 'sky'],
    minExpected: 3,
  },
  {
    letter: 'B',
    examples: ['ball', 'bird', 'book', 'bread', 'blue', 'butter', 'baby', 'bell', 'bridge', 'bed', 'basket', 'bright', 'boat', 'brown', 'bake'],
    minExpected: 3,
  },
  {
    letter: 'T',
    examples: ['table', 'tree', 'time', 'tea', 'town', 'train', 'tooth', 'tiger', 'tall', 'taste', 'tennis', 'truck', 'trip', 'true', 'top'],
    minExpected: 3,
  },
  {
    letter: 'C',
    examples: ['cat', 'car', 'cake', 'cup', 'cloud', 'chair', 'cheese', 'coat', 'cold', 'church', 'clock', 'clean', 'corn', 'cow', 'calm'],
    minExpected: 3,
  },
  {
    letter: 'M',
    examples: ['moon', 'milk', 'mountain', 'music', 'mouse', 'morning', 'market', 'map', 'mirror', 'mango', 'meal', 'mother', 'mud', 'match', 'mist'],
    minExpected: 3,
  },
  {
    letter: 'P',
    examples: ['pen', 'paper', 'park', 'piano', 'paint', 'peace', 'plate', 'phone', 'pink', 'path', 'plant', 'pond', 'price', 'power', 'pull'],
    minExpected: 3,
  },
];

const SEMANTIC_FLUENCY_PROMPTS = [
  {
    category: 'kitchen',
    prompt: 'Name things you would find in a kitchen',
    examples: ['stove', 'refrigerator', 'sink', 'plate', 'cup', 'fork', 'knife', 'spoon', 'pot', 'pan', 'oven', 'toaster', 'table', 'chair', 'bowl'],
    minExpected: 3,
  },
  {
    category: 'garden',
    prompt: 'Name things you would find in a garden',
    examples: ['flowers', 'grass', 'tree', 'bird', 'fence', 'hose', 'soil', 'rake', 'bench', 'butterfly', 'watering can', 'pot', 'seeds', 'sun', 'hedge'],
    minExpected: 3,
  },
  {
    category: 'bedroom',
    prompt: 'Name things you would find in a bedroom',
    examples: ['bed', 'pillow', 'blanket', 'lamp', 'wardrobe', 'mirror', 'curtains', 'alarm clock', 'dresser', 'rug', 'nightstand', 'book', 'photo', 'door'],
    minExpected: 3,
  },
  {
    category: 'supermarket',
    prompt: 'Name things you might buy at the supermarket',
    examples: ['bread', 'milk', 'eggs', 'fruit', 'vegetables', 'cheese', 'meat', 'cereal', 'juice', 'butter', 'rice', 'pasta', 'soap', 'toilet paper'],
    minExpected: 3,
  },
  {
    category: 'bathroom',
    prompt: 'Name things you would find in a bathroom',
    examples: ['toilet', 'sink', 'mirror', 'towel', 'soap', 'toothbrush', 'shower', 'bath', 'shampoo', 'mat', 'tap', 'brush', 'comb'],
    minExpected: 3,
  },
  {
    category: 'park',
    prompt: 'Name things you might see in a park',
    examples: ['trees', 'bench', 'fountain', 'dogs', 'children', 'birds', 'path', 'flowers', 'playground', 'lake', 'grass', 'duck', 'jogger', 'squirrel'],
    minExpected: 3,
  },
];

const SENTENCE_BUILDING_PROMPTS = [
  { word: 'garden', examples: ['I love spending time in my garden.', 'The garden has beautiful flowers.', 'We planted tomatoes in the garden.'] },
  { word: 'happy', examples: ['Seeing my family makes me happy.', 'The children looked very happy.', 'I feel happy today.'] },
  { word: 'morning', examples: ['I enjoy walking in the morning.', 'The morning sun is warm.', 'Good morning to everyone.'] },
  { word: 'friend', examples: ['My friend came to visit today.', 'A good friend is always kind.', 'I called my friend on the phone.'] },
  { word: 'rain', examples: ['The rain made the flowers grow.', 'We stayed inside because of the rain.', 'I like the sound of rain.'] },
  { word: 'cook', examples: ['I like to cook dinner for my family.', 'My grandmother was a wonderful cook.', 'Let us cook something nice together.'] },
];

const WORD_DEFINITION_PROMPTS = [
  {
    word: 'umbrella',
    prompt: 'What is an umbrella?',
    expected: 'Something you use to stay dry when it rains',
    keywords: ['rain', 'dry', 'cover', 'protect', 'wet', 'water'],
  },
  {
    word: 'bridge',
    prompt: 'What is a bridge?',
    expected: 'A structure that goes over water or a road so you can cross',
    keywords: ['cross', 'over', 'water', 'road', 'connect', 'river'],
  },
  {
    word: 'hospital',
    prompt: 'What is a hospital?',
    expected: 'A place where sick or injured people go to be treated by doctors',
    keywords: ['doctor', 'sick', 'health', 'medical', 'nurse', 'treat', 'ill', 'care'],
  },
  {
    word: 'library',
    prompt: 'What is a library?',
    expected: 'A place where you can borrow and read books',
    keywords: ['book', 'read', 'borrow', 'quiet', 'study'],
  },
  {
    word: 'calendar',
    prompt: 'What is a calendar?',
    expected: 'Something that shows the days, weeks, and months of the year',
    keywords: ['day', 'month', 'year', 'date', 'time', 'week', 'schedule'],
  },
  {
    word: 'thermometer',
    prompt: 'What is a thermometer?',
    expected: 'A device used to measure temperature',
    keywords: ['temperature', 'measure', 'hot', 'cold', 'fever', 'heat', 'degrees'],
  },
];

const RHYMING_PROMPTS = [
  { word: 'cat', expected: ['hat', 'bat', 'mat', 'rat', 'sat', 'fat', 'flat', 'pat', 'that', 'chat'] },
  { word: 'day', expected: ['play', 'say', 'way', 'may', 'pay', 'stay', 'ray', 'hay', 'bay', 'clay'] },
  { word: 'tree', expected: ['free', 'see', 'bee', 'key', 'me', 'he', 'she', 'we', 'three', 'knee'] },
  { word: 'light', expected: ['night', 'right', 'bright', 'sight', 'fight', 'might', 'white', 'tight', 'flight', 'kite'] },
  { word: 'cake', expected: ['make', 'bake', 'lake', 'take', 'shake', 'wake', 'fake', 'break', 'stake', 'snake'] },
  { word: 'sing', expected: ['ring', 'king', 'thing', 'bring', 'wing', 'spring', 'string', 'swing', 'bling', 'sting'] },
];

const STORYTELLING_PROMPTS = [
  {
    starter: 'Once upon a time, there was a little dog who loved to...',
    prompt: 'Finish this story in a few sentences: "Once upon a time, there was a little dog who loved to..."',
    keywords: ['dog', 'play', 'walk', 'friend', 'happy', 'home', 'run', 'bark'],
  },
  {
    starter: 'On a sunny morning, a woman went to the market to buy...',
    prompt: 'Continue this story: "On a sunny morning, a woman went to the market to buy..."',
    keywords: ['buy', 'food', 'fruit', 'home', 'cook', 'market', 'walk', 'flowers'],
  },
  {
    starter: 'The old fisherman sat by the river and...',
    prompt: 'What happened next? "The old fisherman sat by the river and..."',
    keywords: ['fish', 'catch', 'river', 'water', 'boat', 'sit', 'wait', 'big'],
  },
  {
    starter: 'A family gathered around the kitchen table for...',
    prompt: 'Continue: "A family gathered around the kitchen table for..."',
    keywords: ['dinner', 'meal', 'eat', 'together', 'talk', 'food', 'laugh', 'cook'],
  },
  {
    starter: 'The gardener looked at the seeds she had planted and noticed...',
    prompt: 'What did the gardener notice? "The gardener looked at the seeds she had planted and noticed..."',
    keywords: ['grow', 'flower', 'plant', 'green', 'water', 'sun', 'sprout', 'garden'],
  },
  {
    starter: 'A child found a treasure map and decided to...',
    prompt: 'What did the child do? "A child found a treasure map and decided to..."',
    keywords: ['treasure', 'find', 'map', 'adventure', 'dig', 'search', 'follow', 'explore'],
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
 * Generate a letter fluency exercise.
 * Patient names as many words as possible starting with a given letter.
 */
export function generateLetterFluencyPrompt(): GeneratedPrompt {
  const template = pickRandom(LETTER_FLUENCY_PROMPTS);

  return {
    type: ExerciseType.VERBAL_LETTER_FLUENCY,
    domain: CognitiveDomain.VERBAL_FLUENCY,
    prompt: `Name as many words as you can that start with the letter "${template.letter}".\n\nTry to think of at least ${template.minExpected} words.`,
    expectedAnswer: template.examples.slice(0, template.minExpected).join(', '),
    acceptableAnswers: template.examples,
    hints: [
      `Think of things you might see around your home that start with "${template.letter}"`,
      `One example is "${template.examples[0]}"`,
    ],
  };
}

/**
 * Generate a semantic fluency exercise.
 * Patient names items that belong to a given category.
 */
export function generateSemanticFluencyPrompt(): GeneratedPrompt {
  const template = pickRandom(SEMANTIC_FLUENCY_PROMPTS);

  return {
    type: ExerciseType.VERBAL_SEMANTIC_FLUENCY,
    domain: CognitiveDomain.VERBAL_FLUENCY,
    prompt: `${template.prompt}.\n\nTry to think of at least ${template.minExpected} things.`,
    expectedAnswer: template.examples.slice(0, template.minExpected).join(', '),
    acceptableAnswers: template.examples,
    hints: [
      `Close your eyes and picture a ${template.category}. What do you see?`,
      `One example is "${template.examples[0]}"`,
    ],
  };
}

/**
 * Generate a sentence building exercise.
 * Patient creates a sentence using a given word.
 */
export function generateSentenceBuildingPrompt(): GeneratedPrompt {
  const template = pickRandom(SENTENCE_BUILDING_PROMPTS);

  return {
    type: ExerciseType.VERBAL_SENTENCE_BUILDING,
    domain: CognitiveDomain.VERBAL_FLUENCY,
    prompt: `Make a sentence using the word "${template.word}".`,
    expectedAnswer: template.examples[0],
    acceptableAnswers: template.examples,
    hints: [
      `Think about something you like or do that involves the word "${template.word}"`,
      `You could start with "I..." or "The..."`,
    ],
  };
}

/**
 * Generate a word definition exercise.
 * Patient describes what a word means.
 */
export function generateWordDefinitionPrompt(): GeneratedPrompt {
  const template = pickRandom(WORD_DEFINITION_PROMPTS);

  return {
    type: ExerciseType.VERBAL_WORD_DEFINITION,
    domain: CognitiveDomain.VERBAL_FLUENCY,
    prompt: template.prompt,
    expectedAnswer: template.expected,
    acceptableAnswers: [template.expected, ...template.keywords],
    hints: [
      `Think about when or where you would use a ${template.word}`,
      `It is related to: ${template.keywords.slice(0, 2).join(', ')}`,
    ],
  };
}

/**
 * Generate a rhyming exercise.
 * Patient names words that rhyme with a given word.
 */
export function generateRhymingPrompt(): GeneratedPrompt {
  const template = pickRandom(RHYMING_PROMPTS);

  return {
    type: ExerciseType.VERBAL_RHYMING,
    domain: CognitiveDomain.VERBAL_FLUENCY,
    prompt: `Can you think of a word that rhymes with "${template.word}"?\n\nTry to name at least two words.`,
    expectedAnswer: template.expected.slice(0, 2).join(', '),
    acceptableAnswers: template.expected,
    hints: [
      `A rhyming word sounds similar at the end. "${template.word}" ends with the sound "-${template.word.slice(-2)}"`,
      `One rhyming word is "${template.expected[0]}"`,
    ],
  };
}

/**
 * Generate a storytelling exercise.
 * Patient continues a short story starter.
 */
export function generateStorytellingPrompt(): GeneratedPrompt {
  const template = pickRandom(STORYTELLING_PROMPTS);

  return {
    type: ExerciseType.VERBAL_STORYTELLING,
    domain: CognitiveDomain.VERBAL_FLUENCY,
    prompt: template.prompt,
    expectedAnswer: template.starter,
    acceptableAnswers: template.keywords,
    hints: [
      'Just say whatever comes to mind. There is no wrong answer!',
      `You might mention something about: ${template.keywords.slice(0, 3).join(', ')}`,
    ],
  };
}

// ---------------------------------------------------------------------------
// Answer Evaluation
// ---------------------------------------------------------------------------

/**
 * Evaluate a verbal fluency answer.
 * Fluency exercises are more lenient since creative answers are valid.
 */
export function evaluateVerbalFluencyAnswer(
  prompt: GeneratedPrompt,
  givenAnswer: string,
): AnswerEvaluation {
  const normalised = givenAnswer.trim().toLowerCase();

  if (normalised.length === 0) {
    return {
      isCorrect: false,
      feedbackType: FeedbackType.SUPPORTED,
      score: 0.1,
      feedbackMessage: 'It is okay to take your time. Would you like a hint?',
      correctAnswer: prompt.expectedAnswer,
    };
  }

  // For fluency exercises (letter, semantic, rhyming), check how many valid words were given
  if (
    prompt.type === ExerciseType.VERBAL_LETTER_FLUENCY ||
    prompt.type === ExerciseType.VERBAL_SEMANTIC_FLUENCY ||
    prompt.type === ExerciseType.VERBAL_RHYMING
  ) {
    const givenWords = normalised.split(/[,\s]+/).filter((w) => w.length > 1);
    const validWords = givenWords.filter((w) =>
      prompt.acceptableAnswers.some((a) => a.toLowerCase() === w || a.toLowerCase().includes(w)),
    );

    if (validWords.length >= 3) {
      return {
        isCorrect: true,
        feedbackType: FeedbackType.CELEBRATED,
        score: 1.0,
        feedbackMessage: `Wonderful! You named ${validWords.length} words. That is great verbal fluency!`,
        correctAnswer: prompt.expectedAnswer,
      };
    } else if (validWords.length >= 1) {
      return {
        isCorrect: true,
        feedbackType: FeedbackType.GUIDED,
        score: 0.6,
        feedbackMessage: `Good start! You named ${validWords.length} word${validWords.length > 1 ? 's' : ''}. Can you think of any more?`,
        correctAnswer: prompt.expectedAnswer,
      };
    }

    // Even if not in our list, any word starting with the right letter counts for letter fluency
    if (prompt.type === ExerciseType.VERBAL_LETTER_FLUENCY) {
      const letter = prompt.prompt.match(/letter "(\w)"/)?.[1]?.toLowerCase();
      if (letter) {
        const matchingWords = givenWords.filter((w) => w.startsWith(letter));
        if (matchingWords.length > 0) {
          return {
            isCorrect: true,
            feedbackType: FeedbackType.GUIDED,
            score: 0.5 + matchingWords.length * 0.1,
            feedbackMessage: `Good thinking! "${matchingWords.join(', ')}" ${matchingWords.length === 1 ? 'starts' : 'start'} with "${letter.toUpperCase()}". Can you think of more?`,
            correctAnswer: prompt.expectedAnswer,
          };
        }
      }
    }
  }

  // For sentence building, check that the target word is used
  if (prompt.type === ExerciseType.VERBAL_SENTENCE_BUILDING) {
    const targetWord = prompt.prompt.match(/word "(\w+)"/)?.[1]?.toLowerCase();
    if (targetWord && normalised.includes(targetWord) && normalised.split(/\s+/).length >= 3) {
      return {
        isCorrect: true,
        feedbackType: FeedbackType.CELEBRATED,
        score: 1.0,
        feedbackMessage: 'That is a lovely sentence! Well done using that word.',
        correctAnswer: prompt.expectedAnswer,
      };
    } else if (targetWord && normalised.includes(targetWord)) {
      return {
        isCorrect: true,
        feedbackType: FeedbackType.GUIDED,
        score: 0.7,
        feedbackMessage: 'Good use of the word! Can you make it into a longer sentence?',
        correctAnswer: prompt.expectedAnswer,
      };
    }
  }

  // For definitions, check keyword matches
  if (prompt.type === ExerciseType.VERBAL_WORD_DEFINITION) {
    const keywords = prompt.acceptableAnswers.slice(1); // First is full answer, rest are keywords
    const matchedKeywords = keywords.filter((kw) => normalised.includes(kw.toLowerCase()));
    if (matchedKeywords.length >= 2) {
      return {
        isCorrect: true,
        feedbackType: FeedbackType.CELEBRATED,
        score: 1.0,
        feedbackMessage: 'That is a great description! You clearly know what it means.',
        correctAnswer: prompt.expectedAnswer,
      };
    } else if (matchedKeywords.length === 1) {
      return {
        isCorrect: true,
        feedbackType: FeedbackType.GUIDED,
        score: 0.6,
        feedbackMessage: `Good start! You mentioned "${matchedKeywords[0]}". Can you tell me a bit more about it?`,
        correctAnswer: prompt.expectedAnswer,
      };
    }
  }

  // For storytelling, any meaningful continuation counts
  if (prompt.type === ExerciseType.VERBAL_STORYTELLING) {
    const words = normalised.split(/\s+/);
    const keywords = prompt.acceptableAnswers;
    const matchedKeywords = keywords.filter((kw) => normalised.includes(kw.toLowerCase()));

    if (words.length >= 5) {
      return {
        isCorrect: true,
        feedbackType: FeedbackType.CELEBRATED,
        score: 1.0,
        feedbackMessage: 'What a wonderful story! You have a great imagination.',
        correctAnswer: prompt.expectedAnswer,
      };
    } else if (words.length >= 2 || matchedKeywords.length > 0) {
      return {
        isCorrect: true,
        feedbackType: FeedbackType.GUIDED,
        score: 0.6,
        feedbackMessage: 'That is a nice start to the story. Can you add a little more to it?',
        correctAnswer: prompt.expectedAnswer,
      };
    }
  }

  // General check against acceptable answers
  const isAcceptable = prompt.acceptableAnswers.some(
    (a) => normalised === a.toLowerCase() || normalised.includes(a.toLowerCase()),
  );

  if (isAcceptable) {
    return {
      isCorrect: true,
      feedbackType: FeedbackType.CELEBRATED,
      score: 1.0,
      feedbackMessage: 'Excellent! That is a great answer.',
      correctAnswer: prompt.expectedAnswer,
    };
  }

  return {
    isCorrect: false,
    feedbackType: FeedbackType.SUPPORTED,
    score: 0.3,
    feedbackMessage: `That is a thoughtful response. Here is an example of what we were looking for: ${prompt.expectedAnswer}`,
    correctAnswer: prompt.expectedAnswer,
  };
}
