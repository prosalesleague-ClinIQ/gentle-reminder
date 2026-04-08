/**
 * Bridge between the mobile app and the conversation-agent package.
 *
 * Wraps ConversationManager to provide a simple chat interface:
 * - Starts conversations with patient context
 * - Processes messages and returns responses
 * - Detects fatigue and suggests ending
 * - Integrates with AICompanion for speech
 * - Integrates with VoiceCloneService for family-related responses
 */

import { ConversationManager } from '@gentle-reminder/conversation-agent';
import type {
  ConversationContext,
  ConversationTurn,
  ConversationSummary,
  FamilyMember,
} from '@gentle-reminder/conversation-agent';
import { aiCompanion } from './AICompanion';

// ── Demo Context ─────────────────────────────────────────────
// In production this would come from the patient's record.

const DEMO_FAMILY: FamilyMember[] = [
  { name: 'Lisa', relationship: 'daughter', photoUrl: undefined },
  { name: 'Robert', relationship: 'husband', photoUrl: undefined },
  { name: 'Emma', relationship: 'grandchild', photoUrl: undefined },
  { name: 'James', relationship: 'son', photoUrl: undefined },
];

function buildDemoContext(patientName: string): ConversationContext {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return {
    patientName,
    cognitiveState: 'calm',
    location: 'home',
    currentDate: `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`,
    familyMembers: DEMO_FAMILY,
    recentTopics: [],
  };
}

// ── Conversation Bridge Class ────────────────────────────────

class ConversationBridge {
  private static instance: ConversationBridge;
  private manager: ConversationManager;
  private context: ConversationContext;
  private patientName: string = 'Friend';
  private isActive: boolean = false;

  private constructor() {
    this.manager = new ConversationManager({ demoMode: true });
    this.context = buildDemoContext(this.patientName);
  }

  static getInstance(): ConversationBridge {
    if (!ConversationBridge.instance) {
      ConversationBridge.instance = new ConversationBridge();
    }
    return ConversationBridge.instance;
  }

  setPatientName(name: string): void {
    this.patientName = name;
    this.context = buildDemoContext(name);
  }

  /**
   * Start a new conversation. Returns the AI's opening greeting.
   */
  async startConversation(): Promise<string> {
    this.context = buildDemoContext(this.patientName);
    const greeting = this.manager.startConversation(this.context);
    this.isActive = true;

    // Speak the greeting via AI companion
    await aiCompanion.speak(greeting, 'warm');

    return greeting;
  }

  /**
   * Send a message and get the AI's response.
   * Also speaks the response aloud.
   */
  async sendMessage(text: string): Promise<ConversationTurn> {
    if (!this.isActive) {
      await this.startConversation();
    }

    const turn = this.manager.processMessage(text, this.context);

    // Determine mood for speech
    const mood = turn.emotionDetected === 'confused' || turn.emotionDetected === 'anxious'
      ? 'calming'
      : turn.emotionDetected === 'happy'
      ? 'celebratory'
      : 'warm';

    // Speak the response
    await aiCompanion.speak(turn.agentResponse, mood as any);

    // Check if we should suggest ending
    if (this.manager.shouldEndConversation(this.manager.getTurns())) {
      await aiCompanion.speak(
        `${this.patientName}, we have been chatting for a while. Maybe it is a good time for a little rest? We can talk again anytime.`,
        'gentle',
      );
    }

    return turn;
  }

  /**
   * Get conversation summary for the care team.
   */
  getSummary(): ConversationSummary {
    return this.manager.getConversationSummary();
  }

  /**
   * Get the full message history.
   */
  getHistory(): { role: 'user' | 'agent'; content: string; timestamp: string }[] {
    return this.manager.getHistory();
  }

  /**
   * End the conversation gracefully.
   */
  async endConversation(): Promise<string> {
    this.isActive = false;
    const farewell = `It was lovely talking with you, ${this.patientName}. I am always here whenever you want to chat again.`;
    await aiCompanion.speak(farewell, 'warm');
    return farewell;
  }

  isConversationActive(): boolean {
    return this.isActive;
  }
}

export const conversationBridge = ConversationBridge.getInstance();
export { ConversationBridge };
