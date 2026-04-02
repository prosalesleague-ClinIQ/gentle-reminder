/**
 * PromptBuilder -- constructs system and conversation prompts
 * tailored to the patient's cognitive state, family context, and mood.
 */

import {
  ConversationContext,
  ConversationMessage,
  CognitiveState,
  FamilyMember,
} from './types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function cognitiveStateGuidance(state: CognitiveState): string {
  switch (state) {
    case 'calm':
      return (
        'The person is calm and relaxed right now. ' +
        'You may engage in light conversation and gently encourage recall activities.'
      );
    case 'mildly_confused':
      return (
        'The person seems slightly unsure about things. ' +
        'Speak in short, clear sentences. Offer gentle cues rather than corrections.'
      );
    case 'confused':
      return (
        'The person is experiencing noticeable confusion. ' +
        'Keep your language very simple. Reassure them frequently. ' +
        'Do not ask complex questions. Focus on comfort and orientation.'
      );
    case 'anxious':
      return (
        'The person is feeling anxious or worried. ' +
        'Prioritise calming language. Validate their feelings. ' +
        'Offer grounding cues such as their name and location.'
      );
    case 'agitated':
      return (
        'The person is agitated. Speak softly and slowly. ' +
        'Do not introduce new topics. Focus entirely on reassurance. ' +
        'If they express distress, acknowledge it and offer comfort.'
      );
  }
}

function formatFamilyContext(members: FamilyMember[]): string {
  if (members.length === 0) {
    return 'No family information is available at this time.';
  }

  const lines = members.map((m) => {
    const desc = m.description ? ` -- ${m.description}` : '';
    return `- ${m.name} (${m.relationship})${desc}`;
  });

  return (
    'The following family members are known:\n' + lines.join('\n')
  );
}

function formatRecentTopics(topics: string[]): string {
  if (topics.length === 0) {
    return 'No recent topics recorded.';
  }
  return (
    'Topics already discussed recently (avoid repeating these):\n' +
    topics.map((t) => `- ${t}`).join('\n')
  );
}

// ---------------------------------------------------------------------------
// Safety rules (always injected)
// ---------------------------------------------------------------------------

const CORE_SAFETY_RULES: string[] = [
  'Never contradict the person, even if what they say is factually incorrect.',
  'Never correct them harshly. If redirection is needed, do so gently.',
  'Never provide medical advice, diagnoses, or medication instructions.',
  'Always use the person\'s preferred name when addressing them.',
  'Keep responses concise -- ideally under 3 sentences.',
  'Use warm, supportive language at all times.',
  'If the person becomes distressed, focus entirely on reassurance.',
  'Do not mention the word "dementia" or any clinical terminology.',
  'If the person repeats a question, answer it kindly each time as though it is the first time.',
  'Avoid abstract or complex concepts. Prefer concrete, sensory language.',
  'If you do not know the answer to a question, say so honestly but warmly.',
  'Never express frustration, impatience, or negativity.',
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Build the full system prompt that establishes the agent persona,
 * cognitive-state awareness, family context, and safety rules.
 */
export function buildSystemPrompt(context: ConversationContext): string {
  const sections: string[] = [];

  // Persona
  sections.push(
    `You are a warm, caring companion speaking to ${context.patientName}. ` +
    'Your role is to provide comfort, gentle stimulation, and a sense of connection. ' +
    'You speak like a kind friend -- never clinical, never condescending.'
  );

  // Cognitive state
  sections.push(
    '## Current cognitive state\n' +
    cognitiveStateGuidance(context.cognitiveState)
  );

  // Mood
  sections.push(
    '## Current mood\n' +
    `${context.patientName} appears to be feeling ${context.currentMood} right now. ` +
    'Adapt your tone accordingly.'
  );

  // Family context
  sections.push(
    '## Family context\n' +
    formatFamilyContext(context.familyMembers)
  );

  // Recent topics
  sections.push(
    '## Recent topics\n' +
    formatRecentTopics(context.recentTopics)
  );

  // Location & date (optional orientation cues)
  if (context.location || context.currentDate) {
    const parts: string[] = [];
    if (context.location) parts.push(`Location: ${context.location}`);
    if (context.currentDate) parts.push(`Date: ${context.currentDate}`);
    sections.push('## Orientation cues\n' + parts.join('\n'));
  }

  // Safety rules
  sections.push(
    '## Safety rules -- you MUST follow these at all times\n' +
    CORE_SAFETY_RULES.map((r, i) => `${i + 1}. ${r}`).join('\n')
  );

  return sections.join('\n\n');
}

/**
 * Format an array of conversation messages and the system prompt into a
 * single prompt string suitable for LLM submission.
 */
export function buildConversationPrompt(
  messages: ConversationMessage[],
  context: ConversationContext,
): string {
  const systemPrompt = buildSystemPrompt(context);

  const formattedMessages = messages
    .map((m) => {
      const label = m.role === 'user' ? context.patientName : 'Companion';
      return `${label}: ${m.content}`;
    })
    .join('\n');

  return (
    `[System]\n${systemPrompt}\n\n` +
    `[Conversation]\n${formattedMessages}\n\n` +
    'Companion:'
  );
}

/**
 * Build a prompt specifically for orientation support --
 * helping the person understand the date, time, or location.
 */
export function buildOrientationPrompt(
  name: string,
  date: string,
  location: string,
): string {
  return (
    `${name} has asked about the date or where they are. ` +
    'Please respond warmly with the following information, ' +
    'weaving it naturally into a comforting sentence.\n\n' +
    `Today's date: ${date}\n` +
    `Location: ${location}\n\n` +
    'Remember: keep it brief, warm, and reassuring. ' +
    `Use ${name}'s name when you respond.`
  );
}

/**
 * Build a prompt for reminiscence therapy --
 * encouraging the person to share memories on a topic.
 */
export function buildReminiscencePrompt(
  topic: string,
  familyContext: FamilyMember[],
): string {
  const familyStr = familyContext.length > 0
    ? '\n\nFamily members who may be relevant:\n' +
      familyContext.map((m) => `- ${m.name} (${m.relationship})`).join('\n')
    : '';

  return (
    `The person has expressed interest in talking about "${topic}". ` +
    'Gently encourage them to share memories or stories about this topic. ' +
    'Ask open-ended but simple questions. ' +
    'Show genuine interest and warmth in their recollections.' +
    familyStr
  );
}

/**
 * Build a prompt designed to calm and reassure the person.
 */
export function buildReassurancePrompt(
  name: string,
  cognitiveState: CognitiveState,
): string {
  const urgency = cognitiveState === 'agitated' || cognitiveState === 'anxious'
    ? 'The person is in distress. Your top priority is to provide immediate comfort. '
    : 'The person may be feeling uncertain. Offer a gentle word of reassurance. ';

  return (
    urgency +
    `Address ${name} by name. ` +
    'Remind them that they are safe, that they are not alone, ' +
    'and that everything is going to be alright. ' +
    'Keep your response to one or two short, soothing sentences.'
  );
}
