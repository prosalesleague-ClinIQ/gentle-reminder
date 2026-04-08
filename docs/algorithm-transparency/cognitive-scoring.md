# Algorithm Transparency: Cognitive Scoring

**Document ID:** AT-001
**Version:** 1.0
**Effective Date:** 2026-04-06
**Author:** Clinical Engineering

---

## 1. Purpose

This document provides a transparent description of how the Gentle Reminder platform calculates cognitive scores, adapts exercise difficulty, and detects cognitive decline. This information is intended for clinicians, regulators, patients, and caregivers.

## 2. Cognitive Domains

The system assesses six cognitive domains, aligned with established neuropsychological assessment constructs:

| Domain | Description | Exercise Types |
|--------|-------------|----------------|
| **Orientation** | Awareness of time, place, and person | Date identification, location recognition, month/season identification |
| **Memory** | Encoding, storage, and retrieval of information | Category recall, object identification, sequence recall, spaced repetition, identity recognition |
| **Attention** | Sustained focus and concentration | Letter cancellation, digit span, trail making, counting, word detection, symbol search |
| **Language** | Verbal comprehension and expression | Sentence completion, word association, word finding, verbal fluency, sentence building, word definition |
| **Visuospatial** | Spatial perception and visual processing | Direction identification, maze description, spatial relations, clock position, map reading, shape matching |
| **Executive Function** | Planning, problem-solving, and cognitive flexibility | Categorization, problem solving, sequencing, planning, inhibition, flexibility |

## 3. Score Calculation

### 3.1 Individual Exercise Scoring

Each exercise response is evaluated by a deterministic scoring function that produces a score from **0.0 to 1.0**:

- **1.0** = Fully correct response
- **0.5 - 0.9** = Partially correct or close response (varies by exercise type)
- **0.0** = Incorrect response

Scoring functions are pure (no side effects, no randomness). The same input always produces the same output.

### 3.2 Domain Score Calculation

Each domain score is the arithmetic mean of all exercise scores within that domain for a given session:

```
domainScore = sum(exerciseScores) / count(exerciseScores)
```

Domain scores range from 0.0 to 1.0. A domain is only scored if at least one exercise was completed in that domain during the session.

### 3.3 Overall Composite Score

The overall composite score is the equally-weighted arithmetic mean of all **active** domain scores:

```
overallScore = sum(activeDomainScores) / count(activeDomainScores)
```

An "active" domain is one where the patient completed at least one exercise. This prevents unassessed domains from artificially lowering the composite score.

### 3.4 Display Scale

For display to patients and caregivers, the 0.0-1.0 internal score is scaled to **0-100**:

```
displayScore = round(overallScore * 100)
```

### 3.5 Feedback Classification

Every exercise response receives one of three feedback types (the system never provides negative feedback):

| Feedback Type | Condition | Patient Experience |
|---------------|-----------|-------------------|
| **Celebrated** | Correct answer | Positive reinforcement |
| **Guided** | Close or partially correct | Gentle correction with encouragement |
| **Supported** | Incorrect answer | Answer provided warmly with context |

## 4. Adaptive Difficulty

### 4.1 Difficulty Levels

The system uses five difficulty levels:

| Level | Label | Description |
|-------|-------|-------------|
| 1 | Gentle | Simple, familiar prompts with maximum support |
| 2 | Easy | Straightforward questions with helpful hints |
| 3 | Standard | Regular difficulty with some challenge |
| 4 | Engaging | More variety and fewer hints |
| 5 | Challenging | Maximum variety for high-performing patients |

### 4.2 Adaptation Algorithm

Difficulty adjusts based on a rolling window of recent performance:

- **Target success rate:** 70-85% (the "comfort zone")
- **Increase difficulty** (by 1 level) when: average score > 0.85 AND consecutive correct >= 3
- **Decrease difficulty** (by 1 level) when: average score < 0.50 OR consecutive incorrect >= 2
- **Maintain difficulty** when: performance is within the comfort zone

Design principle: Difficulty decreases immediately on struggle (prevent frustration) but increases only after consistent demonstrated success.

### 4.3 Per-Exercise Difficulty Parameters

Each exercise type has difficulty-specific parameters (e.g., number of items to recall, complexity of patterns, time limits). These parameters are configured per difficulty level and are fully deterministic.

## 5. Cognitive Decline Detection

### 5.1 Trend Analysis

The system monitors longitudinal score trends using a rolling window analysis:

1. Compute the mean score over recent sessions (configurable window, default 10 sessions)
2. Compare to the mean score over the preceding equivalent window
3. Flag a decline if the difference exceeds a configurable threshold

### 5.2 Decline Classification

| Change | Classification | Action |
|--------|---------------|--------|
| Score increase or stable (within +/- 5%) | No concern | Continue monitoring |
| Mild decline (5-15% decrease) | Watch | Flag for clinician review at next visit |
| Moderate decline (15-30% decrease) | Concern | Generate caregiver alert, recommend clinical assessment |
| Significant decline (> 30% decrease) | Urgent | Immediate caregiver alert, recommend urgent clinical assessment |

### 5.3 Fatigue Detection

The system detects potential fatigue during sessions by monitoring:
- Increasing response times across consecutive exercises
- Declining accuracy within a single session
- When fatigue is detected, the system offers to end the session early to prevent unreliable scores

## 6. Algorithm Versioning

### 6.1 Version Tracking

Every algorithm component is versioned:

- Scoring functions: version embedded in source code
- Difficulty parameters: version in configuration
- Decline detection thresholds: version in configuration

### 6.2 Traceability

Each stored exercise result includes:
- Algorithm version used for scoring
- Difficulty level at time of exercise
- Timestamp and session context

This ensures full traceability for any score in the system back to the exact algorithm version that produced it.

## 7. Limitations and Disclaimers

1. **Not a diagnostic tool:** Gentle Reminder scores are supplementary clinical information and do not constitute a diagnosis of any condition.
2. **Population specificity:** The scoring algorithm is designed for and validated with adults aged 65+ with mild-to-moderate dementia. Performance outside this population has not been validated.
3. **Cultural and linguistic factors:** Exercise content may have cultural or linguistic biases that affect scoring in certain populations.
4. **Environmental factors:** Patient performance can be affected by fatigue, medication effects, time of day, mood, and environmental distractions.
5. **Device interaction:** Touchscreen interaction ability varies among patients and can affect scores independently of cognitive function.

## 8. Implementation Reference

| Component | Source Location |
|-----------|----------------|
| Scoring engine | `packages/cognitive-engine/src/scoring/gentle-scorer.ts` |
| Adaptive difficulty | `packages/cognitive-engine/src/scoring/adaptive-difficulty.ts` |
| Decline detection | `packages/cognitive-engine/src/scoring/cognitive-metrics.ts` |
| Exercise generators | `packages/cognitive-engine/src/exercises/` |
| Transparency API | `packages/cognitive-engine/src/transparency.ts` |
