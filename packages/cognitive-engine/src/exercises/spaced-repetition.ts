/**
 * Spaced Repetition Engine
 * Implements a simplified SM-2 algorithm adapted for dementia patients.
 *
 * Key adaptations:
 * - Gentler intervals (shorter gaps, more frequent review)
 * - No penalty for forgetting (only gentle encouragement)
 * - Maximum interval capped at 7 days (dementia patients need frequent reinforcement)
 * - Minimum interval never below 1 hour
 */

export interface MemoryCard {
  id: string;
  prompt: string;
  answer: string;
  category: 'person' | 'place' | 'event' | 'fact';
  photoUrl?: string;
  /** 0-5 quality score from last review */
  lastQuality: number;
  /** Current interval in hours */
  intervalHours: number;
  /** Ease factor (starts at 2.5) */
  easeFactor: number;
  /** Number of successful reviews */
  repetitions: number;
  /** When this card is next due */
  nextReviewAt: Date;
  /** When this card was last reviewed */
  lastReviewedAt?: Date;
}

export interface ReviewResult {
  card: MemoryCard;
  quality: number; // 0-5 (0=forgot, 3=with difficulty, 5=perfect)
  responseTimeMs: number;
}

export interface ReviewSchedule {
  dueNow: MemoryCard[];
  dueSoon: MemoryCard[]; // Due within 2 hours
  reviewed: number;
  totalCards: number;
}

/**
 * Create a new memory card with default spaced repetition values.
 */
export function createCard(params: {
  id: string;
  prompt: string;
  answer: string;
  category: MemoryCard['category'];
  photoUrl?: string;
}): MemoryCard {
  return {
    ...params,
    lastQuality: 0,
    intervalHours: 1, // Start with 1 hour interval
    easeFactor: 2.5,
    repetitions: 0,
    nextReviewAt: new Date(), // Due immediately
  };
}

/**
 * Process a review and update the card's scheduling.
 * Adapted SM-2 with dementia-friendly modifications:
 * - Max interval: 168 hours (7 days)
 * - Min ease factor: 1.5 (gentler than standard 1.3)
 * - No reset on poor quality (just reduce interval)
 */
export function processReview(card: MemoryCard, quality: number): MemoryCard {
  const clampedQuality = Math.max(0, Math.min(5, quality));

  let newInterval: number;
  let newEaseFactor = card.easeFactor;
  let newRepetitions = card.repetitions;

  if (clampedQuality >= 3) {
    // Successful recall
    newRepetitions = card.repetitions + 1;

    if (newRepetitions === 1) {
      newInterval = 1; // 1 hour
    } else if (newRepetitions === 2) {
      newInterval = 6; // 6 hours
    } else {
      newInterval = Math.round(card.intervalHours * card.easeFactor);
    }

    // Update ease factor (gentler than standard SM-2)
    newEaseFactor =
      card.easeFactor +
      (0.1 - (5 - clampedQuality) * (0.06 + (5 - clampedQuality) * 0.02));
  } else {
    // Unsuccessful recall - don't reset, just reduce interval
    newInterval = Math.max(1, Math.round(card.intervalHours * 0.5));
    newRepetitions = Math.max(0, card.repetitions - 1);
    newEaseFactor = Math.max(1.5, card.easeFactor - 0.1);
  }

  // Clamp interval to max 7 days for dementia patients
  newInterval = Math.min(newInterval, 168);
  newInterval = Math.max(newInterval, 1);

  // Clamp ease factor
  newEaseFactor = Math.max(1.5, newEaseFactor);

  const nextReviewAt = new Date();
  nextReviewAt.setHours(nextReviewAt.getHours() + newInterval);

  return {
    ...card,
    lastQuality: clampedQuality,
    intervalHours: newInterval,
    easeFactor: Math.round(newEaseFactor * 100) / 100,
    repetitions: newRepetitions,
    nextReviewAt,
    lastReviewedAt: new Date(),
  };
}

/**
 * Get the current review schedule for a set of cards.
 */
export function getReviewSchedule(cards: MemoryCard[]): ReviewSchedule {
  const now = new Date();
  const soonThreshold = new Date(now.getTime() + 2 * 3600000); // 2 hours from now

  const dueNow = cards.filter((c) => c.nextReviewAt <= now);
  const dueSoon = cards.filter(
    (c) => c.nextReviewAt > now && c.nextReviewAt <= soonThreshold
  );
  const reviewed = cards.filter((c) => c.lastReviewedAt !== undefined).length;

  return {
    dueNow: dueNow.sort(
      (a, b) => a.nextReviewAt.getTime() - b.nextReviewAt.getTime()
    ),
    dueSoon: dueSoon.sort(
      (a, b) => a.nextReviewAt.getTime() - b.nextReviewAt.getTime()
    ),
    reviewed,
    totalCards: cards.length,
  };
}

/**
 * Generate demo cards for a patient's family members.
 */
export function generateFamilyCards(
  familyMembers: {
    name: string;
    relationship: string;
    photoUrl?: string;
  }[]
): MemoryCard[] {
  return familyMembers.map((member, index) =>
    createCard({
      id: `family-${index}`,
      prompt: `Who is ${member.name}?`,
      answer: `${member.name} is your ${member.relationship}`,
      category: 'person',
      photoUrl: member.photoUrl,
    })
  );
}
