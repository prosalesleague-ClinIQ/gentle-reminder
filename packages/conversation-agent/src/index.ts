/**
 * @gentle-reminder/conversation-agent
 *
 * Conversational AI companion for dementia care.
 * Provides warm, safe, context-aware conversations
 * adapted to each person's cognitive state and family context.
 */

// Types
export {
  Intent,
  type ConversationMessage,
  type ConversationContext,
  type ConversationTurn,
  type ConversationSummary,
  type AgentConfig,
  type FamilyMember,
  type FamilyRelationship,
  type CognitiveState,
  type EmotionDetected,
  type TimeOfDay,
} from './types';

// Prompt construction
export {
  buildSystemPrompt,
  buildConversationPrompt,
  buildOrientationPrompt,
  buildReminiscencePrompt,
  buildReassurancePrompt,
} from './PromptBuilder';

// Intent classification
export {
  classifyIntent,
  getConfidence,
  detectRepeatedQuestion,
} from './IntentClassifier';

// Safety filtering
export {
  filterResponse,
  isResponseSafe,
  addReassurance,
  BANNED_PHRASES,
} from './SafetyFilter';

// Response templates (demo mode)
export { selectTemplate } from './ResponseTemplates';

// Conversation orchestration
export { ConversationManager } from './ConversationManager';
