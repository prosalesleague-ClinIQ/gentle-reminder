# Provisional Patent Application: Cognitive State to Response Policy Mapping

**Docket No.:** GR-19-PROV | **Tier:** 3

## 1. TITLE
Cognitive-State-to-Response-Policy Mapping System for Adaptive Therapeutic Interactions

## 4. FIELD
Adaptive response systems for therapeutic voice companions.

## 6. SUMMARY
Systematic mapping of 7 cognitive states to curated response policies, each comprising tone, strategy, 7+ guidelines, and personalized fallback template.

## 8. DETAILED DESCRIPTION

### 8.1 Policy Schema
```
ResponsePolicy {
  state: CognitiveState         // calm | confused | anxious | sad | agitated | disoriented | engaged
  tone: Tone                    // warm | gentle | reassuring | calm | empathetic | cheerful
  strategy: Strategy            // normal_conversation | identity_reinforcement | anxiety_reduction |
                                //   grounding | de_escalation | emotional_support | engagement
  guidelines: string[]          // 7+ per policy
  fallbackTemplate: string      // personalized message with {name} placeholders
}
```

### 8.2 Example: CONFUSED State Policy
- Tone: warm
- Strategy: identity_reinforcement
- Guidelines:
  1. Use patient's name frequently
  2. Include current time and date naturally
  3. Keep sentences short (max 12 words)
  4. Avoid testing memory recall
  5. Offer grounding anchors (today's weather, current season)
  6. Never correct patient errors
  7. Redirect gently if confusion persists
- Fallback: "Hi {name}, it's nice to see you on this {dayOfWeek} {timeOfDay}."

### 8.3 Reference Implementation
`packages/cognitive-state/src/adaptation/ResponsePolicyManager.ts`

## 9. CLAIMS

**Claim 1:** A method for generating adaptive therapeutic responses, comprising:
(a) detecting a cognitive state of a patient from one of seven states: calm, confused, anxious, sad, agitated, disoriented, engaged;
(b) selecting a response policy from a mapping of each state to a policy comprising: a tone classifier, a strategy classifier, at least seven interaction guidelines, and a fallback message template;
(c) producing an output response consistent with the selected policy;
(d) when no conversational content is available, interpolating patient-specific values into the fallback template.

**Claims 2-5:** Dependent, system, CRM.

## 10. ABSTRACT

An adaptive response system for dementia care maps seven cognitive states (calm, confused, anxious, sad, agitated, disoriented, engaged) to curated response policies. Each policy specifies a tone (warm, gentle, reassuring, calm, empathetic, cheerful), a strategy (normal conversation, identity reinforcement, anxiety reduction, grounding, de-escalation, emotional support, engagement), at least seven interaction guidelines, and a personalized fallback template. Output responses are consistent with the selected policy.

Codebase: `packages/cognitive-state/src/adaptation/ResponsePolicyManager.ts`
