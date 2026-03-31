import {
  CognitiveState,
  AdaptiveResponse,
  ResponseTone,
  InteractionStrategy,
} from '../types';

/**
 * Maps cognitive states to adaptive AI response policies.
 *
 * Each state has a curated tone, strategy, set of guidelines,
 * and a pre-written fallback message for when AI generation fails.
 * The fallback messages use the patient's name for personalization.
 */

interface ResponsePolicy {
  tone: ResponseTone;
  strategy: InteractionStrategy;
  guidelines: string[];
  fallbackTemplate: string;
}

const RESPONSE_POLICIES: Record<CognitiveState, ResponsePolicy> = {
  [CognitiveState.CALM]: {
    tone: 'warm',
    strategy: 'normal_conversation',
    guidelines: [
      'Use a natural, conversational tone.',
      'Encourage storytelling and reminiscence.',
      'Ask open-ended questions about pleasant topics.',
      'Maintain a comfortable pace without rushing.',
      'Celebrate small achievements and positive moments.',
    ],
    fallbackTemplate:
      "It's lovely talking with you, {name}. What would you like to chat about?",
  },

  [CognitiveState.CONFUSED]: {
    tone: 'gentle',
    strategy: 'identity_reinforcement',
    guidelines: [
      'Gently remind the patient of who they are and where they are.',
      'Use their name frequently for orientation.',
      'Provide clear time-of-day cues (morning, afternoon, evening).',
      'Keep sentences short and simple.',
      'Avoid asking questions that require memory recall.',
      'Offer identity anchors: family photos, familiar objects.',
      'Do not correct or argue; redirect gently.',
    ],
    fallbackTemplate:
      "Hello {name}, you're here at home and everything is fine. It's a lovely day. Would you like me to tell you about something nice?",
  },

  [CognitiveState.ANXIOUS]: {
    tone: 'reassuring',
    strategy: 'anxiety_reduction',
    guidelines: [
      'Speak slowly and calmly.',
      'Offer reassurance that they are safe.',
      'Guide through simple breathing exercises if appropriate.',
      'Avoid introducing new or complex information.',
      'Acknowledge their feelings without dismissing them.',
      'Use grounding techniques: name 5 things you can see.',
      'Maintain physical or verbal presence consistently.',
    ],
    fallbackTemplate:
      "You're safe, {name}. I'm right here with you. Let's take a nice slow breath together. Everything is okay.",
  },

  [CognitiveState.DISORIENTED]: {
    tone: 'calm',
    strategy: 'grounding',
    guidelines: [
      'Provide clear orientation cues: date, time, location.',
      'Use familiar landmarks and references.',
      'Keep the environment description simple and comforting.',
      'Avoid saying "don\'t you remember?" or similar phrases.',
      'Offer wayfinding help if they seem lost.',
      'Mention familiar people and routines.',
      'Use sensory grounding: describe what is around them.',
    ],
    fallbackTemplate:
      "{name}, you're at home. It's {timeOfDay} and you're in your favorite room. Everything is just as it should be.",
  },

  [CognitiveState.AGITATED]: {
    tone: 'calm',
    strategy: 'de_escalation',
    guidelines: [
      'Use a low, steady voice tone.',
      'Do not argue, contradict, or restrain.',
      'Offer simple choices to restore sense of control.',
      'Redirect attention to a calming activity.',
      'Remove potential sources of overstimulation.',
      'Validate their feelings before redirecting.',
      'Suggest gentle physical movement: walking, stretching.',
      'If escalation continues, alert caregiver immediately.',
    ],
    fallbackTemplate:
      "{name}, I can see you're feeling upset. That's okay. Would you like to go for a short walk, or shall we listen to some music together?",
  },

  [CognitiveState.SAD]: {
    tone: 'empathetic',
    strategy: 'emotional_support',
    guidelines: [
      'Acknowledge their sadness without trying to fix it immediately.',
      'Use empathetic listening and gentle prompts.',
      'Suggest looking at happy memories: photos, stories.',
      'Offer comfort through familiar routines.',
      'Avoid overly cheerful responses that dismiss their feelings.',
      'Gently introduce positive topics when they seem ready.',
      'Monitor for prolonged sadness and alert caregiver if needed.',
    ],
    fallbackTemplate:
      "I'm here with you, {name}. It's okay to feel this way. Would you like to look at some photos of happy times, or shall we just sit together for a while?",
  },

  [CognitiveState.ENGAGED]: {
    tone: 'cheerful',
    strategy: 'engagement',
    guidelines: [
      'Match their energy and enthusiasm.',
      'Encourage continued participation in the activity.',
      'Ask follow-up questions to deepen engagement.',
      'Introduce gentle cognitive exercises if appropriate.',
      'Praise their participation and contributions.',
      'Use this positive window for meaningful interaction.',
      'Document engagement patterns for care team.',
    ],
    fallbackTemplate:
      "This is wonderful, {name}! I love hearing about this. Tell me more!",
  },
};

export class ResponsePolicyManager {
  /**
   * Get the adaptive response policy for the patient's current cognitive state.
   */
  getAdaptiveResponse(
    state: CognitiveState,
    patientName: string
  ): AdaptiveResponse {
    const policy = RESPONSE_POLICIES[state];

    const fallbackMessage = this.interpolateFallback(
      policy.fallbackTemplate,
      patientName
    );

    return {
      tone: policy.tone,
      strategy: policy.strategy,
      guidelines: [...policy.guidelines],
      fallbackMessage,
    };
  }

  /**
   * Get responses for multiple states, ordered by priority.
   * Useful when classification confidence is low and multiple
   * states are plausible.
   */
  getMultiStateResponse(
    states: { state: CognitiveState; confidence: number }[],
    patientName: string
  ): AdaptiveResponse[] {
    return states
      .sort((a, b) => b.confidence - a.confidence)
      .map(({ state }) => this.getAdaptiveResponse(state, patientName));
  }

  /**
   * Get just the guidelines for a state, useful for injecting
   * into AI prompt context.
   */
  getGuidelines(state: CognitiveState): string[] {
    return [...RESPONSE_POLICIES[state].guidelines];
  }

  private interpolateFallback(template: string, name: string): string {
    const now = new Date();
    const hour = now.getHours();
    let timeOfDay: string;
    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 17) timeOfDay = 'afternoon';
    else timeOfDay = 'evening';

    return template
      .replace(/{name}/g, name)
      .replace(/{timeOfDay}/g, timeOfDay);
  }
}
