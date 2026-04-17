# Prior Art Search — Gentle Reminder IP Portfolio

**CONFIDENTIAL — Attorney-Client Privileged**

This document catalogs known prior art for each of the 23 IPs in the Gentle Reminder portfolio. For each IP, we identify the closest prior art and explain how the invention differentiates.

## Master Prior Art Catalog

### Cognitive Assessment Tests (General)
- **MMSE (Mini-Mental State Examination)** — Folstein, M.F., et al. (1975). "Mini-mental state: A practical method for grading the cognitive state of patients for the clinician." *Journal of Psychiatric Research*, 12(3), 189-198. Public domain.
- **MoCA (Montreal Cognitive Assessment)** — Nasreddine, Z. S., et al. (2005). *Journal of the American Geriatrics Society*, 53(4), 695-699. Copyrighted; licensed use.
- **ADAS-Cog (Alzheimer's Disease Assessment Scale-Cognitive)** — Rosen, W. G., et al. (1984). *American Journal of Psychiatry*, 141(11), 1356-1364.
- **CDR (Clinical Dementia Rating)** — Hughes, C. P., et al. (1982). *British Journal of Psychiatry*, 140, 566-572.

### Digital Cognitive Assessment Platforms
- **Cogstate** (cogstate.com) — Computerized cognitive testing platform used in clinical trials. Patent portfolio includes US7761314, US7850548, US8708702.
- **Neurotrack** (neurotrack.com) — Eye-tracking cognitive assessment. Patents: US9861308, US10,485,459.
- **Linus Health** (linushealth.com) — Digital cognitive assessment with speech/drawing tasks. Patent: US10,796,805.
- **Akili Interactive** (EndeavorRx, AKL-T01) — FDA-cleared digital therapeutic for ADHD (not dementia). Patents on adaptive difficulty algorithms: US9,610,051, US10,176,544.
- **Cognoa** (canvas Dx) — Digital diagnostic for autism. Patents: US10,702,225.

### Spaced Repetition
- **SuperMemo-2 (SM-2)** — Wozniak, P.A. (1990). "Optimization of Learning." PhD thesis. Public algorithm.
- **Anki** (ankiweb.net) — Open-source implementation of SM-2. No blocking patents.
- **Leitner System** — 1970s flashcard method. Public domain.

### Emotion Detection from Speech
- **Affective Computing (Picard 1997)** — Foundation text. No blocking patents.
- **IBM Watson Tone Analyzer** — General-purpose sentiment analysis. Not dementia-specific.
- **Beyond Verbal** — Acquired 2019; voice emotion detection. Patents: US10,152,988, US9,922,666.
- **Sonde Health** — Voice biomarkers for mental health. Patents: US10,672,396.

### Cognitive State Classification (Multimodal)
- **Affectiva** — Facial and voice emotion. Patents: US8,219,438, US9,204,836.
- **EmoShape** — Emotional AI. Patents on valence/arousal classifiers.

### Digital Biomarkers
- **Evidation Health** — Digital biomarkers from wearables. Patents: US10,943,696.
- **BioPrint by Biogen** — Dementia digital biomarkers research. Biogen patents in preparation.
- **Apple Watch Cognitive Study** — Apple/Biogen 2021 collaboration. Patents pending.
- **Novartis Digital Therapeutics** — Multiple dementia biomarker patents.

### Voice Cloning / Therapeutic Voice
- **ElevenLabs** — Voice cloning (the API referenced by VoiceCloneService). Terms of service, not patent protection.
- **Voiceitt** — Personalized speech recognition for dysarthric speakers. Patents: US10,878,801.
- **Resemble AI** — Voice cloning platform. Patents: US11,222,621.
- **Sonantic** (acquired by Spotify 2022) — Emotional voice synthesis. Patents: WO2021/108,555.

### Music Therapy
- **Music Health** (musichealth.ai) — AI music therapy platform. Patent: US11,127,416.
- **SingFit** — Music therapy for dementia. No known blocking patents.
- **Memory & Company** — Non-drug cognitive interventions including music. No known blocking patents.

### Multi-Tenant SaaS Architecture
- **Salesforce multi-tenant patents** — US7,299,240 and related. Focused on database-level tenant isolation via shared schema.
- **Snowflake multi-tenant** — Compute-storage separation patents, US10,331,655.

### FHIR / Healthcare Interoperability
- **HL7 FHIR specification** — Public standard, no IP barrier. But specific implementations may be patented.
- **Epic MyChart FHIR implementation** — Proprietary extensions.
- **Cerner FHIR gateway** — Proprietary.

---

## Per-IP Prior Art Analysis

### IP #01: Gentle Feedback Scoring System
**Closest prior art:**
- MMSE (Folstein 1975) — provides correct/incorrect feedback; punitive for dementia patients
- MoCA — similar pass/fail binary scoring
- Akili Interactive patents (US9,610,051) — adaptive difficulty but no feedback-state abstraction

**Differentiation:** No known prior art provides a three-state feedback system (CELEBRATED/GUIDED/SUPPORTED) that architecturally prevents negative feedback from reaching the patient. Prior systems either score binary (correct/incorrect) or use numeric scales that inevitably communicate failure.

**Novelty claim strength:** HIGH — No prior art combining (a) clinical cognitive assessment, (b) three-state positive-only feedback abstraction, (c) architectural separation of scoring data (for clinicians) from patient feedback (always positive).

---

### IP #02: Adaptive Difficulty Engine (Asymmetric Comfort Zone)
**Closest prior art:**
- Akili Interactive adaptive algorithms (US9,610,051, US10,176,544)
- Standard Item Response Theory (IRT) adaptive testing
- Lumosity adaptive difficulty patents (US9,536,427)

**Differentiation:** Prior systems use symmetric up/down logic. This invention uses asymmetric thresholds specifically tuned for dementia: drops difficulty immediately on 2 failures (not 3+), requires 4 consecutive successes AND 85%+ average to advance (not 2-3 successes), targets 70-85% comfort zone (standard is 50-75%).

**Novelty claim strength:** MEDIUM-HIGH — Combination of specific thresholds (2-fail drop, 4-success advance, 70-85% target, 5-level system) is novel and non-obvious for the dementia population.

---

### IP #03: Dementia-Adapted Spaced Repetition
**Closest prior art:**
- SuperMemo SM-2 (Wozniak 1990) — public algorithm
- Anki implementations — public
- Duolingo's Half-Life Regression (HLR) — US9,904,676

**Differentiation:** Five specific parameter changes from SM-2:
1. Maximum interval capped at 7 days (SM-2: 365+ days)
2. Failure halves interval instead of resetting to zero
3. Minimum interval of 1 hour (SM-2: 1 day)
4. Ease factor floor at 1.5 (SM-2: 1.3)
5. Three-phase initial spacing (1h → 6h → computed)

**Novelty claim strength:** MEDIUM — Individual parameter changes are incremental, but the specific combination tuned for progressive cognitive decline is non-obvious.

---

### IP #04: Multimodal Cognitive State Classifier
**Closest prior art:**
- Affectiva multimodal emotion (US8,219,438)
- IBM Watson multi-signal integration
- Microsoft Cognitive Services Emotion API

**Differentiation:** Novel features:
1. Automatic weight redistribution when signal sources are missing (most prior art fails or degrades silently)
2. Dual confidence scoring: combines absolute score AND separation from second-best class
3. Trigger source determination for each classification

**Novelty claim strength:** MEDIUM-HIGH — The combination of weight redistribution with dual-factor confidence computation is novel.

---

### IP #05: Dementia-Specific Speech Emotion Detection
**Closest prior art:**
- Sonde Health voice biomarkers (US10,672,396)
- Beyond Verbal emotion detection (US10,152,988)
- IBM Watson Tone Analyzer
- General sentiment analysis libraries (VADER, TextBlob, Hugging Face)

**Differentiation:** Combination of:
1. Dementia-specific keyword dictionaries (e.g., "don't understand", "where am I")
2. Audio feature thresholds tuned for elderly speech (170 wpm = anxiety, <80 wpm = sadness)
3. Six-state emotion classifier specifically for dementia (calm/anxious/confused/sad/agitated/engaged)

**Novelty claim strength:** MEDIUM-HIGH — No prior art combines dementia keyword dictionary with elderly-tuned audio feature thresholds.

---

### IP #06: Sundowning Detection Algorithm
**Closest prior art:**
- General wandering detection (GPS-based) — multiple patents
- Caregiver log apps — no algorithmic detection
- Academic studies of sundowning (Bachman & Rabins 2006) — no patented detection system

**Differentiation:** First digital biomarker specifically for sundowning with:
1. Time window (4-8 PM)
2. Composite risk score combining time + sleep quality + light + agitation + confusion + restlessness
3. Time-sequenced intervention recommendations

**Novelty claim strength:** HIGH — No known prior art for a digital sundowning detection algorithm.

---

### IP #07: Composite Biomarker Engine with Weight Redistribution
**Closest prior art:**
- Evidation Health digital biomarkers (US10,943,696)
- BioPrint Biogen (patents pending)
- Academic biomarker composites (various)

**Differentiation:** Weight redistribution when analyzers lack data + medication adherence inversion + voting-based trend aggregation. The specific 5-analyzer architecture with redistributable weights is novel.

**Novelty claim strength:** MEDIUM — Individual components exist in prior art; the integrated weight redistribution mechanism is novel.

---

### IP #08: Multi-Window Decline Detection
**Closest prior art:**
- Generic trend detection algorithms
- Apple Watch AFib detection (US10,278,630)
- Statistical process control (SPC) in healthcare

**Differentiation:** Multi-window (7, 14, 30 days) per-biomarker analysis with severity-based deduplication. 10% change threshold with 4-tier severity (low 0.3, moderate 0.5, high 0.7, critical 0.85).

**Novelty claim strength:** MEDIUM — Multi-window concept exists; specific implementation for cognitive decline is novel.

---

### IP #09: Trimodal Speech Hesitation Biomarker
**Closest prior art:**
- Sonde Health speech biomarkers (US10,672,396)
- Cogstate speech tasks (US8,708,702)
- Linus Health speech analysis (US10,796,805)

**Differentiation:** Three-feature fusion (hesitation count + pause duration + speech rate) with specific normalization constants (10 hesitations, 30 seconds, 150 wpm normal) and dynamic threshold for trend detection (`max(avgVal * 0.1, 0.5)`).

**Novelty claim strength:** MEDIUM — Speech biomarkers exist; specific normalization + dynamic threshold is novel.

---

### IP #10: Response Time Biomarker with Variance + Trend Penalty
**Closest prior art:**
- Cogstate reaction time measures
- Standard psychometric reaction time analysis

**Differentiation:** Novel scoring formula: `score = baseScore + variancePenalty + trendPenalty` where variance penalty uses coefficient of variation capped at 0.3 and trend penalty uses normalized slope capped at 0.2.

**Novelty claim strength:** MEDIUM — Response time measurement is prior art; specific penalty combination is novel.

---

### IP #11: 8-Feature Cognitive Decline Predictor
**Closest prior art:**
- IBM Watson Health predictive models
- Biogen/Eisai Leqembi biomarker composite
- Academic ML models for dementia prediction

**Differentiation:** Specific 8-feature vector (mean, latest, slope, stddev, CV, session frequency, score range, recent trend) with interpretable threshold-based fallback model for when ML is unavailable.

**Novelty claim strength:** MEDIUM — Feature engineering is often considered obvious; the specific 8-feature selection with fallback is modestly novel.

---

### IP #12: Algorithm Transparency for FDA SaMD
**Closest prior art:**
- FDA Pre-Cert guidance documents (not patents)
- IBM AI Explainability 360 (open-source, not patented)
- LIME/SHAP explainability libraries (open-source)

**Differentiation:** Integrated algorithm transparency module specifically for FDA SaMD regulatory compliance, generating human-readable explanations for scoring and difficulty decisions with component-level versioning.

**Novelty claim strength:** LOW-MEDIUM — Individual transparency techniques are known; integration for SaMD is slightly novel.

---

### IP #13: Automated Post-Market Surveillance with Drift Detection
**Closest prior art:**
- FDA post-market surveillance guidance
- MDR/FDA MedWatch systems
- Cogstate post-market monitoring (unpatented)

**Differentiation:** Automated Pearson correlation monitoring with 4-tier drift severity classification and integrated complaint categorization from 5 sources across 6 categories.

**Novelty claim strength:** MEDIUM — Drift detection is known in ML; specific SaMD implementation with 5-source/6-category complaint schema is novel.

---

### IP #14: Voice Companion System for Dementia Care
**Closest prior art:**
- Voiceitt dysarthric speech (US10,878,801)
- Amazon Alexa for Seniors
- ElevenLabs voice cloning (ToS, not patent)
- Replika companion app (no patented therapeutic method)

**Differentiation:** Specific protocol: (1) companion intro → pause → family member voice, (2) natural pause injection, (3) inactivity detection with warm prompts, (4) mood-based speech modulation. No prior art combines these for dementia therapeutic use.

**Novelty claim strength:** MEDIUM — Voice cloning exists; therapeutic application protocol is novel.

---

### IP #15: Music Therapy Engine with Circadian Fade-Out
**Closest prior art:**
- Music Health AI platform (US11,127,416)
- SingFit
- Apple Music sleep timer (simple, not dementia-specific)

**Differentiation:** (1) 2-minute gradual fade-out in 20 steps specifically to prevent dementia patient startle, (2) mood→playlist mapping with clinical rationales, (3) circadian time-of-day recommendation (morning classical → afternoon nature → evening familiar).

**Novelty claim strength:** MEDIUM — Music therapy exists; specific fade-out timing and circadian logic for dementia is novel.

---

### IP #16: Hard-Enforced Dementia-Safe UX Framework
**Closest prior art:**
- WCAG 2.1 AAA accessibility guidelines (not patented)
- Apple Accessibility framework
- Android accessibility libraries

**Differentiation:** Component-level enforcement of dementia-specific constraints (24pt font floor, 80x80px button minimum, max 3 choices per screen) that cannot be overridden by application developers. Prior accessibility frameworks are guidelines; this is architectural enforcement.

**Novelty claim strength:** LOW-MEDIUM — UX guidelines exist; component-enforced architectural constraints are slightly novel.

---

### IP #17: Multi-Tenant Clinical Data Isolation
**Closest prior art:**
- Salesforce multi-tenant patents (US7,299,240)
- Snowflake (US10,331,655)
- AWS multi-tenant database patterns

**Differentiation:** Three-tier tenant resolution (X-Tenant-ID header → subdomain → JWT) with automatic Prisma middleware injection of tenant WHERE clauses for healthcare-specific data isolation.

**Novelty claim strength:** LOW — Multi-tenant SaaS is well-established; healthcare-specific application is incremental.

---

### IP #18: 21 CFR Part 11 Hash-Chain Audit Trail
**Closest prior art:**
- Blockchain-based audit logs (many patents)
- Merkle tree audit trails (widely used)
- Traditional WORM (write-once-read-many) systems

**Differentiation:** Specific hash chain structure for 21 CFR Part 11 electronic signature compliance with signature meaning field (approval vs review).

**Novelty claim strength:** LOW — Hash chains are well-known; CFR-specific application is incremental.

---

### IP #19: Cognitive State → Response Policy Mapping
**Closest prior art:**
- Replika adaptive conversation
- Woebot therapeutic chatbot (US11,087,094)
- General chatbot response systems

**Differentiation:** Systematic mapping of 7 cognitive states to curated response policies with tone, strategy, 7+ guidelines, and fallback templates. Specifically designed for dementia care.

**Novelty claim strength:** LOW-MEDIUM — Response mapping is known; specific dementia state-policy table is novel.

---

### IP #20: Wearable Health Signal Processing
**Closest prior art:**
- Apple HealthKit (extensive patent portfolio)
- Fitbit HRV analysis patents
- Polar HRV patents

**Differentiation:** Combined HRV (time + frequency + non-linear) with sleep stage cycle detection and anomaly detection against patient-specific baselines (sigma deviation), all optimized for dementia patient monitoring.

**Novelty claim strength:** LOW — Individual components are prior art; dementia-specific combination is modest.

---

### IP #21: FHIR R4 Extensions for Dementia Monitoring
**Closest prior art:**
- HL7 FHIR specification (public)
- Epic FHIR extensions
- Cerner FHIR gateway

**Differentiation:** Custom FHIR extensions for cognitive-stage, biomarker-confidence, risk-prediction, decline-rate, session-engagement — none of which exist in current FHIR specifications.

**Novelty claim strength:** LOW — Extensions to FHIR are common; specific extensions are useful but not strongly patentable (better as contributed standards).

---

### IP #22: Pure TypeScript Statistical Engine
**Closest prior art:**
- Open-source statistical libraries (jStat, simple-statistics) — MIT licensed
- R statistical language
- SciPy

**Differentiation:** Integrated suite of paired t-test, Wilcoxon, Cohen's d, confidence intervals, Cornish-Fisher expansion, Lanczos log-gamma — specifically bundled for clinical trial statistical analysis with zero external dependencies.

**Novelty claim strength:** LOW — Individual statistical functions are public domain; combination is useful but not strongly patentable.

---

### IP #23: Circadian Biomarkers (Sleep + Routine Disruption)
**Closest prior art:**
- Fitbit sleep analysis patents
- Apple Watch sleep tracking
- Oura Ring circadian patents

**Differentiation:** Novel bedtime normalization handling midnight discontinuity, first-activity + meal-time variability scoring, routine disruption scoring specifically for dementia.

**Novelty claim strength:** LOW-MEDIUM — Sleep tracking is well-patented; specific normalization approach and dementia application is novel.

---

## Summary Recommendations

### File with Confidence (Strong Novelty)
- IP #01, #06 — No known blocking prior art
- IP #02, #04, #05 — Clear differentiation from identified prior art

### File with Attorney Consultation (Moderate Novelty)
- IP #03, #07, #08, #09, #10, #11, #13, #14, #15, #19, #23 — Provisional filing recommended; conversion decision based on commercial traction

### Consider Trade Secret Alternative
- IP #12, #16, #17, #18, #20, #21, #22 — Individual innovation strength is lower; keeping numerical parameters as trade secrets may offer stronger protection than weak patent claims

### Prior Art Search Budget
- Professional prior art searches ($1,000-$3,000 each) recommended for Tier 1 IPs (#01-#05) = $5,000-$15,000
- Tier 2 and Tier 3 can rely on initial search documented here
