# Provisional Patent Application: Multimodal Cognitive State Classifier with Weight Redistribution

**Docket No.:** GR-04-PROV
**Filing Priority Tier:** 1
**Applicant:** [Gentle Reminder, Inc.]
**Inventors:** [TBD]

## 1. TITLE
Multimodal Cognitive State Classification System with Automatic Weight Redistribution and Dual-Factor Confidence Scoring

## 2. CROSS-REFERENCE
Not applicable.

## 3. FEDERALLY SPONSORED RESEARCH
Not applicable.

## 4. FIELD
Multimodal signal fusion for real-time classification of cognitive and emotional states in patients with neurodegenerative disease.

## 5. BACKGROUND

### 5.1 Problem
Prior multimodal classifiers fuse signals from multiple sensors (speech, behavior, biometric) with fixed weights. When a sensor fails or data is missing, these systems either (a) silently produce degraded results with unchanged weights, or (b) return errors requiring all sources. Neither handles the real-world scenario in dementia care where patients may not always speak, wear wearables, or be observed.

Additionally, prior classifiers produce a single confidence score, which fails to distinguish between "high absolute score but close to second-best" (low actual confidence) and "moderate absolute score but clearly highest" (high actual confidence).

### 5.2 Prior Art
- US 8,219,438 (Affectiva) — Multimodal emotion classification
- US 10,152,988 (Beyond Verbal) — Voice-based emotion detection
- US 9,204,836 — Combined audio/facial emotion
- Microsoft Cognitive Services Emotion API
- IBM Watson Tone Analyzer

### 5.3 Limitations of Prior Art
None of the identified prior art combines (a) automatic weight redistribution when signal sources are missing, (b) dual-factor confidence scoring using both absolute score and separation from second-best class, and (c) trigger source identification.

## 6. BRIEF SUMMARY

The invention is a multimodal cognitive state classifier that classifies patient state into one of seven categories (calm, confused, anxious, sad, agitated, disoriented, engaged) from three signal sources (speech, behavior, biometric). Novel features include: (1) automatic weight redistribution when signals are unavailable; (2) dual-factor confidence computation combining absolute score and separation from second-best class; and (3) trigger source identification showing which signal dominated the classification.

## 7. BRIEF DESCRIPTION OF DRAWINGS
- **FIG. 1** — Three-source fusion architecture
- **FIG. 2** — Weight redistribution decision tree
- **FIG. 3** — Dual-factor confidence computation
- **FIG. 4** — Trigger source determination flow

## 8. DETAILED DESCRIPTION

### 8.1 Architecture
Three signal processors (speech, behavior, biometric), each producing a vector of 7 state scores. A fusion module combines them with weights. Missing sources trigger weight redistribution. An output module produces (state, confidence, trigger_source).

### 8.2 Default Weights
```
DEFAULT_WEIGHTS = {
  speech: 0.45,      // speech weighted most heavily
  behavior: 0.30,
  biometric: 0.25,
}
```

### 8.3 Weight Redistribution
```
function redistributeWeights(availableSources):
  totalDefaultWeight = sum(DEFAULT_WEIGHTS[s] for s in availableSources)
  return { s: DEFAULT_WEIGHTS[s] / totalDefaultWeight for s in availableSources }
```

### 8.4 Dual-Factor Confidence
```
function computeConfidence(stateScores):
  sorted = sort(stateScores, descending)
  absoluteConfidence = sorted[0]
  separationConfidence = sorted[0] - sorted[1]
  return absoluteConfidence * 0.6 + separationConfidence * 0.4
```

### 8.5 Trigger Source
For the winning state S, compute per-source weighted contributions and identify the source with the largest contribution to S. This enables downstream modules to reason about why the classification occurred (e.g., "agitation detected due to biometric signals").

### 8.6 Seven Cognitive States
CALM, CONFUSED, ANXIOUS, SAD, AGITATED, DISORIENTED, ENGAGED

### 8.7 Reference Implementation
`packages/cognitive-state/src/CognitiveStateEngine.ts`

## 9. CLAIMS

**Claim 1:** A method for classifying a cognitive state of a patient, comprising:
(a) receiving signal data from a plurality of source types including speech, behavior, and biometric;
(b) producing, for each available source type, a vector of state scores corresponding to a plurality of candidate cognitive states;
(c) determining which source types have available data and which are missing;
(d) computing redistributed weights by normalizing default weights over only the available source types;
(e) computing a fused state-score vector by combining per-source vectors using the redistributed weights;
(f) selecting the cognitive state with the highest fused score as the classified state;
(g) computing a confidence value combining (i) the absolute value of the highest fused score and (ii) the separation between the highest and second-highest fused scores; and
(h) identifying a trigger source as the source type contributing most to the classified state.

**Claim 2:** The method of Claim 1, wherein the default weights are: 0.45 for speech, 0.30 for behavior, 0.25 for biometric.

**Claim 3:** The method of Claim 1, wherein the confidence value is computed as: 0.6 × absoluteConfidence + 0.4 × separationConfidence.

**Claim 4:** The method of Claim 1, wherein the plurality of candidate cognitive states comprises: calm, confused, anxious, sad, agitated, disoriented, and engaged.

**Claim 5:** The method of Claim 1, wherein the patient has been diagnosed with a neurodegenerative condition.

**Claim 6:** A system comprising processors and memory configured to perform the method of Claim 1.

**Claim 7:** A non-transitory computer-readable medium storing instructions to perform the method of Claim 1.

**Claim 8:** The method of Claim 1, further comprising triggering a downstream intervention based on the classified state and the trigger source.

## 10. ABSTRACT

A multimodal cognitive state classification system for dementia patients fuses signals from speech, behavior, and biometric sources with default weights of 0.45, 0.30, and 0.25 respectively. When any source is unavailable, weights are automatically redistributed among remaining sources. Classification selects from seven states (calm, confused, anxious, sad, agitated, disoriented, engaged). Confidence is computed using a dual-factor formula combining absolute score (0.6 weight) and separation from second-best class (0.4 weight), producing a more informative confidence than prior single-factor approaches. A trigger source identifier indicates which signal source contributed most to the classification, enabling explainable downstream interventions.

## REFERENCES
- US 8,219,438 (Affectiva)
- US 10,152,988 (Beyond Verbal)
- US 9,204,836

Codebase: `packages/cognitive-state/src/CognitiveStateEngine.ts`

## APPLICANT NOTES
**Commercial value:** Enables adaptive patient interaction across all platform surfaces.
**Valuation:** $2M-$5M
**Conversion priority:** HIGH
