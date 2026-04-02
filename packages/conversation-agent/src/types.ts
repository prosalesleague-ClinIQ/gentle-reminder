/**
 * Core types for the Gentle Reminder conversation agent.
 *
 * The conversation agent provides a warm, caring AI companion
 * for people living with dementia, adapting its tone and content
 * based on cognitive state, family context, and detected emotions.
 */

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/** Classified intent of a user message */
export enum Intent {
  /** Simple hello / goodbye */
  GREETING = 'GREETING',
  /** Questions about date, time, or location */
  ORIENTATION = 'ORIENTATION',
  /** Questions about family members */
  FAMILY_QUESTION = 'FAMILY_QUESTION',
  /** Requests for a story or reminiscence */
  STORY_REQUEST = 'STORY_REQUEST',
  /** Signs of confusion or disorientation */
  CONFUSION = 'CONFUSION',
  /** Explicit requests for help or expressions of fear */
  HELP_REQUEST = 'HELP_REQUEST',
  /** Anything that does not match a specific intent */
  GENERAL = 'GENERAL',
}

/** Detected emotional tone of the user */
export type EmotionDetected =
  | 'happy'
  | 'calm'
  | 'confused'
  | 'anxious'
  | 'sad'
  | 'frustrated'
  | 'neutral';

/** Cognitive state reported by the clinical system */
export type CognitiveState = 'calm' | 'mildly_confused' | 'confused' | 'anxious' | 'agitated';

/** Time-of-day bucket used for greeting selection */
export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

/** Relationship labels used in family context */
export type FamilyRelationship =
  | 'spouse'
  | 'child'
  | 'grandchild'
  | 'sibling'
  | 'friend'
  | 'caregiver'
  | 'other';

// ---------------------------------------------------------------------------
// Data structures
// ---------------------------------------------------------------------------

/** A single message in the conversation */
export interface ConversationMessage {
  /** Who produced this message */
  role: 'user' | 'agent' | 'system';
  /** Text content of the message */
  content: string;
  /** When the message was created (ISO-8601) */
  timestamp: string;
  /** Optional metadata attached by the pipeline */
  metadata?: Record<string, unknown>;
}

/** A family member known to the patient */
export interface FamilyMember {
  /** Display name, e.g. "Sarah" */
  name: string;
  /** Relationship to the patient */
  relationship: FamilyRelationship;
  /** Optional short description the agent can reference */
  description?: string;
  /** Optional URI to a photo */
  photoUri?: string;
}

/** Contextual information supplied to every agent turn */
export interface ConversationContext {
  /** Patient's preferred first name */
  patientName: string;
  /** Current cognitive state from the clinical system */
  cognitiveState: CognitiveState;
  /** Known family members */
  familyMembers: FamilyMember[];
  /** Topics discussed in the recent past (to avoid repetition) */
  recentTopics: string[];
  /** Current detected mood of the patient */
  currentMood: EmotionDetected;
  /** Optional current location label */
  location?: string;
  /** Optional current date string */
  currentDate?: string;
}

/** Configuration for the underlying LLM (or demo mode) */
export interface AgentConfig {
  /** LLM model identifier, e.g. "claude-3-haiku" */
  model: string;
  /** Sampling temperature */
  temperature: number;
  /** Maximum tokens in the response */
  maxTokens: number;
  /** Template string for the system prompt */
  systemPromptTemplate: string;
  /** Safety guidelines injected into every prompt */
  safetyGuidelines: string[];
  /** When true, use pre-written templates instead of an LLM */
  demoMode?: boolean;
}

/** Result of a single conversation turn */
export interface ConversationTurn {
  /** The message the user sent */
  userMessage: string;
  /** The agent's response text */
  agentResponse: string;
  /** Classified intent of the user message */
  intent: Intent;
  /** Detected emotion in the user message */
  emotionDetected: EmotionDetected;
  /** Time taken to produce the response, in milliseconds */
  responseTimeMs: number;
}

/** Summary of a conversation session */
export interface ConversationSummary {
  /** Number of turns in the session */
  totalTurns: number;
  /** Topics that were discussed */
  topicsDiscussed: string[];
  /** Overall mood trajectory */
  moodTrajectory: EmotionDetected[];
  /** Duration of the session in seconds */
  durationSeconds: number;
  /** Whether the session ended due to fatigue detection */
  endedByFatigue: boolean;
}
