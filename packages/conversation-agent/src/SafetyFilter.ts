/**
 * SafetyFilter -- ensures every agent response is warm, safe,
 * and appropriate for a person living with dementia.
 */

import { ConversationContext } from './types';

// ---------------------------------------------------------------------------
// Banned phrases -- must never appear in a response
// ---------------------------------------------------------------------------

export const BANNED_PHRASES: string[] = [
  'you are wrong',
  'that is wrong',
  'that is incorrect',
  'you forgot',
  'you already asked',
  'i already told you',
  'you should remember',
  'try to remember',
  'don\'t you remember',
  'dementia',
  'alzheimer',
  'cognitive decline',
  'memory loss',
  'brain disease',
  'mental illness',
  'you can\'t',
  'you\'re confused',
  'that didn\'t happen',
  'that\'s not true',
  'you\'re imagining',
  'you need to',
  'you must',
  'you have to take your medicine',
  'consult your doctor',
  'i\'m just an ai',
  'as an ai',
  'i\'m a language model',
  'i don\'t have feelings',
  'i\'m not real',
];

/** Words that signal a negative or harsh tone */
const NEGATIVE_TONE_WORDS: string[] = [
  'stupid', 'dumb', 'wrong', 'terrible', 'horrible',
  'pathetic', 'useless', 'hopeless', 'annoying', 'boring',
  'ridiculous', 'nonsense', 'impossible', 'never', 'failure',
  'idiot', 'foolish', 'incompetent', 'worthless',
];

/** Reassurance phrases appended when confusion is detected */
const REASSURANCE_ADDITIONS: string[] = [
  'You are safe, and I am right here with you.',
  'Everything is alright. You are not alone.',
  'I am here for you, and everything is okay.',
  'You are doing wonderfully. Take all the time you need.',
  'There is nothing to worry about. I am right here.',
];

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function containsBannedPhrase(text: string): string | null {
  const lower = text.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (lower.includes(phrase)) {
      return phrase;
    }
  }
  return null;
}

function containsNegativeTone(text: string): string | null {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  for (const word of words) {
    if (NEGATIVE_TONE_WORDS.includes(word)) {
      return word;
    }
  }
  return null;
}

function isResponseTooLong(text: string, maxSentences: number = 4): boolean {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  return sentences.length > maxSentences;
}

function truncateResponse(text: string, maxSentences: number = 3): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  if (sentences.length <= maxSentences) return text;
  return sentences.slice(0, maxSentences).join(' ');
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Check whether a response is safe to deliver.
 * Returns a result object with a boolean flag and a list of issues found.
 */
export function isResponseSafe(
  response: string,
): { safe: boolean; issues: string[] } {
  const issues: string[] = [];

  const banned = containsBannedPhrase(response);
  if (banned) {
    issues.push(`Contains banned phrase: "${banned}"`);
  }

  const negative = containsNegativeTone(response);
  if (negative) {
    issues.push(`Contains negative tone word: "${negative}"`);
  }

  if (response.trim().length === 0) {
    issues.push('Response is empty');
  }

  if (isResponseTooLong(response, 6)) {
    issues.push('Response is excessively long (more than 6 sentences)');
  }

  return { safe: issues.length === 0, issues };
}

/**
 * Add a reassurance sentence to the end of a response,
 * personalised with the patient's name.
 */
export function addReassurance(response: string, patientName: string): string {
  const idx = Math.floor(Math.random() * REASSURANCE_ADDITIONS.length);
  const reassurance = REASSURANCE_ADDITIONS[idx].replace(
    /You are/,
    `${patientName}, you are`,
  );
  return `${response.trim()} ${reassurance}`;
}

/**
 * Full safety filter pipeline:
 * 1. Remove banned phrases (replace with gentle alternatives)
 * 2. Remove negative tone words
 * 3. Truncate if too long
 * 4. Add reassurance if the patient is confused or anxious
 */
export function filterResponse(
  response: string,
  context: ConversationContext,
): string {
  let filtered = response;

  // Step 1: Replace banned phrases with empty string
  for (const phrase of BANNED_PHRASES) {
    const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    filtered = filtered.replace(regex, '');
  }

  // Step 2: Remove negative tone words
  for (const word of NEGATIVE_TONE_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filtered = filtered.replace(regex, '');
  }

  // Clean up extra whitespace left by removals
  filtered = filtered.replace(/\s{2,}/g, ' ').trim();

  // Step 3: Truncate if too long
  filtered = truncateResponse(filtered);

  // Step 4: Add reassurance for confused or anxious states
  const needsReassurance =
    context.cognitiveState === 'confused' ||
    context.cognitiveState === 'anxious' ||
    context.cognitiveState === 'agitated' ||
    context.currentMood === 'confused' ||
    context.currentMood === 'anxious';

  if (needsReassurance) {
    filtered = addReassurance(filtered, context.patientName);
  }

  return filtered;
}
