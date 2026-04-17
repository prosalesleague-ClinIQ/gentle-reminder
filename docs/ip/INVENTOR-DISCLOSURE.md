# Inventor Disclosure & Assignment Tracking

**CONFIDENTIAL — Attorney-Client Privileged**

This document tracks inventor information and assignment status for each of the 23 Gentle Reminder IPs. Complete this for each invention BEFORE filing provisional patent applications.

## General Instructions

1. **Identify true inventors only.** Under US patent law (35 USC §100, §102), only individuals who made a material inventive contribution can be named. Adding non-inventors (project managers, executives, funders) can invalidate the patent.

2. **Obtain written assignments** from all inventors before filing. Assignments transfer ownership from the inventor(s) to the company. Without this, the inventors personally own the patent even if they were employees.

3. **Document invention dates** carefully:
   - **Conception date:** When the complete idea was formed
   - **Reduction to practice date:** When the first working implementation was created

4. **Keep this document confidential.** Disclosure of inventor identity pre-filing is not required but is generally safe; disclosure of invention details pre-filing can destroy patent rights.

## Inventor Registry

For each inventor who contributed to any IP:

| Inventor # | Full Legal Name | Current Title/Role | Citizenship | Residential Address | Email | Employment Start Date |
|-----------|----------------|-------------------|-------------|---------------------|-------|----------------------|
| 1 | [FILL IN] | [Founder/CTO/etc.] | [Country] | [Street, City, State, ZIP] | [email] | [YYYY-MM-DD] |
| 2 | [FILL IN] | [...] | [...] | [...] | [...] | [...] |

## Assignment Agreement Status

All inventors must execute an Invention Assignment Agreement (IAA) before filing. Track status here:

| Inventor | Employment Agreement Date | IAA Signed | IAA Execution Date | Recorded with USPTO |
|----------|--------------------------|-----------|-------------------|---------------------|
| [Inventor 1] | [YYYY-MM-DD] | [ ] Yes [ ] No | [YYYY-MM-DD] | [ ] Yes [ ] No |
| [Inventor 2] | [...] | [...] | [...] | [...] |

**Recording with USPTO** uses form PTO-1595 (Recordation Cover Sheet) + fee $40 per document.

## Per-IP Inventor Attribution

### IP #01: Gentle Feedback Scoring System
- **Inventor(s):** [FILL IN]
- **Conception Date:** [YYYY-MM-DD — based on git history of gentle-scorer.ts]
- **Reduction to Practice Date:** [YYYY-MM-DD — first working implementation]
- **Primary Contributions:**
  - [Inventor Name]: Original concept of three-state feedback model
  - [Inventor Name]: Algorithm implementation
- **Contributing References in Codebase:**
  - `packages/cognitive-engine/src/scoring/gentle-scorer.ts` (git commit [hash])
- **Related Publications or Disclosures:**
  - None (recommended to keep private until filing)

### IP #02: Adaptive Difficulty Engine
- **Inventor(s):** [FILL IN]
- **Conception Date:** [YYYY-MM-DD]
- **Reduction to Practice Date:** [YYYY-MM-DD]
- **Primary Contributions:**
  - [Inventor Name]: Asymmetric threshold design (2-fail / 4-success)
  - [Inventor Name]: 70-85% comfort zone calibration
- **Contributing References:** `packages/cognitive-engine/src/scoring/adaptive-difficulty.ts`

### IP #03: Dementia-Adapted Spaced Repetition
- **Inventor(s):** [FILL IN]
- **Conception Date:** [YYYY-MM-DD]
- **Reduction to Practice Date:** [YYYY-MM-DD]
- **Primary Contributions:**
  - [Inventor Name]: 5 SM-2 modifications (max interval, no reset, min interval, ease floor, 3-phase spacing)
- **Contributing References:** `packages/cognitive-engine/src/exercises/spaced-repetition.ts`

### IP #04: Multimodal Cognitive State Classifier
- **Inventor(s):** [FILL IN]
- **Contributions:**
  - [Inventor Name]: Weight redistribution algorithm
  - [Inventor Name]: Dual confidence scoring
  - [Inventor Name]: Trigger source determination
- **Codebase:** `packages/cognitive-state/src/CognitiveStateEngine.ts`

### IP #05: Dementia-Specific Speech Emotion Detection
- **Inventor(s):** [FILL IN]
- **Contributions:**
  - [Inventor Name]: Dementia-specific keyword dictionary design
  - [Inventor Name]: Audio feature threshold calibration
- **Codebase:** `services/ai/src/services/emotion_detection.py`

### IP #06: Sundowning Detection Algorithm
- **Inventor(s):** [FILL IN]
- **Codebase:** `packages/cognitive-state/src/SundowningDetector.ts`

### IP #07: Composite Biomarker Engine
- **Inventor(s):** [FILL IN]
- **Codebase:** `packages/biomarker-engine/src/scoring/BiomarkerEngine.ts`

### IP #08: Multi-Window Decline Detection
- **Inventor(s):** [FILL IN]
- **Codebase:** `packages/biomarker-engine/src/scoring/DeclineDetector.ts`

### IP #09: Speech Hesitation Biomarker
- **Inventor(s):** [FILL IN]
- **Codebase:** `packages/biomarker-engine/src/analyzers/SpeechBiomarker.ts`

### IP #10: Response Time Biomarker
- **Inventor(s):** [FILL IN]
- **Codebase:** `packages/biomarker-engine/src/analyzers/ResponseTimeAnalyzer.ts`

### IP #11: Cognitive Decline Predictor
- **Inventor(s):** [FILL IN]
- **Codebase:** `services/ai/src/models/decline_predictor.py`

### IP #12: Algorithm Transparency Module
- **Inventor(s):** [FILL IN]
- **Codebase:** `packages/cognitive-engine/src/transparency.ts`

### IP #13: Post-Market Surveillance with Drift Detection
- **Inventor(s):** [FILL IN]
- **Codebase:** `services/api/src/services/postMarketSurveillance.ts`

### IP #14: Voice Companion System
- **Inventor(s):** [FILL IN]
- **Codebase:** `apps/mobile/src/services/VoiceCloneService.ts`, `AICompanion.ts`, `ConversationBridge.ts`

### IP #15: Music Therapy Engine
- **Inventor(s):** [FILL IN]
- **Codebase:** `apps/mobile/src/services/MusicTherapyEngine.ts`, `MusicRecommendation.ts`

### IP #16: Enforced Dementia-Safe UX
- **Inventor(s):** [FILL IN]
- **Codebase:** `packages/ui-components/src/`

### IP #17: Multi-Tenant Clinical Isolation
- **Inventor(s):** [FILL IN]
- **Codebase:** `services/api/src/middleware/tenantResolver.ts`, `tenantIsolation.ts`

### IP #18: CFR Part 11 Hash-Chain Audit
- **Inventor(s):** [FILL IN]
- **Codebase:** `packages/clinical-export/src/CFR11Compliance.ts`

### IP #19: Adaptive Response Policies
- **Inventor(s):** [FILL IN]
- **Codebase:** `packages/cognitive-state/src/adaptation/ResponsePolicyManager.ts`

### IP #20: Wearable Health Processing
- **Inventor(s):** [FILL IN]
- **Codebase:** `apps/mobile/src/services/wearables/WearableDataProcessor.ts`

### IP #21: FHIR Dementia Extensions
- **Inventor(s):** [FILL IN]
- **Codebase:** `packages/fhir/src/ExtensionHandler.ts`

### IP #22: Pure TS Statistical Engine
- **Inventor(s):** [FILL IN]
- **Codebase:** `packages/clinical-export/src/StatisticalAnalysis.ts`

### IP #23: Circadian Biomarkers
- **Inventor(s):** [FILL IN]
- **Codebase:** `packages/biomarker-engine/src/analyzers/SleepAnalyzer.ts`, `RoutineAnalyzer.ts`

## Invention Assignment Agreement Template

Below is a basic template. **Have counsel review before use.**

```
INVENTION ASSIGNMENT AGREEMENT

This Invention Assignment Agreement ("Agreement") is made and entered into
as of [DATE] by and between:

[COMPANY NAME], a [STATE] corporation with its principal place of business
at [ADDRESS] ("Assignee"); and

[INVENTOR NAME], an individual residing at [ADDRESS] ("Inventor").

WHEREAS, Inventor has conceived, reduced to practice, or contributed to
certain inventions, improvements, discoveries, and other intellectual property
in connection with Inventor's relationship with Assignee; and

WHEREAS, Assignee desires to acquire, and Inventor desires to assign, all
right, title, and interest in and to such inventions;

NOW, THEREFORE, in consideration of the mutual covenants and agreements
contained herein, and for other good and valuable consideration, the receipt
and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. ASSIGNMENT
Inventor hereby assigns, transfers, and conveys to Assignee all right, title,
and interest, worldwide, in and to the following inventions (the "Inventions"):

[LIST EACH INVENTION WITH SHORT DESCRIPTION AND CODEBASE REFERENCE]

Including without limitation:
(a) all US and foreign patent applications and patents issuing therefrom;
(b) all copyrights in any software or written materials;
(c) all trade secrets, know-how, and related intellectual property;
(d) all rights to sue for past, present, and future infringement; and
(e) all rights of renewal, continuation, and extension.

2. COOPERATION
Inventor agrees to execute any documents and take any actions necessary
to perfect Assignee's ownership of the Inventions, including executing
patent applications, assignments for recordation with the USPTO, and
declarations under 35 USC §115.

3. CONSIDERATION
Inventor acknowledges receipt of [$1 / employment compensation / other
consideration] as full consideration for this assignment.

4. REPRESENTATIONS
Inventor represents that:
(a) Inventor is the sole and exclusive owner of all rights being assigned,
    free of any liens or encumbrances;
(b) Inventor has not previously assigned or licensed the Inventions to any
    third party;
(c) The Inventions do not infringe the rights of any third party; and
(d) Inventor is authorized to execute this Agreement.

5. GOVERNING LAW
This Agreement is governed by the laws of the State of [STATE], without
regard to conflict of laws principles.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date
first written above.

ASSIGNEE:                          INVENTOR:
[COMPANY NAME]                     [INVENTOR NAME]

By: _______________________        _______________________
Name:                              [Signature]
Title:
```

**Filing Note:** Recording assignments with the USPTO costs $40 per document (Form PTO-1595). This should be done after the provisional application is filed but before any public disclosure of the invention.

## Revision Log

| Date | Revision | Notes |
|------|----------|-------|
| [Initial] | Template created | Pending inventor identification |
