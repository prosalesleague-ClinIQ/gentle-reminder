# Provisional Patent Application: Asymmetric Adaptive Difficulty Engine for Cognitive Assessment of Neurodegenerative Patients

**Docket No.:** GR-02-PROV
**Filing Priority Tier:** 1
**Applicant:** [Gentle Reminder, Inc.]
**Inventors:** [TBD]

## 1. TITLE
Asymmetric Comfort-Zone Adaptive Difficulty Method for Cognitive Assessment in Dementia Populations

## 2. CROSS-REFERENCE
Not applicable.

## 3. FEDERALLY SPONSORED RESEARCH
Not applicable.

## 4. FIELD OF THE INVENTION
Computer-implemented adaptive difficulty algorithms for cognitive exercises targeted at patients with dementia and related neurodegenerative conditions.

## 5. BACKGROUND

### 5.1 Problem
Standard adaptive testing algorithms (IRT-based CAT, standard step-up/step-down) treat difficulty adjustments symmetrically — the same number of successes to advance as failures to retreat. This symmetric behavior causes cognitive frustration in dementia patients because their stress threshold for repeated failure is significantly lower than their capacity to consistently succeed. Frustration triggers session abandonment, increased agitation, and subsequent decline.

### 5.2 Prior Art
- US 9,610,051 (Akili Interactive) — Adaptive difficulty for cognitive training, symmetric
- US 9,536,427 (Lumosity) — Adaptive cognitive difficulty, symmetric thresholds
- Standard Item Response Theory (IRT) — widely published, symmetric by design
- Adaptive CAT testing (ETS, College Board) — symmetric convergence algorithms

### 5.3 Limitations of Prior Art
All identified prior art uses symmetric adjustment: typically 2-3 successes to advance and 2-3 failures to retreat. No prior art describes an asymmetric system where the failure threshold is tighter than the success threshold, and no prior art targets a "comfort zone" success rate of 70-85% specifically for neurodegenerative populations.

## 6. BRIEF SUMMARY

The invention is an asymmetric adaptive difficulty engine that drops difficulty after only 2 consecutive incorrect responses but requires 4 consecutive correct responses plus an 85% average score to advance. The target success zone is 70-85%, higher than conventional adaptive testing. The engine maintains 5 discrete difficulty levels with parameterized support (option count, hint availability, time limit, prompt complexity). The asymmetric structure prevents the frustration cascade observed in dementia patients subjected to symmetric adaptive algorithms.

## 7. BRIEF DESCRIPTION OF DRAWINGS

- **FIG. 1** — Difficulty state machine with 5 levels and transition conditions
- **FIG. 2** — Success/failure tracking data structure
- **FIG. 3** — Flowchart of `calculateDifficulty()` method
- **FIG. 4** — Comparison of symmetric vs asymmetric adjustment curves over time

## 8. DETAILED DESCRIPTION

### 8.1 System Architecture
- Exercise engine presenting cognitive tasks
- Response capture module
- Rolling history buffer (most recent N attempts)
- Difficulty calculator implementing asymmetric thresholds
- Parameter resolver mapping difficulty level to exercise configuration

### 8.2 Core Method (`calculateDifficulty`)

```
function calculateDifficulty(history, currentLevel):
  recent = history.last(5)
  consecutiveFailures = countTrailingFailures(recent)
  consecutiveSuccesses = countTrailingSuccesses(recent)
  averageScore = mean(recent.map(r => r.score))

  // Asymmetric DROP: 2 failures is enough
  if consecutiveFailures >= 2:
    return max(currentLevel - 1, 1)

  // Asymmetric ADVANCE: 4 successes AND 0.85+ average
  if consecutiveSuccesses >= 4 and averageScore >= 0.85:
    return min(currentLevel + 1, 5)

  // No change
  return currentLevel
```

### 8.3 Difficulty Level Parameters

| Level | Option Count | Hints | Time Limit (s) | Prompt Complexity |
|-------|:------------:|:-----:|:--------------:|:-----------------:|
| 1 | 2 | Available | Unlimited | Simple |
| 2 | 2 | Available | 90 | Simple |
| 3 | 3 | Available | 60 | Medium |
| 4 | 3 | None | 45 | Medium |
| 5 | 3 | None | 30 | Complex |

### 8.4 Specific Parameters (Enabling Disclosure)

| Parameter | Value |
|-----------|-------|
| Target success zone lower bound | 70% |
| Target success zone upper bound | 85% |
| Consecutive failures to drop | 2 |
| Consecutive successes to advance | 4 |
| Average score required to advance | ≥0.85 |
| Rolling history window | 5 attempts |
| Total difficulty levels | 5 |

### 8.5 Alternative Embodiments
- **Embodiment A:** 3-level simplified variant for severe dementia
- **Embodiment B:** 7-level extended variant for MCI populations
- **Embodiment C:** Domain-specific difficulty (separate level per cognitive domain)

### 8.6 Reference Implementation
`packages/cognitive-engine/src/scoring/adaptive-difficulty.ts`
Functions: `calculateDifficulty()`, `getDifficultyParams()`

## 9. CLAIMS

**Claim 1:** A method for adapting difficulty of cognitive exercises presented to a patient, comprising:
(a) presenting a cognitive exercise at a current difficulty level;
(b) capturing a response and determining correctness;
(c) maintaining a history buffer of recent responses;
(d) computing a count of consecutive incorrect responses from a trailing portion of the history buffer;
(e) computing a count of consecutive correct responses from the trailing portion;
(f) computing a mean score over the history buffer;
(g) decreasing the difficulty level by one increment when the count of consecutive incorrect responses is at least 2;
(h) increasing the difficulty level by one increment only when the count of consecutive correct responses is at least 4 AND the mean score is at least 0.85;
(i) otherwise maintaining the current difficulty level;
wherein step (g) requires fewer consecutive events than step (h), producing asymmetric adaptation.

**Claim 2:** The method of Claim 1, wherein the target success rate of the patient is maintained between 70% and 85% over the course of a session.

**Claim 3:** The method of Claim 1, wherein the difficulty level is selected from a discrete set of 5 levels, each level being associated with: a number of answer options, a hint availability flag, a time limit, and a prompt complexity classification.

**Claim 4:** The method of Claim 1, wherein the history buffer comprises the most recent 5 responses.

**Claim 5:** The method of Claim 1, wherein the patient has been diagnosed with a neurodegenerative condition including at least one of: Alzheimer's disease, vascular dementia, Lewy body dementia, frontotemporal dementia, mild cognitive impairment, or mixed dementia.

**Claim 6:** A non-transitory computer-readable medium storing instructions that cause one or more processors to perform the method of Claim 1.

**Claim 7:** A system comprising one or more processors and a memory storing instructions to perform the method of Claim 1.

**Claim 8:** The method of Claim 1, further comprising never increasing difficulty by more than one level per adaptation cycle.

## 10. ABSTRACT

A method for adaptive difficulty adjustment in cognitive exercises for dementia patients applies asymmetric thresholds: a difficulty decrease is triggered by only 2 consecutive incorrect responses, while a difficulty increase requires 4 consecutive correct responses plus an average score of at least 0.85. The target success zone is maintained at 70-85%, higher than typical adaptive testing. The method operates over a rolling history window of 5 responses and selects from 5 discrete difficulty levels, each parameterizing option count, hint availability, time limit, and prompt complexity. The asymmetric structure prevents cognitive frustration cascades observed in dementia populations subjected to symmetric adaptive algorithms used in standard computerized adaptive testing (CAT) and prior cognitive training platforms.

## REFERENCES
- US 9,610,051 (Akili Interactive)
- US 9,536,427 (Lumos Labs)
- Lord, F.M. (1980). Applications of Item Response Theory to Practical Testing Problems.
- Clare, L. & Woods, R.T. (2004). Cognitive training and cognitive rehabilitation for people with early-stage Alzheimer's disease.

Codebase: `packages/cognitive-engine/src/scoring/adaptive-difficulty.ts`

## APPLICANT NOTES
**Commercial value:** Core platform algorithm. Blocks competitors from dementia-tuned adaptive testing.
**Valuation:** $2M-$5M
**Conversion priority:** HIGH
