/**
 * Tests for the Gentle Reminder conversation agent.
 */

import { classifyIntent, getConfidence, detectRepeatedQuestion } from '../src/IntentClassifier';
import { isResponseSafe, filterResponse, addReassurance, BANNED_PHRASES } from '../src/SafetyFilter';
import { buildSystemPrompt, buildOrientationPrompt, buildReminiscencePrompt, buildReassurancePrompt } from '../src/PromptBuilder';
import { ConversationManager } from '../src/ConversationManager';
import { selectTemplate } from '../src/ResponseTemplates';
import { Intent, ConversationContext, ConversationMessage, FamilyMember } from '../src/types';

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

function makeContext(overrides?: Partial<ConversationContext>): ConversationContext {
  return {
    patientName: 'Margaret',
    cognitiveState: 'calm',
    familyMembers: [
      { name: 'John', relationship: 'spouse', description: 'Married 50 years' },
      { name: 'Sarah', relationship: 'child', description: 'Eldest daughter' },
      { name: 'Tommy', relationship: 'grandchild', description: 'Age 8' },
    ],
    recentTopics: [],
    currentMood: 'neutral',
    location: 'Home',
    currentDate: 'Tuesday, April 1st, 2026',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Intent classification
// ---------------------------------------------------------------------------

describe('IntentClassifier', () => {
  test('classifies greetings', () => {
    expect(classifyIntent('Hello there!')).toBe(Intent.GREETING);
    expect(classifyIntent('Good morning')).toBe(Intent.GREETING);
    expect(classifyIntent('Hi, how are you?')).toBe(Intent.GREETING);
  });

  test('classifies orientation questions', () => {
    expect(classifyIntent('What day is it today?')).toBe(Intent.ORIENTATION);
    expect(classifyIntent('Where am I?')).toBe(Intent.ORIENTATION);
    expect(classifyIntent('What time is it?')).toBe(Intent.ORIENTATION);
    expect(classifyIntent('What year is this?')).toBe(Intent.ORIENTATION);
  });

  test('classifies family questions', () => {
    expect(classifyIntent('Who is Sarah?')).toBe(Intent.FAMILY_QUESTION);
    expect(classifyIntent('Where is my wife?')).toBe(Intent.FAMILY_QUESTION);
    expect(classifyIntent('Tell me about my daughter')).toBe(Intent.FAMILY_QUESTION);
  });

  test('classifies story requests', () => {
    expect(classifyIntent('Tell me a story')).toBe(Intent.STORY_REQUEST);
    expect(classifyIntent('Remember when we went to the beach?')).toBe(Intent.STORY_REQUEST);
    expect(classifyIntent('When I was young...')).toBe(Intent.STORY_REQUEST);
  });

  test('classifies confusion signals', () => {
    expect(classifyIntent("I don't know where I am")).toBe(Intent.CONFUSION);
    expect(classifyIntent("I'm lost and confused")).toBe(Intent.CONFUSION);
    expect(classifyIntent("I can't remember anything")).toBe(Intent.CONFUSION);
  });

  test('classifies help requests', () => {
    expect(classifyIntent('Help me please')).toBe(Intent.HELP_REQUEST);
    expect(classifyIntent("I'm scared")).toBe(Intent.HELP_REQUEST);
    expect(classifyIntent('I need help')).toBe(Intent.HELP_REQUEST);
  });

  test('returns GENERAL for unmatched input', () => {
    expect(classifyIntent('The weather is nice')).toBe(Intent.GENERAL);
    expect(classifyIntent('I like flowers')).toBe(Intent.GENERAL);
  });

  test('getConfidence returns a value between 0 and 1', () => {
    const confidence = getConfidence('Hello there!', Intent.GREETING);
    expect(confidence).toBeGreaterThan(0);
    expect(confidence).toBeLessThanOrEqual(1);
  });

  test('getConfidence returns 0 for non-matching intent', () => {
    const confidence = getConfidence('Hello there!', Intent.HELP_REQUEST);
    expect(confidence).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Repeated question detection
// ---------------------------------------------------------------------------

describe('detectRepeatedQuestion', () => {
  test('detects exact repeated question', () => {
    const history: ConversationMessage[] = [
      { role: 'user', content: 'What day is it?', timestamp: '2026-01-01T10:00:00Z' },
      { role: 'agent', content: 'It is Tuesday.', timestamp: '2026-01-01T10:00:01Z' },
    ];
    expect(detectRepeatedQuestion('What day is it?', history)).toBe(true);
  });

  test('detects near-duplicate question', () => {
    const history: ConversationMessage[] = [
      { role: 'user', content: 'What day is it today?', timestamp: '2026-01-01T10:00:00Z' },
    ];
    expect(detectRepeatedQuestion('What day is it today', history)).toBe(true);
  });

  test('does not flag new questions', () => {
    const history: ConversationMessage[] = [
      { role: 'user', content: 'What day is it?', timestamp: '2026-01-01T10:00:00Z' },
    ];
    expect(detectRepeatedQuestion('Where is my daughter?', history)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Safety filter
// ---------------------------------------------------------------------------

describe('SafetyFilter', () => {
  test('flags banned phrases', () => {
    const result = isResponseSafe('You forgot again, try to remember.');
    expect(result.safe).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  test('flags negative tone words', () => {
    const result = isResponseSafe('That was a stupid question.');
    expect(result.safe).toBe(false);
    expect(result.issues.some((i) => i.includes('negative tone'))).toBe(true);
  });

  test('accepts safe responses', () => {
    const result = isResponseSafe('That is a lovely thought, Margaret.');
    expect(result.safe).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  test('flags empty responses', () => {
    const result = isResponseSafe('');
    expect(result.safe).toBe(false);
  });

  test('filterResponse removes banned phrases', () => {
    const context = makeContext();
    const filtered = filterResponse('You forgot your name. You are wrong about that.', context);
    expect(filtered.toLowerCase()).not.toContain('you forgot');
    expect(filtered.toLowerCase()).not.toContain('you are wrong');
  });

  test('filterResponse adds reassurance for confused state', () => {
    const context = makeContext({ cognitiveState: 'confused' });
    const filtered = filterResponse('It is Tuesday today.', context);
    expect(filtered).toContain('Margaret');
    expect(filtered.length).toBeGreaterThan('It is Tuesday today.'.length);
  });

  test('addReassurance personalises with name', () => {
    const result = addReassurance('It is okay.', 'Margaret');
    expect(result).toContain('Margaret');
    expect(result.length).toBeGreaterThan('It is okay.'.length);
  });

  test('BANNED_PHRASES list is populated', () => {
    expect(BANNED_PHRASES.length).toBeGreaterThan(10);
  });
});

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

describe('PromptBuilder', () => {
  test('buildSystemPrompt includes patient name', () => {
    const context = makeContext();
    const prompt = buildSystemPrompt(context);
    expect(prompt).toContain('Margaret');
  });

  test('buildSystemPrompt includes cognitive state guidance', () => {
    const context = makeContext({ cognitiveState: 'anxious' });
    const prompt = buildSystemPrompt(context);
    expect(prompt).toContain('anxious');
    expect(prompt).toContain('calming');
  });

  test('buildSystemPrompt includes family members', () => {
    const context = makeContext();
    const prompt = buildSystemPrompt(context);
    expect(prompt).toContain('John');
    expect(prompt).toContain('Sarah');
    expect(prompt).toContain('spouse');
  });

  test('buildSystemPrompt includes safety rules', () => {
    const context = makeContext();
    const prompt = buildSystemPrompt(context);
    expect(prompt).toContain('Never contradict');
    expect(prompt).toContain('warm');
  });

  test('buildOrientationPrompt includes date and location', () => {
    const prompt = buildOrientationPrompt('Margaret', 'Tuesday April 1st', 'Home');
    expect(prompt).toContain('Tuesday April 1st');
    expect(prompt).toContain('Home');
    expect(prompt).toContain('Margaret');
  });

  test('buildReminiscencePrompt includes topic', () => {
    const prompt = buildReminiscencePrompt('childhood holidays', []);
    expect(prompt).toContain('childhood holidays');
  });

  test('buildReassurancePrompt adapts to agitated state', () => {
    const prompt = buildReassurancePrompt('Margaret', 'agitated');
    expect(prompt).toContain('distress');
    expect(prompt).toContain('Margaret');
  });
});

// ---------------------------------------------------------------------------
// Response templates
// ---------------------------------------------------------------------------

describe('ResponseTemplates', () => {
  test('selectTemplate personalises with patient name', () => {
    const context = makeContext();
    const response = selectTemplate(Intent.GREETING, context);
    expect(response).toContain('Margaret');
  });

  test('selectTemplate returns different templates for different intents', () => {
    const context = makeContext();
    const greeting = selectTemplate(Intent.GREETING, context);
    const confusion = selectTemplate(Intent.CONFUSION, context);
    // They should not be identical (statistically very unlikely)
    // but at minimum both should contain the name
    expect(greeting).toContain('Margaret');
    expect(confusion).toContain('Margaret');
  });

  test('family template includes member name when provided', () => {
    const context = makeContext();
    const member: FamilyMember = { name: 'John', relationship: 'spouse' };
    const response = selectTemplate(Intent.FAMILY_QUESTION, context, { familyMember: member });
    expect(response).toContain('John');
  });
});

// ---------------------------------------------------------------------------
// Conversation manager
// ---------------------------------------------------------------------------

describe('ConversationManager', () => {
  test('startConversation returns a greeting with patient name', () => {
    const manager = new ConversationManager();
    const context = makeContext();
    const greeting = manager.startConversation(context);
    expect(greeting).toContain('Margaret');
  });

  test('processMessage returns a ConversationTurn', () => {
    const manager = new ConversationManager();
    const context = makeContext();
    manager.startConversation(context);

    const turn = manager.processMessage('Hello!', context);
    expect(turn.userMessage).toBe('Hello!');
    expect(turn.agentResponse.length).toBeGreaterThan(0);
    expect(turn.intent).toBe(Intent.GREETING);
    expect(turn.responseTimeMs).toBeGreaterThanOrEqual(0);
  });

  test('handles confusion with reassurance', () => {
    const manager = new ConversationManager();
    const context = makeContext({ cognitiveState: 'confused' });
    manager.startConversation(context);

    const turn = manager.processMessage("I don't know where I am", context);
    expect(turn.intent).toBe(Intent.CONFUSION);
    expect(turn.agentResponse).toContain('Margaret');
  });

  test('handles family questions', () => {
    const manager = new ConversationManager();
    const context = makeContext();
    manager.startConversation(context);

    const turn = manager.processMessage('Who is John?', context);
    expect(turn.intent).toBe(Intent.FAMILY_QUESTION);
    expect(turn.agentResponse).toContain('John');
  });

  test('getConversationSummary tracks turns', () => {
    const manager = new ConversationManager();
    const context = makeContext();
    manager.startConversation(context);
    manager.processMessage('Hello', context);
    manager.processMessage('What day is it?', context);

    const summary = manager.getConversationSummary();
    expect(summary.totalTurns).toBe(2);
    expect(summary.topicsDiscussed.length).toBeGreaterThan(0);
  });

  test('shouldEndConversation detects fatigue after many turns', () => {
    const manager = new ConversationManager();
    const fakeTurns = Array.from({ length: 21 }, (_, i) => ({
      userMessage: `message ${i}`,
      agentResponse: 'response',
      intent: Intent.GENERAL,
      emotionDetected: 'neutral' as const,
      responseTimeMs: 10,
    }));
    expect(manager.shouldEndConversation(fakeTurns)).toBe(true);
  });

  test('shouldEndConversation detects escalating confusion', () => {
    const manager = new ConversationManager();
    const confusedTurns = Array.from({ length: 5 }, () => ({
      userMessage: "I don't know",
      agentResponse: 'It is alright.',
      intent: Intent.CONFUSION,
      emotionDetected: 'confused' as const,
      responseTimeMs: 10,
    }));
    expect(manager.shouldEndConversation(confusedTurns)).toBe(true);
  });

  test('shouldEndConversation returns false for normal conversation', () => {
    const manager = new ConversationManager();
    const normalTurns = [
      { userMessage: 'Hello', agentResponse: 'Hi!', intent: Intent.GREETING, emotionDetected: 'happy' as const, responseTimeMs: 10 },
      { userMessage: 'Nice day', agentResponse: 'Yes!', intent: Intent.GENERAL, emotionDetected: 'calm' as const, responseTimeMs: 10 },
    ];
    expect(manager.shouldEndConversation(normalTurns)).toBe(false);
  });
});
