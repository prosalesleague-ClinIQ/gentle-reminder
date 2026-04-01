import { FeedbackType } from '@gentle-reminder/shared-types';

/**
 * Client-side score display helpers.
 * All messages are warm, personal, and never negative.
 */

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Wonderful';
  if (score >= 60) return 'Very Good';
  if (score >= 40) return 'Good Effort';
  return 'Great Try';
}

/**
 * Get a warm, personal feedback message.
 * These are spoken aloud, so they should sound like a caring person talking.
 */
export function getFeedbackMessage(feedbackType: FeedbackType, preferredName?: string): string {
  const name = preferredName || 'dear';
  switch (feedbackType) {
    case FeedbackType.CELEBRATED:
      return `Oh, that's wonderful, ${name}! You got it just right.`;
    case FeedbackType.GUIDED:
      return `You're so close, ${name}. That was a really good try. Let me show you.`;
    case FeedbackType.SUPPORTED:
      return `That's perfectly alright, ${name}. Let's look at this one together. No rush at all.`;
  }
}

export function getFeedbackIcon(feedbackType: FeedbackType): string {
  switch (feedbackType) {
    case FeedbackType.CELEBRATED: return 'star';
    case FeedbackType.GUIDED: return 'compass';
    case FeedbackType.SUPPORTED: return 'heart';
  }
}

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs} seconds`;
  if (secs === 0) return `${mins} minute${mins !== 1 ? 's' : ''}`;
  return `${mins} min ${secs} sec`;
}

/**
 * Session completion message - warm and personal.
 * Spoken at the end of every session, so it should feel like a hug.
 */
export function getCompletionMessage(
  celebratedCount: number,
  totalExercises: number,
  preferredName?: string,
): string {
  const name = preferredName || 'dear';
  const ratio = totalExercises > 0 ? celebratedCount / totalExercises : 0;

  if (ratio >= 0.8) {
    return `What a wonderful session, ${name}. You should be so proud of yourself today. You really shone.`;
  }
  if (ratio >= 0.5) {
    return `That was really lovely, ${name}. You put in such good effort today, and it shows. Well done.`;
  }
  return `Thank you for spending this time with me, ${name}. Every moment you practice makes a difference. You did beautifully.`;
}
