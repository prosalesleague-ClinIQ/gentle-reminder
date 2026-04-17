# Provisional Patent Application: Voice Companion System for Dementia Care

**Docket No.:** GR-14-PROV | **Tier:** 3

## 1. TITLE
Therapeutic Voice Companion System with Family Voice Cloning, Inactivity Prompts, and Mood-Modulated Prosody

## 4. FIELD
Voice-based therapeutic interaction systems for elderly patients with neurodegenerative conditions.

## 5. BACKGROUND
Voice cloning (ElevenLabs, Resemble AI) is commercially available but not integrated into therapeutic protocols for dementia care.

## 6. SUMMARY
A voice companion system implementing:
1. Family-member voice cloning with per-person unique pitch/rate fallback
2. Message introduction protocol: companion intro → 800ms pause → cloned voice
3. Natural pause injection at sentence boundaries for comprehension
4. Inactivity detection (30s+) triggering warm non-accusatory prompts
5. Mood-modulated speech rate and pitch based on detected cognitive state

## 8. DETAILED DESCRIPTION

### 8.1 Per-Family-Member Voice Parameters
```
familyVoiceDemoParams = {
  "Lisa":   { pitch: 1.20, rate: 0.82 },
  "Robert": { pitch: 0.85, rate: 0.68 },
  "Emma":   { pitch: 1.35, rate: 0.90 },
  "James":  { pitch: 0.95, rate: 0.75 },
}
```

### 8.2 Message Introduction Protocol
```
function readMessage(sender, message):
  speakAsCompanion(`You have a message from ${sender}`)
  pause(800ms)
  speakAsClonedVoice(sender, message)
```

### 8.3 Natural Pause Injection
```
function addNaturalPauses(text):
  return text.replace(/([.!?])\s+/g, "$1... ")
```

### 8.4 Mood Parameters
```
moodParams = {
  celebrate: { rateFactor: 1.05, pitchDelta: +0.08 },
  calm:      { rateFactor: 0.85, pitchDelta: -0.03 },
  warm:      { rateFactor: 0.95, pitchDelta: +0.02 },
  reassure:  { rateFactor: 0.90, pitchDelta:  0.00 },
}
```

### 8.5 Reference Implementation
`apps/mobile/src/services/VoiceCloneService.ts`, `AICompanion.ts`, `ConversationBridge.ts`

## 9. CLAIMS

**Claim 1:** A method for providing voice-based therapeutic interaction to a dementia patient, comprising:
(a) maintaining cloned voice profiles for one or more family members;
(b) upon delivering a message from a family member, speaking an introductory statement from a companion voice, pausing for 500-1500 milliseconds, and speaking the message content in the cloned family-member voice;
(c) inserting pauses at sentence boundaries of the message to aid comprehension;
(d) detecting patient inactivity exceeding a threshold (30-60 seconds) and issuing a warm, non-accusatory prompt; and
(e) modulating companion voice rate and pitch according to a detected mood state.

**Claim 2-5:** Dependent (specific params), system, CRM.

## 10. ABSTRACT

A therapeutic voice companion system for dementia patients implements family-member voice cloning with per-person speech parameters, a message introduction protocol (companion intro → 800 ms pause → cloned voice delivery), natural pause insertion at sentence boundaries, inactivity detection with warm prompts after 30+ seconds, and mood-modulated speech prosody where celebration, calming, warm, and reassuring modes each specify rate factor and pitch delta adjustments.

Codebase: `apps/mobile/src/services/VoiceCloneService.ts`
