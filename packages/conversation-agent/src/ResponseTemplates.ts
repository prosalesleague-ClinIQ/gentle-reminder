/**
 * ResponseTemplates -- pre-written warm responses for demo mode.
 *
 * Every template uses {name} as a placeholder for personalisation.
 * Templates are organised by Intent and selected based on context.
 */

import {
  Intent,
  ConversationContext,
  FamilyMember,
  TimeOfDay,
} from './types';

// ---------------------------------------------------------------------------
// Template collections
// ---------------------------------------------------------------------------

const GREETING_TEMPLATES: string[] = [
  'Hello, {name}! It is so lovely to see you today.',
  'Hi there, {name}. How wonderful to be spending time with you.',
  'Good to see you, {name}. I hope you are feeling well today.',
  '{name}, hello! What a nice day to have a chat together.',
  'Well hello, {name}! I have been looking forward to talking with you.',
];

const GREETING_MORNING: string[] = [
  'Good morning, {name}! I hope you slept well. It is a beautiful day.',
  'Good morning, {name}. How lovely to start the day together.',
  'A very good morning to you, {name}. The day is full of promise.',
];

const GREETING_AFTERNOON: string[] = [
  'Good afternoon, {name}! I hope your day has been going well.',
  'Hello, {name}. What a pleasant afternoon to have a chat.',
  'Good afternoon, {name}. It is so nice to spend this time with you.',
];

const GREETING_EVENING: string[] = [
  'Good evening, {name}. How nice to see you this evening.',
  'Hello, {name}. I hope you have had a lovely day.',
  'Good evening, {name}. What a wonderful way to end the day, chatting together.',
];

const ORIENTATION_DATE_TEMPLATES: string[] = [
  'Today is {date}, {name}. It is a lovely day.',
  '{name}, today is {date}. Everything is going along nicely.',
  'It is {date} today, {name}. You are doing just fine.',
  'Let me see -- today is {date}, {name}. A wonderful day.',
  '{name}, right now it is {date}. No need to worry about a thing.',
];

const ORIENTATION_LOCATION_TEMPLATES: string[] = [
  'You are at {location}, {name}. You are safe and comfortable here.',
  '{name}, we are at {location}. This is a safe and familiar place.',
  'Right now you are at {location}, {name}. Everything is alright.',
  'You are at {location}, {name}. You belong right here.',
  '{name}, you are at {location}. I am right here with you.',
];

const ORIENTATION_TIME_TEMPLATES: string[] = [
  'It is {timeOfDay} right now, {name}. There is no rush at all.',
  '{name}, it is {timeOfDay}. Everything is going along smoothly.',
  'Right now it is {timeOfDay}, {name}. Take your time and relax.',
];

const FAMILY_TEMPLATES: Record<string, string[]> = {
  spouse: [
    '{memberName} is your {relationship}, {name}. You share so many wonderful memories together.',
    '{name}, {memberName} is your loving {relationship}. They care about you very much.',
  ],
  child: [
    '{memberName} is your {relationship}, {name}. They love you dearly.',
    '{name}, {memberName} is your {relationship}. You must be so proud of them.',
  ],
  grandchild: [
    '{memberName} is your grandchild, {name}. They bring so much joy to the family.',
    '{name}, {memberName} is your grandchild. What a wonderful family you have.',
  ],
  sibling: [
    '{memberName} is your {relationship}, {name}. You have shared so many years together.',
    '{name}, {memberName} is your {relationship}. What a special bond you two have.',
  ],
  default: [
    '{memberName} is your {relationship}, {name}. They are an important part of your life.',
    '{name}, {memberName} is your {relationship}. How wonderful to have them in your life.',
  ],
};

const STORY_TEMPLATES: string[] = [
  '{name}, I would love to hear about that. What do you remember most?',
  'That sounds like a wonderful memory, {name}. Could you tell me more?',
  'What a lovely thing to think about, {name}. Please, go on -- I am listening.',
  '{name}, that is so interesting. What was your favourite part?',
  'I would love to hear more, {name}. Take your time -- there is no rush.',
];

const CONFUSION_TEMPLATES: string[] = [
  'It is alright, {name}. You are safe, and I am right here with you.',
  '{name}, there is nothing to worry about. Everything is going to be just fine.',
  'You are doing wonderfully, {name}. Let us take things one step at a time.',
  'That is perfectly okay, {name}. We can figure this out together.',
  '{name}, you are not alone. I am here, and we have all the time in the world.',
];

const HELP_TEMPLATES: string[] = [
  'I am here for you, {name}. You are safe and everything is alright.',
  '{name}, do not worry. Help is always close by. You are not alone.',
  'It is okay to feel this way, {name}. I am right here with you, and you are safe.',
  '{name}, take a deep breath with me. You are safe, and I am here to help.',
  'You are going to be alright, {name}. I am here, and I am not going anywhere.',
];

const GENERAL_TEMPLATES: string[] = [
  'That is a lovely thought, {name}. Tell me more if you like.',
  '{name}, I enjoy talking with you. What else is on your mind?',
  'How interesting, {name}. I am happy to chat about whatever you like.',
  '{name}, it is always nice spending time together. What would you like to talk about?',
  'Thank you for sharing that, {name}. I am here whenever you want to chat.',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function personalise(template: string, replacements: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Select and personalise a response template based on intent and context.
 */
export function selectTemplate(
  intent: Intent,
  context: ConversationContext,
  extra?: { familyMember?: FamilyMember; timeOfDay?: TimeOfDay },
): string {
  const name = context.patientName;

  switch (intent) {
    case Intent.GREETING: {
      const tod = extra?.timeOfDay;
      let pool = GREETING_TEMPLATES;
      if (tod === 'morning') pool = GREETING_MORNING;
      else if (tod === 'afternoon') pool = GREETING_AFTERNOON;
      else if (tod === 'evening') pool = GREETING_EVENING;
      return personalise(pickRandom(pool), { name });
    }

    case Intent.ORIENTATION: {
      const date = context.currentDate || 'a lovely day';
      const location = context.location || 'a safe and comfortable place';
      // Mix date and location templates
      const pool = [...ORIENTATION_DATE_TEMPLATES, ...ORIENTATION_LOCATION_TEMPLATES];
      return personalise(pickRandom(pool), { name, date, location });
    }

    case Intent.FAMILY_QUESTION: {
      const member = extra?.familyMember;
      if (member) {
        const key = member.relationship in FAMILY_TEMPLATES
          ? member.relationship
          : 'default';
        const pool = FAMILY_TEMPLATES[key] || FAMILY_TEMPLATES['default'];
        return personalise(pickRandom(pool), {
          name,
          memberName: member.name,
          relationship: member.relationship,
        });
      }
      return personalise(
        '{name}, your family loves you very much. Would you like to hear about someone special?',
        { name },
      );
    }

    case Intent.STORY_REQUEST:
      return personalise(pickRandom(STORY_TEMPLATES), { name });

    case Intent.CONFUSION:
      return personalise(pickRandom(CONFUSION_TEMPLATES), { name });

    case Intent.HELP_REQUEST:
      return personalise(pickRandom(HELP_TEMPLATES), { name });

    case Intent.GENERAL:
    default:
      return personalise(pickRandom(GENERAL_TEMPLATES), { name });
  }
}
