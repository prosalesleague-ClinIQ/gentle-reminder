/**
 * Visual-Spatial Exercises
 *
 * Exercises targeting spatial awareness, directional understanding,
 * mental rotation, spatial relationships, and environmental navigation
 * for dementia patients.
 */

import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';
import { GeneratedPrompt, AnswerEvaluation } from './types';

// ---------------------------------------------------------------------------
// Data sets
// ---------------------------------------------------------------------------

const DIRECTION_PROMPTS = [
  {
    prompt: 'If you are facing north and you turn to your right, which direction are you now facing?',
    expected: 'east',
    acceptable: ['east', 'East'],
    explanation: 'When facing north and turning right, you face east.',
  },
  {
    prompt: 'If you are facing south and you turn to your left, which direction are you now facing?',
    expected: 'east',
    acceptable: ['east', 'East'],
    explanation: 'When facing south and turning left, you face east.',
  },
  {
    prompt: 'If you are facing east and you turn around completely, which direction are you facing?',
    expected: 'east',
    acceptable: ['east', 'East'],
    explanation: 'A full turn brings you back to the same direction.',
  },
  {
    prompt: 'If you are facing west and you turn to your left, which direction are you facing?',
    expected: 'south',
    acceptable: ['south', 'South'],
    explanation: 'When facing west and turning left, you face south.',
  },
  {
    prompt: 'If you are facing north and you turn to your left, which direction are you facing?',
    expected: 'west',
    acceptable: ['west', 'West'],
    explanation: 'When facing north and turning left, you face west.',
  },
  {
    prompt: 'If you are facing east and you turn to your right, which direction are you facing?',
    expected: 'south',
    acceptable: ['south', 'South'],
    explanation: 'When facing east and turning right, you face south.',
  },
  {
    prompt: 'The sun rises in which direction?',
    expected: 'east',
    acceptable: ['east', 'East', 'the east'],
    explanation: 'The sun always rises in the east.',
  },
  {
    prompt: 'The sun sets in which direction?',
    expected: 'west',
    acceptable: ['west', 'West', 'the west'],
    explanation: 'The sun always sets in the west.',
  },
];

const MAZE_DESCRIPTION_PROMPTS = [
  {
    prompt: 'Follow these directions from the starting point: Go straight, turn left, go straight, turn right. If you started facing north, which direction are you now facing?',
    expected: 'north',
    acceptable: ['north', 'North'],
    explanation: 'Straight (north), left (west), straight (west), right (north).',
  },
  {
    prompt: 'Starting facing east: Turn left, go straight, turn left again. Which direction are you now facing?',
    expected: 'west',
    acceptable: ['west', 'West'],
    explanation: 'East, left (north), straight (north), left (west).',
  },
  {
    prompt: 'Starting facing north: Turn right, turn right again. Which direction are you now facing?',
    expected: 'south',
    acceptable: ['south', 'South'],
    explanation: 'North, right (east), right (south).',
  },
  {
    prompt: 'You are at a crossroads facing south. You turn left. Which direction are you going?',
    expected: 'east',
    acceptable: ['east', 'East'],
    explanation: 'When facing south and turning left, you face east.',
  },
  {
    prompt: 'You walk into a room through the north door. The window is directly across from you. Which wall is the window on?',
    expected: 'south',
    acceptable: ['south', 'South', 'the south wall', 'south wall'],
    explanation: 'If you enter from the north, the opposite wall is the south wall.',
  },
  {
    prompt: 'Imagine you are in a hallway facing east. You take the first door on your left. Which direction does that door face?',
    expected: 'north',
    acceptable: ['north', 'North'],
    explanation: 'If you are facing east, your left side faces north.',
  },
];

const SPATIAL_RELATION_PROMPTS = [
  {
    prompt: 'What is usually above us when we look up: the sky or the ground?',
    expected: 'the sky',
    acceptable: ['sky', 'the sky'],
  },
  {
    prompt: 'On a table, a book is on top of a plate. Which is higher: the book or the plate?',
    expected: 'the book',
    acceptable: ['book', 'the book'],
  },
  {
    prompt: 'A bird is in a tree. A cat is below the tree on the ground. Who is higher up?',
    expected: 'the bird',
    acceptable: ['bird', 'the bird'],
  },
  {
    prompt: 'You put a cup INSIDE a box. Where is the cup?',
    expected: 'inside the box',
    acceptable: ['inside the box', 'in the box', 'inside'],
  },
  {
    prompt: 'A lamp is next to a chair. A table is on the other side of the chair. What is in the middle?',
    expected: 'the chair',
    acceptable: ['chair', 'the chair'],
  },
  {
    prompt: 'A picture hangs on the wall ABOVE the fireplace. Where is the picture?',
    expected: 'above the fireplace',
    acceptable: ['above the fireplace', 'over the fireplace', 'on the wall above the fireplace'],
  },
  {
    prompt: 'Your left hand is on which side of your body?',
    expected: 'the left side',
    acceptable: ['left', 'the left', 'left side', 'the left side'],
  },
  {
    prompt: 'If you are standing and you look down at your feet, are they above or below your knees?',
    expected: 'below',
    acceptable: ['below', 'below my knees', 'under', 'underneath'],
  },
];

const CLOCK_POSITION_PROMPTS = [
  {
    prompt: 'On a clock face, what number is at the top?',
    expected: '12',
    acceptable: ['12', 'twelve'],
  },
  {
    prompt: 'On a clock face, what number is at the bottom?',
    expected: '6',
    acceptable: ['6', 'six'],
  },
  {
    prompt: 'On a clock face, what number is on the right side?',
    expected: '3',
    acceptable: ['3', 'three'],
  },
  {
    prompt: 'On a clock face, what number is on the left side?',
    expected: '9',
    acceptable: ['9', 'nine'],
  },
  {
    prompt: 'If the hour hand points to 3, what direction on a map would that be?',
    expected: 'east',
    acceptable: ['east', 'right', 'East'],
  },
  {
    prompt: 'When it is 6 o\'clock, where does the hour hand point?',
    expected: 'straight down',
    acceptable: ['down', 'straight down', 'at the bottom', 'the bottom'],
  },
];

const MAP_READING_PROMPTS = [
  {
    prompt: 'On a standard map, which direction is at the top?',
    expected: 'north',
    acceptable: ['north', 'North'],
  },
  {
    prompt: 'On a standard map, you want to go to a place that is to the right. Which direction would you travel?',
    expected: 'east',
    acceptable: ['east', 'East'],
  },
  {
    prompt: 'Your house is in the center of the map. The hospital is directly above your house. In which direction is the hospital?',
    expected: 'north',
    acceptable: ['north', 'North', 'to the north'],
  },
  {
    prompt: 'On a map, the river runs from left to right. Which direction does it flow?',
    expected: 'east',
    acceptable: ['east', 'East', 'from west to east', 'west to east'],
  },
  {
    prompt: 'The park is below and to the left of the school on the map. In which direction is the park from the school?',
    expected: 'southwest',
    acceptable: ['southwest', 'south-west', 'south west', 'Southwest'],
  },
  {
    prompt: 'If you walk from the bottom-left corner of a map to the top-right corner, which general direction are you walking?',
    expected: 'northeast',
    acceptable: ['northeast', 'north-east', 'north east', 'Northeast'],
  },
];

const SHAPE_MATCHING_PROMPTS = [
  {
    prompt: 'Which shape has 4 equal sides and 4 corners: a circle, a triangle, or a square?',
    expected: 'square',
    acceptable: ['square', 'a square'],
    options: ['circle', 'triangle', 'square'],
  },
  {
    prompt: 'Which shape has no corners and is perfectly round?',
    expected: 'circle',
    acceptable: ['circle', 'a circle'],
    options: ['circle', 'square', 'rectangle'],
  },
  {
    prompt: 'Which shape has 3 sides and 3 corners?',
    expected: 'triangle',
    acceptable: ['triangle', 'a triangle'],
    options: ['triangle', 'circle', 'rectangle'],
  },
  {
    prompt: 'A box is shaped like which figure: a sphere, a cube, or a pyramid?',
    expected: 'cube',
    acceptable: ['cube', 'a cube'],
    options: ['sphere', 'cube', 'pyramid'],
  },
  {
    prompt: 'A ball is shaped like which figure: a sphere, a cube, or a cone?',
    expected: 'sphere',
    acceptable: ['sphere', 'a sphere', 'ball'],
    options: ['sphere', 'cube', 'cone'],
  },
  {
    prompt: 'Which shape has 2 long sides and 2 short sides: a square, a rectangle, or a circle?',
    expected: 'rectangle',
    acceptable: ['rectangle', 'a rectangle'],
    options: ['square', 'rectangle', 'circle'],
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
 * Generate a direction/orientation exercise.
 */
export function generateDirectionPrompt(): GeneratedPrompt {
  const template = pickRandom(DIRECTION_PROMPTS);

  return {
    type: ExerciseType.VISUAL_SPATIAL_DIRECTION,
    domain: CognitiveDomain.VISUAL_SPATIAL,
    prompt: template.prompt,
    expectedAnswer: template.expected,
    acceptableAnswers: template.acceptable,
    hints: [
      'Think about a compass: North at the top, East to the right, South at the bottom, West to the left.',
      template.explanation,
    ],
  };
}

/**
 * Generate a maze/path description exercise.
 */
export function generateMazeDescriptionPrompt(): GeneratedPrompt {
  const template = pickRandom(MAZE_DESCRIPTION_PROMPTS);

  return {
    type: ExerciseType.VISUAL_SPATIAL_MAZE,
    domain: CognitiveDomain.VISUAL_SPATIAL,
    prompt: template.prompt,
    expectedAnswer: template.expected,
    acceptableAnswers: template.acceptable,
    hints: [
      'Try to picture yourself walking through the directions step by step.',
      template.explanation,
    ],
  };
}

/**
 * Generate a spatial relationship exercise.
 */
export function generateSpatialRelationPrompt(): GeneratedPrompt {
  const template = pickRandom(SPATIAL_RELATION_PROMPTS);

  return {
    type: ExerciseType.VISUAL_SPATIAL_RELATION,
    domain: CognitiveDomain.VISUAL_SPATIAL,
    prompt: template.prompt,
    expectedAnswer: template.expected,
    acceptableAnswers: template.acceptable,
    hints: [
      'Try to picture the scene in your mind.',
      `Think about the words "above", "below", "inside", and "next to".`,
    ],
  };
}

/**
 * Generate a clock position exercise.
 */
export function generateClockPositionPrompt(): GeneratedPrompt {
  const template = pickRandom(CLOCK_POSITION_PROMPTS);

  return {
    type: ExerciseType.VISUAL_SPATIAL_CLOCK_POSITION,
    domain: CognitiveDomain.VISUAL_SPATIAL,
    prompt: template.prompt,
    expectedAnswer: template.expected,
    acceptableAnswers: template.acceptable,
    hints: [
      'Picture a clock hanging on the wall in front of you.',
      `Remember: 12 is at the top, 3 is on the right, 6 is at the bottom, 9 is on the left.`,
    ],
  };
}

/**
 * Generate a map reading exercise.
 */
export function generateMapReadingPrompt(): GeneratedPrompt {
  const template = pickRandom(MAP_READING_PROMPTS);

  return {
    type: ExerciseType.VISUAL_SPATIAL_MAP_READING,
    domain: CognitiveDomain.VISUAL_SPATIAL,
    prompt: template.prompt,
    expectedAnswer: template.expected,
    acceptableAnswers: template.acceptable,
    hints: [
      'On a map, north is at the top, south is at the bottom, east is right, and west is left.',
      `Think about which way you would need to move on the map.`,
    ],
  };
}

/**
 * Generate a shape matching exercise.
 */
export function generateShapeMatchingPrompt(): GeneratedPrompt {
  const template = pickRandom(SHAPE_MATCHING_PROMPTS);

  return {
    type: ExerciseType.VISUAL_SPATIAL_SHAPE_MATCHING,
    domain: CognitiveDomain.VISUAL_SPATIAL,
    prompt: template.prompt,
    expectedAnswer: template.expected,
    acceptableAnswers: template.acceptable,
    options: template.options,
    hints: [
      'Think about the number of sides and corners each shape has.',
      `The answer starts with the letter "${template.expected[0].toUpperCase()}"`,
    ],
  };
}

// ---------------------------------------------------------------------------
// Answer Evaluation
// ---------------------------------------------------------------------------

/**
 * Evaluate an answer for any visual-spatial exercise.
 */
export function evaluateVisualSpatialAnswer(
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

  // Check for close answers on direction questions (adjacent compass points)
  let isClose = false;
  if (!isCorrect && (
    prompt.type === ExerciseType.VISUAL_SPATIAL_DIRECTION ||
    prompt.type === ExerciseType.VISUAL_SPATIAL_MAZE ||
    prompt.type === ExerciseType.VISUAL_SPATIAL_MAP_READING
  )) {
    const compassOrder = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
    const expectedIdx = compassOrder.indexOf(expectedNormalised);
    const givenIdx = compassOrder.indexOf(normalised);
    if (expectedIdx !== -1 && givenIdx !== -1) {
      const diff = Math.abs(expectedIdx - givenIdx);
      isClose = diff === 1 || diff === compassOrder.length - 1;
    }
  }

  let score: number;
  let feedbackType: FeedbackType;
  let feedbackMessage: string;

  if (isCorrect) {
    score = 1.0;
    feedbackType = FeedbackType.CELEBRATED;
    feedbackMessage = 'That is exactly right! Great spatial awareness!';
  } else if (isClose) {
    score = 0.5;
    feedbackType = FeedbackType.GUIDED;
    feedbackMessage = `Close! You said "${givenAnswer}", but the answer is "${prompt.expectedAnswer}". You were only one direction off.`;
  } else {
    score = 0.2;
    feedbackType = FeedbackType.SUPPORTED;
    feedbackMessage = `That is a tricky one. The correct answer is "${prompt.expectedAnswer}". Let us try picturing it again together.`;
  }

  return {
    isCorrect,
    feedbackType,
    score,
    feedbackMessage,
    correctAnswer: prompt.expectedAnswer,
  };
}
