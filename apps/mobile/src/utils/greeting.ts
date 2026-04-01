/**
 * Warm, personal greeting generator.
 * These greetings are spoken aloud, so they should sound like
 * a caring family member welcoming the patient.
 */

type TimeOfDay = 'morning' | 'afternoon' | 'evening';

function getTimeOfDay(hour?: number): TimeOfDay {
  const h = hour ?? new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

/**
 * Generate a warm, spoken greeting.
 * These rotate so the patient doesn't hear the same thing every time.
 */
export function getGreeting(preferredName: string, hour?: number): string {
  const timeOfDay = getTimeOfDay(hour);
  const name = preferredName || 'dear';

  const morningGreetings = [
    `Good morning, ${name}. It's so lovely to see you today.`,
    `Hello, ${name}. What a beautiful morning. I hope you slept well.`,
    `Good morning, ${name}. The sun is up and it's going to be a wonderful day.`,
  ];

  const afternoonGreetings = [
    `Good afternoon, ${name}. I hope you're having a nice day so far.`,
    `Hello, ${name}. It's a lovely afternoon. How are you feeling?`,
    `Good afternoon, ${name}. It's so good to see you.`,
  ];

  const eveningGreetings = [
    `Good evening, ${name}. I hope you've had a wonderful day.`,
    `Hello, ${name}. It's a peaceful evening. Let's take it easy.`,
    `Good evening, ${name}. You've done so well today. Time to relax.`,
  ];

  const greetings = timeOfDay === 'morning'
    ? morningGreetings
    : timeOfDay === 'afternoon'
    ? afternoonGreetings
    : eveningGreetings;

  // Pick based on day of month so it changes daily but stays consistent within a day
  const dayIndex = new Date().getDate() % greetings.length;
  return greetings[dayIndex];
}

/**
 * Short greeting for display (not spoken).
 */
export function getShortGreeting(hour?: number): string {
  const timeOfDay = getTimeOfDay(hour);
  switch (timeOfDay) {
    case 'morning': return 'Good morning';
    case 'afternoon': return 'Good afternoon';
    case 'evening': return 'Good evening';
  }
}

export function getFriendlyDate(date?: Date): string {
  const d = date ?? new Date();
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getDayOfWeek(date?: Date): string {
  const d = date ?? new Date();
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}
