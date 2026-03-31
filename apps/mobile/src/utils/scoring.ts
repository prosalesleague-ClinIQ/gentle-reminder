import { FeedbackType } from '@gentle-reminder/shared-types';

/**
 * Client-side score display helpers.
 * These are for UI display only - actual scoring happens in the cognitive engine.
 */

/**
 * Convert a 0-100 score into a friendly label.
 * Never shows negative language.
 */
export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Wonderful';
  if (score >= 60) return 'Very Good';
  if (score >= 40) return 'Good Effort';
  return 'Great Try';
}

/**
 * Get a friendly, encouraging message based on the feedback type.
 */
export function getFeedbackMessage(feedbackType: FeedbackType, preferredName?: string): string {
  const name = preferredName || '';
  switch (feedbackType) {
    case FeedbackType.CELEBRATED:
      return name ? `That's wonderful, ${name}!` : "That's wonderful!";
    case FeedbackType.GUIDED:
      return name
        ? `You're doing great, ${name}. Let me help a little.`
        : "You're doing great. Let me help a little.";
    case FeedbackType.SUPPORTED:
      return name
        ? `No worries at all, ${name}. Let's look at this together.`
        : "No worries at all. Let's look at this together.";
  }
}

/**
 * Get the display emoji/icon name for a feedback type.
 */
export function getFeedbackIcon(feedbackType: FeedbackType): string {
  switch (feedbackType) {
    case FeedbackType.CELEBRATED:
      return 'star';
    case FeedbackType.GUIDED:
      return 'compass';
    case FeedbackType.SUPPORTED:
      return 'heart';
  }
}

/**
 * Format a score as a percentage string.
 */
export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

/**
 * Format elapsed seconds as "X minutes" or "X min Y sec".
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins === 0) {
    return `${secs} seconds`;
  }

  if (secs === 0) {
    return `${mins} minute${mins !== 1 ? 's' : ''}`;
  }

  return `${mins} min ${secs} sec`;
}

/**
 * Get a session completion message based on feedback counts.
 */
export function getCompletionMessage(
  celebratedCount: number,
  totalExercises: number,
  preferredName?: string,
): string {
  const name = preferredName || '';
  const ratio = totalExercises > 0 ? celebratedCount / totalExercises : 0;

  if (ratio >= 0.8) {
    return name
      ? `Amazing session, ${name}! You did wonderfully today.`
      : 'Amazing session! You did wonderfully today.';
  }
  if (ratio >= 0.5) {
    return name
      ? `Great work today, ${name}! Every session makes a difference.`
      : 'Great work today! Every session makes a difference.';
  }
  return name
    ? `Thank you for spending this time, ${name}. You did great!`
    : 'Thank you for spending this time. You did great!';
}
