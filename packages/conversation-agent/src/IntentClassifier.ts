/**
 * IntentClassifier -- determines the user's intent from their message
 * using keyword matching and pattern detection.
 *
 * This is a lightweight, deterministic classifier suitable for demo mode
 * and as a pre-filter before LLM-based classification.
 */

import { Intent, ConversationMessage } from './types';

// ---------------------------------------------------------------------------
// Pattern definitions
// ---------------------------------------------------------------------------

interface PatternRule {
  intent: Intent;
  /** Keywords or phrases -- matched case-insensitively */
  keywords: string[];
  /** Regular expression patterns for more nuanced matching */
  patterns: RegExp[];
  /** Base weight applied when any match is found */
  weight: number;
}

const RULES: PatternRule[] = [
  {
    intent: Intent.GREETING,
    keywords: [
      'hello', 'hi', 'hey', 'good morning', 'good afternoon',
      'good evening', 'howdy', 'greetings', 'nice to see you',
      'good day', 'how are you',
    ],
    patterns: [
      /^(hi|hey|hello|howdy)\b/i,
      /good\s+(morning|afternoon|evening|day)/i,
      /how\s+are\s+you/i,
    ],
    weight: 1.0,
  },
  {
    intent: Intent.ORIENTATION,
    keywords: [
      'what day', 'what time', 'what date', 'where am i',
      'what year', 'what month', 'where are we', 'what is today',
      'is it morning', 'is it night', 'what season',
    ],
    patterns: [
      /what\s+(day|time|date|year|month|season)/i,
      /where\s+(am\s+i|are\s+we|is\s+this)/i,
      /is\s+it\s+(morning|afternoon|evening|night)/i,
      /today.*(what|which)/i,
    ],
    weight: 1.2,
  },
  {
    intent: Intent.FAMILY_QUESTION,
    keywords: [
      'who is', 'where is', 'tell me about', 'my wife', 'my husband',
      'my son', 'my daughter', 'my child', 'my grandchild',
      'my brother', 'my sister', 'my family', 'my friend',
    ],
    patterns: [
      /who\s+is\s+\w+/i,
      /where\s+is\s+(my|the)\s+\w+/i,
      /tell\s+me\s+about\s+(my|the)\s+\w+/i,
      /my\s+(wife|husband|son|daughter|mother|father|brother|sister|grandchild|friend)/i,
      /do\s+i\s+have\s+(a\s+)?(wife|husband|children|family)/i,
    ],
    weight: 1.1,
  },
  {
    intent: Intent.STORY_REQUEST,
    keywords: [
      'tell me a story', 'remember when', 'once upon a time',
      'tell me about the time', 'do you remember', 'back when',
      'in the old days', 'when i was young', 'a long time ago',
      'can you tell me', 'share a story',
    ],
    patterns: [
      /tell\s+me\s+a\s+story/i,
      /remember\s+when/i,
      /do\s+you\s+remember/i,
      /tell\s+me\s+about\s+the\s+time/i,
      /when\s+i\s+was\s+(young|little|a\s+child|growing\s+up)/i,
    ],
    weight: 1.0,
  },
  {
    intent: Intent.CONFUSION,
    keywords: [
      "i don't know", "i'm lost", "i'm confused", "i can't remember",
      "what's happening", "where am i", "who am i", "i forgot",
      "i don't understand", "nothing makes sense",
      "what is going on", "i don't recognize",
    ],
    patterns: [
      /i\s+(don'?t|cant?'?t)\s+(know|remember|understand|recognize)/i,
      /i'?m\s+(lost|confused|scared|worried)/i,
      /what'?s\s+(happening|going\s+on)/i,
      /who\s+am\s+i/i,
      /nothing\s+makes?\s+sense/i,
    ],
    weight: 1.3,
  },
  {
    intent: Intent.HELP_REQUEST,
    keywords: [
      'help', 'help me', 'scared', "don't understand",
      'please help', 'i need help', 'somebody help',
      "i'm afraid", 'frightened', 'panicking',
    ],
    patterns: [
      /\bhelp\s*(me|please)?\b/i,
      /i'?m\s+(scared|afraid|frightened)/i,
      /i\s+need\s+help/i,
      /please\s+(help|someone)/i,
      /somebody\s+help/i,
    ],
    weight: 1.4,
  },
];

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

function scoreIntent(text: string, rule: PatternRule): number {
  const lower = text.toLowerCase();
  let score = 0;

  // Keyword matches
  for (const kw of rule.keywords) {
    if (lower.includes(kw)) {
      score += rule.weight;
    }
  }

  // Pattern matches (weighted slightly higher)
  for (const pat of rule.patterns) {
    if (pat.test(text)) {
      score += rule.weight * 1.5;
    }
  }

  return score;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Classify the primary intent of a user message.
 * Returns the highest-confidence intent, or GENERAL if no patterns match.
 */
export function classifyIntent(text: string): Intent {
  let bestIntent: Intent = Intent.GENERAL;
  let bestScore = 0;

  for (const rule of RULES) {
    const score = scoreIntent(text, rule);
    if (score > bestScore) {
      bestScore = score;
      bestIntent = rule.intent;
    }
  }

  return bestIntent;
}

/**
 * Get a confidence score (0-1) for a specific intent on the given text.
 */
export function getConfidence(text: string, intent: Intent): number {
  const rule = RULES.find((r) => r.intent === intent);
  if (!rule) return 0;

  const score = scoreIntent(text, rule);

  // Normalise: max realistic score is ~10 (several keyword + pattern hits)
  const normalised = Math.min(score / 10, 1);
  return Math.round(normalised * 100) / 100;
}

/**
 * Detect whether the user is repeating a question they already asked
 * within the recent conversation history.
 */
export function detectRepeatedQuestion(
  text: string,
  conversationHistory: ConversationMessage[],
): boolean {
  const normalisedText = text.toLowerCase().replace(/[?!.,]/g, '').trim();

  if (normalisedText.length < 5) return false;

  const recentUserMessages = conversationHistory
    .filter((m) => m.role === 'user')
    .slice(-10)
    .map((m) => m.content.toLowerCase().replace(/[?!.,]/g, '').trim());

  for (const prev of recentUserMessages) {
    // Exact match
    if (prev === normalisedText) return true;

    // High overlap: check if most words are shared
    const wordsA = new Set(normalisedText.split(/\s+/));
    const wordsB = new Set(prev.split(/\s+/));
    const intersection = [...wordsA].filter((w) => wordsB.has(w));

    const overlapRatio =
      intersection.length / Math.max(wordsA.size, wordsB.size);
    if (overlapRatio >= 0.75) return true;
  }

  return false;
}
