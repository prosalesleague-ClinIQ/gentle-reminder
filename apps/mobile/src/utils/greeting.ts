/**
 * Time-of-day greeting generator.
 * Produces warm, friendly greetings personalized for the patient.
 */

type TimeOfDay = 'morning' | 'afternoon' | 'evening';

/**
 * Determine the time of day based on the current hour.
 */
function getTimeOfDay(hour?: number): TimeOfDay {
  const h = hour ?? new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

/**
 * Get a greeting prefix based on time of day.
 */
function getGreetingPrefix(timeOfDay: TimeOfDay): string {
  switch (timeOfDay) {
    case 'morning':
      return 'Good morning';
    case 'afternoon':
      return 'Good afternoon';
    case 'evening':
      return 'Good evening';
  }
}

/**
 * Generate a personalized greeting.
 *
 * @example
 * getGreeting('Maggie') // "Good morning, Maggie!"
 * getGreeting('Maggie', 14) // "Good afternoon, Maggie!"
 */
export function getGreeting(preferredName: string, hour?: number): string {
  const timeOfDay = getTimeOfDay(hour);
  const prefix = getGreetingPrefix(timeOfDay);
  return `${prefix}, ${preferredName}!`;
}

/**
 * Get a short greeting without the name (for compact displays).
 */
export function getShortGreeting(hour?: number): string {
  const timeOfDay = getTimeOfDay(hour);
  return getGreetingPrefix(timeOfDay);
}

/**
 * Format today's date in a friendly, readable format.
 *
 * @example
 * getFriendlyDate() // "Sunday, March 30, 2026"
 */
export function getFriendlyDate(date?: Date): string {
  const d = date ?? new Date();
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Get today's day of the week.
 *
 * @example
 * getDayOfWeek() // "Sunday"
 */
export function getDayOfWeek(date?: Date): string {
  const d = date ?? new Date();
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}
