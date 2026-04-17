# Provisional Patent Application: Three-State Positive-Only Feedback System for Cognitive Assessment of Neurodegenerative Patients

**Docket No.:** GR-01-PROV
**Filing Priority Tier:** 1 (HIGHEST)
**Applicant:** [Gentle Reminder, Inc. — to be confirmed]
**Inventors:** [TBD per INVENTOR-DISCLOSURE.md]
**Filing Date:** [TBD]

---

## 1. TITLE OF THE INVENTION

Three-State Positive-Only Feedback System and Method for Cognitive Assessment of Patients with Neurodegenerative Disease

## 2. CROSS-REFERENCE TO RELATED APPLICATIONS

Not applicable. This is the first filing in a planned 23-application portfolio.

## 3. STATEMENT REGARDING FEDERALLY SPONSORED RESEARCH

Not applicable.

## 4. FIELD OF THE INVENTION

This invention relates generally to digital cognitive assessment systems, and more particularly to computer-implemented methods for scoring, classifying, and delivering feedback during cognitive exercises for patients with dementia, Alzheimer's disease, mild cognitive impairment (MCI), and other neurodegenerative conditions.

## 5. BACKGROUND OF THE INVENTION

### 5.1 Problem in the Art

Existing cognitive assessment tools — including the Mini-Mental State Examination (MMSE), Montreal Cognitive Assessment (MoCA), and Alzheimer's Disease Assessment Scale (ADAS-Cog) — produce binary correct/incorrect feedback or numeric scores that inherently communicate failure to the patient. This feedback structure triggers documented anxiety, agitation, withdrawal, and session abandonment in dementia populations. Clinical literature (Clare 2003; Bahar-Fuchs et al. 2013) establishes that negative feedback impairs subsequent learning in dementia patients, creating a fundamental conflict between clinical assessment needs and patient psychological wellbeing.

### 5.2 Description of Prior Art

- **MMSE** (Folstein et al., 1975): Binary correct/incorrect scoring; no mechanism to soften delivery
- **MoCA** (Nasreddine et al., 2005): 30-point numeric score; final score communicated
- **ADAS-Cog** (Rosen et al., 1984): Error counts visible to patient
- **Cogstate** (US Patent 7,761,314): Computerized cognitive testing with timing and accuracy metrics; patient-visible scoring
- **Akili Interactive AKL-T01** (US Patent 9,610,051): Adaptive difficulty for ADHD with score-based feedback
- **Lumosity** (US Patent 9,536,427): Adaptive difficulty with visible score feedback

### 5.3 Limitations of Prior Art

All identified prior art systems either (a) display numeric scores, (b) communicate binary correct/incorrect states, or (c) attempt to soften negative feedback through visual presentation (e.g., color changes, encouraging text) without architectural separation of assessment data from patient-facing feedback. No prior art provides a scoring architecture that **guarantees** no negative feedback reaches the patient while **simultaneously** producing granular performance data for clinicians.

### 5.4 Unmet Need

A clinical cognitive assessment system is needed that:
1. Captures granular performance data sufficient for clinical decision-making
2. Architecturally prevents any negative feedback pathway from reaching the patient
3. Categorizes every possible patient response into one of three emotionally-safe feedback states
4. Maintains clinical utility of session data for caregivers, clinicians, and longitudinal tracking

## 6. BRIEF SUMMARY OF THE INVENTION

The present invention provides a cognitive assessment scoring system comprising three feedback states — CELEBRATED, GUIDED, and SUPPORTED — wherein every patient response is mapped to one of these three positive-framed states, and wherein the raw performance data (correct/incorrect, response time, error type) is retained in a separate data channel accessible only to clinicians and caregivers. The system comprises (a) a scoring module that computes per-domain and overall cognitive scores from exercise results; (b) a feedback-state classifier that maps each response to one of the three positive states; (c) a clinician data channel that preserves granular performance metrics; (d) a fatigue detector that identifies session fatigue without communicating fatigue status to the patient; and (e) a session completion message generator that produces encouraging messages regardless of performance level.

## 7. BRIEF DESCRIPTION OF THE DRAWINGS

- **FIG. 1** — Overall system architecture showing the separation of patient feedback channel from clinician data channel
- **FIG. 2** — Flowchart of the three-state feedback classifier
- **FIG. 3** — State diagram showing transitions between CELEBRATED, GUIDED, and SUPPORTED states
- **FIG. 4** — Example of session completion message generation based on composite completion metrics
- **FIG. 5** — Fatigue detection algorithm flowchart

## 8. DETAILED DESCRIPTION OF THE INVENTION

### 8.1 Definitions

- **Cognitive Exercise:** A discrete task presented to a patient that tests one or more cognitive domains (orientation, memory, attention, language, executive function, visuospatial, identity).
- **Exercise Result:** The outcome of a single exercise attempt, comprising prompt, patient response, expected response, response time, and correctness indicator.
- **Feedback State:** One of three positive-framed classifications assigned to each exercise result for delivery to the patient.
- **Cognitive Domain:** A category of mental function assessed by an exercise.
- **Session:** A collection of exercises completed in a single interaction with the patient.

### 8.2 System Architecture

The system (FIG. 1) comprises:
1. An **exercise engine** that presents cognitive exercises to the patient via a user interface
2. A **response capture module** that records patient responses with timestamps
3. A **dual-channel scoring module** comprising:
   - A **patient feedback channel** that produces only three-state positive feedback
   - A **clinician data channel** that preserves all raw performance metrics
4. A **feedback delivery module** that renders the three-state feedback through visual, auditory, and haptic modalities
5. A **data store** that persists raw metrics for clinician review

### 8.3 Three-State Feedback Classifier (Novel Method)

For each exercise result, the classifier applies the following rules in order:

```
function classifyFeedback(result):
  if result.isCorrect and result.responseTime <= NORMAL_RT_THRESHOLD:
    return CELEBRATED
  elif result.isCorrect and result.responseTime > NORMAL_RT_THRESHOLD:
    return CELEBRATED  // still positive — late correct is still correct
  elif result.closeToCorrect:  // partial match, typographic variant, etc.
    return GUIDED
  else:  // incorrect or no response
    return SUPPORTED
```

Crucially, the `SUPPORTED` state is architecturally indistinguishable from an emotional standpoint from `CELEBRATED` and `GUIDED` — all three produce warm, affirming messages. The only differentiation occurs in:
- The clinician data channel (raw correct/incorrect is preserved)
- The downstream difficulty adjustment algorithm (which uses the raw data, not the feedback state)

### 8.4 Specific Parameters (Enabling Disclosure)

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| CELEBRATED rate floor | 60% | Patient receives positive reinforcement on majority of attempts |
| CELEBRATED rate ceiling | 95% | If too high, difficulty adjusts upward (not seen by patient) |
| Fatigue signal threshold | Response time increases 40%+ over 5-attempt rolling window | Detects fatigue without communicating fatigue |
| Session completion messages | Curated library of 20+ variants per completion-rate tier | Avoids repetitive messaging |

### 8.5 Session Completion Message Generator

For a session with N exercises, compute completion rate R = successful_attempts / N. The message generator selects from predefined message tiers:

- **R ≥ 0.80:** High-celebration tier (e.g., "What a wonderful session!")
- **0.50 ≤ R < 0.80:** Mid-celebration tier (e.g., "Great work today!")
- **R < 0.50:** Supportive tier (e.g., "Thank you for spending time with me today.")

Note that **even the supportive tier contains no failure acknowledgment**. The message structure is: [appreciation] + [forward-looking positive statement] + [optional companion suggestion].

### 8.6 Fatigue Detector (Without Patient Notification)

The fatigue detector computes a rolling response-time slope over the most recent 5 exercise attempts. If the slope exceeds a threshold (40% increase over baseline), the detector signals fatigue to the session controller, which:
1. Shortens the remaining session by reducing the exercise queue
2. Prioritizes exercises in the patient's strongest cognitive domain
3. Triggers an earlier session completion

The patient is never notified of fatigue detection. The clinician data channel logs the fatigue event for longitudinal analysis.

### 8.7 Alternative Embodiments

- **Embodiment A:** Two-state system (CELEBRATED, SUPPORTED) merging the GUIDED state — simpler but less granular
- **Embodiment B:** Four-state system adding a WITNESSED state for interrupted attempts — more granular but higher complexity
- **Embodiment C:** Audio-only delivery for patients with severe visual impairment
- **Embodiment D:** Integration with voice companion systems where feedback is delivered via synthesized speech with mood-modulated prosody

### 8.8 Example Implementation

Reference implementation: `packages/cognitive-engine/src/scoring/gentle-scorer.ts`
Key functions:
- `calculateSessionScores(results: ExerciseResultInput[]): SessionScores`
- `getSessionCompletionMessage(completionRate: number): string`
- `detectFatigueSignals(results: ExerciseResultInput[]): FatigueSignal`

## 9. CLAIMS

### Independent Claims

**Claim 1:** A computer-implemented method for providing feedback to a patient during a cognitive assessment session, the method comprising:
(a) presenting, by one or more processors, a cognitive exercise to the patient via a user interface;
(b) receiving, by the one or more processors, a response from the patient;
(c) classifying, by the one or more processors, the response into exactly one of three feedback states selected from the group consisting of a CELEBRATED state, a GUIDED state, and a SUPPORTED state, wherein each of the three feedback states is associated with positively-framed feedback content;
(d) delivering, by the one or more processors, to the patient via the user interface, feedback content corresponding to the classified feedback state;
(e) concurrently storing, by the one or more processors, raw performance metrics comprising at least a correctness indicator and a response time in a clinician data channel that is not accessible to the patient; and
(f) repeating steps (a)-(e) for a plurality of cognitive exercises within the session.

**Claim 2:** A system for administering a cognitive assessment to a patient with a neurodegenerative condition, the system comprising:
- one or more processors;
- a memory storing instructions that, when executed by the one or more processors, cause the one or more processors to:
  (i) present a sequence of cognitive exercises;
  (ii) capture responses;
  (iii) classify each response into one of three positive feedback states;
  (iv) maintain a separate clinician data channel storing raw performance metrics;
  (v) detect session fatigue based on response time trends without notifying the patient of the detection; and
  (vi) generate a session completion message from a curated library, wherein all messages in the library are positively framed regardless of session performance.

**Claim 3:** A non-transitory computer-readable medium storing instructions that, when executed by one or more processors, cause the one or more processors to perform the method of Claim 1.

### Dependent Claims

**Claim 4:** The method of Claim 1, wherein classifying the response into one of three feedback states comprises:
- assigning the CELEBRATED state if the response matches an expected answer;
- assigning the GUIDED state if the response is partially correct or within a similarity threshold of the expected answer; and
- assigning the SUPPORTED state if the response does not match and is not within the similarity threshold.

**Claim 5:** The method of Claim 1, wherein the feedback content for all three feedback states is selected from positively-framed templates that exclude the words "wrong," "incorrect," "failed," or "error."

**Claim 6:** The method of Claim 1, further comprising:
- computing a rolling response-time slope over a window of most recent exercises;
- when the rolling slope exceeds a fatigue threshold, shortening a remaining exercise queue for the session without notifying the patient.

**Claim 7:** The method of Claim 6, wherein the fatigue threshold comprises at least a 40% increase in response time relative to a session baseline over a 5-exercise rolling window.

**Claim 8:** The system of Claim 2, wherein the curated library of session completion messages is partitioned into at least three tiers based on session completion rate, and wherein all tiers produce positively-framed output.

**Claim 9:** The system of Claim 2, wherein the clinician data channel stores at least: the prompt presented, the expected answer, the actual response, the response time, the correctness indicator, and the assigned feedback state for each exercise.

**Claim 10:** The method of Claim 1, wherein the cognitive exercise assesses a cognitive domain selected from the group consisting of: orientation, memory, attention, language, executive function, visuospatial, and identity.

**Claim 11:** The method of Claim 1, wherein the patient is diagnosed with a neurodegenerative condition selected from the group consisting of: Alzheimer's disease, vascular dementia, Lewy body dementia, frontotemporal dementia, mild cognitive impairment, and mixed dementia.

**Claim 12:** The system of Claim 2, further comprising a difficulty adjustment module configured to receive the raw performance metrics from the clinician data channel and adjust difficulty of subsequent exercises based on the raw metrics, wherein the feedback state is not used as input to the difficulty adjustment module.

## 10. ABSTRACT

A computer-implemented cognitive assessment system for patients with neurodegenerative conditions classifies every patient response into one of exactly three positively-framed feedback states: CELEBRATED, GUIDED, or SUPPORTED. The system maintains two channels: a patient feedback channel delivering only positive framing and a separate clinician data channel preserving raw performance metrics including correctness, response time, and error type. A session-level fatigue detector analyzes response-time trends and shortens the session when fatigue is detected, without notifying the patient. Session completion messages are selected from tiered libraries of positively-framed templates, eliminating failure language regardless of performance. The invention addresses documented psychological harms caused by traditional pass/fail cognitive tests (MMSE, MoCA) in dementia populations while retaining clinical utility of granular data for caregivers and clinicians.

---

## REFERENCES

### Non-Patent Literature
- Folstein, M.F., Folstein, S.E., McHugh, P.R. (1975). "Mini-mental state: A practical method for grading the cognitive state of patients for the clinician." *Journal of Psychiatric Research*, 12(3), 189-198.
- Nasreddine, Z.S., et al. (2005). "The Montreal Cognitive Assessment, MoCA: A Brief Screening Tool for Mild Cognitive Impairment." *Journal of the American Geriatrics Society*, 53(4), 695-699.
- Clare, L. (2003). "Managing threats to self: Awareness in early stage Alzheimer's disease." *Social Science & Medicine*, 57(6), 1017-1029.
- Bahar-Fuchs, A., Clare, L., Woods, B. (2013). "Cognitive training and cognitive rehabilitation for mild to moderate Alzheimer's disease and vascular dementia." *Cochrane Database of Systematic Reviews*, Issue 6. Art. No.: CD003260.
- Rosen, W.G., Mohs, R.C., Davis, K.L. (1984). "A new rating scale for Alzheimer's disease." *American Journal of Psychiatry*, 141(11), 1356-1364.

### Patent Literature
- US 7,761,314 B2 — "Computerized Assessment" (Cogstate Ltd., 2010)
- US 9,610,051 B2 — "Methods of adaptive computer training" (Akili Interactive Labs, 2017)
- US 9,536,427 B2 — "Cognitive development assessment system" (Lumos Labs, 2017)

### Codebase References (Internal — Not Filed)
- `packages/cognitive-engine/src/scoring/gentle-scorer.ts`
- Function: `calculateSessionScores()`
- Function: `getSessionCompletionMessage()`
- Function: `detectFatigueSignals()`

---

## APPLICANT NOTES (Not Filed)

**Why this provisional matters:** This is the foundational IP of the Gentle Reminder platform. The entire dementia-safe UX depends on this architectural separation. This patent blocks any competitor from building a cognitive assessment tool that architecturally guarantees no negative feedback reaches the patient.

**Conversion priority:** HIGH — Convert to non-provisional within 9 months. Consider continuation-in-part strategy for subsequent improvements.

**Estimated valuation:** $3M-$8M as a standalone patent asset

**Key competitor vulnerability:** Cogstate, Akili, Lumosity, Neurotrack — none have architectural separation of data channels

**Trade secret vs patent decision:** Patent is preferred because (a) the concept will be apparent once products ship, making trade secret protection weak; (b) architectural patents are strongly enforceable; (c) the patent enables licensing to pharma/clinical trial sponsors as a scoring methodology.
