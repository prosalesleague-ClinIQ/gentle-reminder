/**
 * ConversationManager -- orchestrates the full conversation flow:
 * intent classification, prompt building, response generation,
 * safety filtering, and fatigue detection.
 */

import {
  ConversationContext,
  ConversationMessage,
  ConversationTurn,
  ConversationSummary,
  Intent,
  EmotionDetected,
  TimeOfDay,
  FamilyMember,
  AgentConfig,
} from './types';
import { classifyIntent, detectRepeatedQuestion } from './IntentClassifier';
import { buildSystemPrompt, buildConversationPrompt } from './PromptBuilder';
import { filterResponse } from './SafetyFilter';
import { selectTemplate } from './ResponseTemplates';

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_CONFIG: AgentConfig = {
  model: 'demo',
  temperature: 0.7,
  maxTokens: 256,
  systemPromptTemplate: '',
  safetyGuidelines: [],
  demoMode: true,
};

// ---------------------------------------------------------------------------
// Emotion detection (lightweight keyword approach)
// ---------------------------------------------------------------------------

function detectEmotion(text: string): EmotionDetected {
  const lower = text.toLowerCase();

  const emotionKeywords: Record<EmotionDetected, string[]> = {
    happy: ['happy', 'glad', 'wonderful', 'great', 'love', 'joy', 'smile', 'laugh'],
    calm: ['calm', 'peaceful', 'relaxed', 'fine', 'okay', 'alright', 'good'],
    confused: ['confused', "don't know", "can't remember", 'lost', 'what', 'where', 'who am i'],
    anxious: ['worried', 'anxious', 'nervous', 'scared', 'afraid', 'frightened', 'panic'],
    sad: ['sad', 'cry', 'miss', 'lonely', 'alone', 'unhappy', 'tearful'],
    frustrated: ['frustrated', 'angry', 'annoyed', 'upset', 'mad', 'irritated'],
    neutral: [],
  };

  let bestEmotion: EmotionDetected = 'neutral';
  let bestScore = 0;

  for (const [emotion, keywords] of Object.entries(emotionKeywords) as [EmotionDetected, string[]][]) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestEmotion = emotion;
    }
  }

  return bestEmotion;
}

// ---------------------------------------------------------------------------
// Time-of-day helper
// ---------------------------------------------------------------------------

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

// ---------------------------------------------------------------------------
// ConversationManager class
// ---------------------------------------------------------------------------

export class ConversationManager {
  private history: ConversationMessage[] = [];
  private turns: ConversationTurn[] = [];
  private config: AgentConfig;
  private startTime: number = Date.now();
  private topicsDiscussed: Set<string> = new Set();

  constructor(config?: Partial<AgentConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // -----------------------------------------------------------------------
  // Public methods
  // -----------------------------------------------------------------------

  /**
   * Begin a new conversation and return the opening greeting.
   */
  startConversation(context: ConversationContext): string {
    this.history = [];
    this.turns = [];
    this.startTime = Date.now();
    this.topicsDiscussed.clear();

    const greeting = this.generateGreeting(
      context.patientName,
      getTimeOfDay(),
      context.cognitiveState,
    );

    this.history.push({
      role: 'agent',
      content: greeting,
      timestamp: new Date().toISOString(),
    });

    return greeting;
  }

  /**
   * Process one user message and return a full ConversationTurn.
   */
  processMessage(
    userMessage: string,
    context: ConversationContext,
  ): ConversationTurn {
    const t0 = Date.now();

    // Record the user message
    this.history.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    });

    // Classify intent
    const intent = classifyIntent(userMessage);
    const emotionDetected = detectEmotion(userMessage);
    const isRepeated = detectRepeatedQuestion(userMessage, this.history.slice(0, -1));

    // Generate response
    let response: string;

    if (isRepeated && intent === Intent.CONFUSION) {
      response = this.handleConfusion(context.patientName, context);
    } else if (intent === Intent.CONFUSION) {
      response = this.handleConfusion(context.patientName, context);
    } else if (intent === Intent.HELP_REQUEST) {
      response = this.handleHelpRequest(context);
    } else if (intent === Intent.FAMILY_QUESTION) {
      response = this.handleFamilyQuestion(userMessage, context.familyMembers, context);
    } else if (this.config.demoMode) {
      response = selectTemplate(intent, context, { timeOfDay: getTimeOfDay() });
    } else {
      // In production this would call the LLM; for now fall back to templates
      response = selectTemplate(intent, context, { timeOfDay: getTimeOfDay() });
    }

    // Safety filter
    response = filterResponse(response, context);

    // Track topic
    this.topicsDiscussed.add(intent);

    // Record agent message
    this.history.push({
      role: 'agent',
      content: response,
      timestamp: new Date().toISOString(),
    });

    const turn: ConversationTurn = {
      userMessage,
      agentResponse: response,
      intent,
      emotionDetected,
      responseTimeMs: Date.now() - t0,
    };

    this.turns.push(turn);
    return turn;
  }

  /**
   * Produce a summary of the conversation so far.
   */
  getConversationSummary(): ConversationSummary {
    const moodTrajectory = this.turns.map((t) => t.emotionDetected);
    const durationSeconds = Math.round((Date.now() - this.startTime) / 1000);

    return {
      totalTurns: this.turns.length,
      topicsDiscussed: [...this.topicsDiscussed].map(String),
      moodTrajectory,
      durationSeconds,
      endedByFatigue: this.shouldEndConversation(this.turns),
    };
  }

  /**
   * Heuristic: should we gently end the conversation?
   * Triggers if there are many turns, increasing confusion,
   * or very short / repetitive responses.
   */
  shouldEndConversation(turns: ConversationTurn[]): boolean {
    // Too many turns -- patient may be fatigued
    if (turns.length >= 20) return true;

    // Check last 5 turns for escalating confusion
    const recent = turns.slice(-5);
    const confusionCount = recent.filter(
      (t) => t.intent === Intent.CONFUSION || t.emotionDetected === 'confused',
    ).length;
    if (confusionCount >= 3) return true;

    // Check for very short consecutive messages (possible fatigue)
    const shortCount = recent.filter((t) => t.userMessage.split(/\s+/).length <= 2).length;
    if (shortCount >= 4) return true;

    return false;
  }

  /**
   * Generate a warm, time-appropriate opening greeting.
   */
  generateGreeting(
    name: string,
    timeOfDay: TimeOfDay,
    cognitiveState: string,
  ): string {
    const greetings: Record<TimeOfDay, string[]> = {
      morning: [
        `Good morning, ${name}! I hope you slept well. It is a beautiful day.`,
        `Good morning, ${name}. How lovely to start the day together.`,
        `A very good morning to you, ${name}. The day is full of promise.`,
      ],
      afternoon: [
        `Good afternoon, ${name}! I hope your day has been going well.`,
        `Hello, ${name}. What a pleasant afternoon to have a chat.`,
        `Good afternoon, ${name}. It is so nice to spend this time with you.`,
      ],
      evening: [
        `Good evening, ${name}. How nice to see you this evening.`,
        `Hello, ${name}. I hope you have had a lovely day.`,
        `Good evening, ${name}. What a wonderful way to end the day.`,
      ],
    };

    const pool = greetings[timeOfDay];
    const greeting = pool[Math.floor(Math.random() * pool.length)];

    // For agitated/anxious states, prepend reassurance
    if (cognitiveState === 'agitated' || cognitiveState === 'anxious') {
      return `${name}, you are safe and everything is alright. ${greeting}`;
    }

    return greeting;
  }

  /**
   * Handle a confusion-type message with gentle reassurance.
   */
  handleConfusion(name: string, context: ConversationContext): string {
    const reassurances = [
      `It is alright, ${name}. You are safe, and I am right here with you.`,
      `${name}, there is nothing to worry about. Everything is just fine.`,
      `You are doing wonderfully, ${name}. There is no rush at all.`,
      `That is perfectly okay, ${name}. We can take things as slowly as you like.`,
    ];

    let response = reassurances[Math.floor(Math.random() * reassurances.length)];

    // Add orientation cue if available
    if (context.location) {
      response += ` You are at ${context.location}.`;
    }
    if (context.currentDate) {
      response += ` Today is ${context.currentDate}.`;
    }

    return response;
  }

  /**
   * Handle a question about a family member.
   */
  handleFamilyQuestion(
    question: string,
    familyMembers: FamilyMember[],
    context: ConversationContext,
  ): string {
    const lower = question.toLowerCase();

    // Try to match a family member name in the question
    const matchedMember = familyMembers.find((m) =>
      lower.includes(m.name.toLowerCase()),
    );

    if (matchedMember) {
      return selectTemplate(Intent.FAMILY_QUESTION, context, {
        familyMember: matchedMember,
      });
    }

    // Try to match by relationship
    const matchedByRelation = familyMembers.find((m) =>
      lower.includes(m.relationship),
    );

    if (matchedByRelation) {
      return selectTemplate(Intent.FAMILY_QUESTION, context, {
        familyMember: matchedByRelation,
      });
    }

    // Generic family response
    if (familyMembers.length > 0) {
      const first = familyMembers[0];
      return (
        `${context.patientName}, your family loves you very much. ` +
        `Would you like to hear about ${first.name}, your ${first.relationship}?`
      );
    }

    return (
      `${context.patientName}, your family cares about you deeply. ` +
      'Would you like to talk about someone special?'
    );
  }

  /**
   * Handle an explicit help request with calming language.
   */
  private handleHelpRequest(context: ConversationContext): string {
    return selectTemplate(Intent.HELP_REQUEST, context);
  }

  /** Get the full conversation history */
  getHistory(): ConversationMessage[] {
    return [...this.history];
  }

  /** Get all turns */
  getTurns(): ConversationTurn[] {
    return [...this.turns];
  }
}
