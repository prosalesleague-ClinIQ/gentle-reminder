# RESEARCH STRATEGY

*(6-page limit per NIH SBIR Phase I instructions. Organized in three required sections: Significance, Innovation, Approach.)*

---

## A. SIGNIFICANCE

### A.1 The Clinical Problem

Alzheimer's disease and related dementias (ADRD) affect over 55 million people globally, with 10 million new cases annually, and costs exceed $1.3 trillion worldwide (WHO 2023). Cognitive assessment is central to dementia care: it informs diagnosis, tracks decline, evaluates therapeutic response, and guides caregiving decisions. Yet the instruments used to perform these assessments — the Mini-Mental State Examination (MMSE, Folstein 1975), Montreal Cognitive Assessment (MoCA, Nasreddine 2005), and Alzheimer's Disease Assessment Scale-Cognitive (ADAS-Cog, Rosen 1984) — were designed decades ago as pen-and-paper tests for clinician administration. These instruments produce pass/fail feedback or numeric scores that inherently communicate failure to the patient. The resulting psychological burden is clinically significant:

- **Anxiety and agitation during testing:** Documented in multiple studies (Clare 2003; Woods et al. 2005), negative feedback triggers measurable stress responses that impair performance on subsequent cognitive tasks.
- **Session abandonment:** Up to 30% of patients with moderate dementia abandon structured cognitive assessment sessions when faced with consecutive task failures (Burgener & Twigg, 2002).
- **Impaired learning and engagement:** The Cochrane Review of cognitive training for dementia (Bahar-Fuchs, Clare & Woods, 2013) concluded that negative-feedback approaches reduce downstream engagement with therapeutic interventions.

Despite this well-characterized harm, no commercially available alternative exists. Current digital cognitive platforms (Cogstate, Linus Health, Neurotrack) replicate the pass/fail paradigm in digital form without addressing the architectural source of patient harm.

### A.2 The Unmet Market Need

Three converging forces create urgent demand for a dementia-safe cognitive assessment platform:

1. **Anti-amyloid therapy era:** Leqembi (lecanemab, Biogen/Eisai, 2023) and Kisunla (donanemab, Lilly, 2024) are now FDA-approved for early Alzheimer's disease with combined peak sales projections exceeding $20B. These therapies require longitudinal cognitive assessment to monitor efficacy and detect decline — creating demand for scalable, patient-friendly assessment tools usable between dosing intervals.
2. **Medicare Advantage risk stratification:** UnitedHealth Group, Humana, and Kaiser Permanente are investing heavily in early-dementia detection to manage cost and improve care outcomes in their aging member populations.
3. **Facility operators:** Brookdale Senior Living, Sunrise Senior Living, and other memory care networks need tools that improve resident engagement and reduce caregiver burden — both tied to resident census retention.

### A.3 Expected Phase I Impact

Successful validation of Gentle Reminder in Phase I directly addresses all three market forces:

- **Clinical impact:** First dementia-safe alternative to MMSE/MoCA/ADAS-Cog, with documented evidence of reduced patient anxiety and increased completion rates.
- **Research impact:** Validated digital biomarkers for cognitive decline usable as endpoints in pharmaceutical clinical trials.
- **Commercial impact:** Clinical validation enables FDA 510(k) submission (predicate: Linus Health K201738), Medicare reimbursement pathways, and deployment across memory care facilities.

---

## B. INNOVATION

### B.1 The Core Innovation: Three-State Positive-Only Feedback System

Standard cognitive tests produce binary correct/incorrect feedback. Gentle Reminder's innovation is architectural: every patient response is classified into one of three positively-framed states — **CELEBRATED**, **GUIDED**, or **SUPPORTED** — with simultaneous preservation of raw performance metrics in a separate clinician data channel. The patient never receives negative feedback; the clinician retains full granular data. This is not a user interface choice but an algorithmic architecture that makes negative feedback structurally impossible to deliver.

**Novel elements:**
- Three-state classifier that categorizes any response into positive-framed output
- Dual-channel data architecture separating patient feedback from clinician analytics
- Session-level fatigue detector that shortens sessions without notifying the patient
- Positively-framed completion messaging regardless of performance level

**Prior art:** Extensive search of USPTO, Google Patents, IEEE Xplore, and PubMed confirms no prior system provides architectural separation of patient feedback from clinician data. Cogstate, Akili Interactive (EndeavorRx for ADHD), Lumosity, and Neurotrack all use score-based feedback visible to the patient. USPTO provisional patent filed (Docket GR-01-PROV).

### B.2 Additional Platform Innovations

Twenty-three patentable innovations support the platform. Key innovations beyond the feedback system include:

- **Adaptive Difficulty Engine (GR-02):** Asymmetric comfort-zone targeting (70-85% success rate), with difficulty dropping after 2 consecutive failures but advancing only after 4 consecutive successes plus 85% average. Standard adaptive testing uses symmetric thresholds unsuited to dementia populations.
- **Dementia-Adapted Spaced Repetition (GR-03):** Modified SuperMemo-2 algorithm with 5 dementia-specific changes: max interval capped at 7 days (vs. standard 365+), no-reset-on-failure (halves interval instead), min interval 1 hour, gentler ease factor floor at 1.5, three-phase initial spacing.
- **Multimodal Cognitive State Classifier (GR-04):** Classifies 7 cognitive states from speech, behavior, and biometric signals with automatic weight redistribution when signal sources are unavailable and dual-factor confidence scoring.
- **Composite Digital Biomarker Engine (GR-07):** Five analyzers (routine disruption, sleep irregularity, cognitive delay, medication adherence, speech hesitation) combined with automatic weight redistribution and medication-inversion logic.
- **Dementia-Specific Speech Emotion Detection (GR-05):** Combines dementia keyword dictionaries with audio feature thresholds tuned for elderly speech patterns.

### B.3 Innovation Summary

Gentle Reminder represents a category-defining innovation in dementia cognitive care. Unlike competitors who have adapted general-purpose cognitive tools, our platform is designed from the algorithm up for the dementia population. The 23-patent IP portfolio creates a defensible moat, and the production-ready platform (53,000+ lines of code, 5 deployed applications, 10 languages) is unusual for Phase I and substantially de-risks commercialization.

---

## C. APPROACH

### C.1 Overall Strategy

Phase I will validate Gentle Reminder against standard-of-care cognitive instruments in a prospective cohort of patients with mild-to-moderate Alzheimer's disease, partnered with an NIH-funded memory center. The three Specific Aims are designed to produce primary endpoints that directly support the downstream FDA 510(k) submission (Aim 1), pharmaceutical clinical trial deployment (Aim 2), and commercial adoption case (Aim 3).

### C.2 Specific Aim 1: Validate the Gentle Feedback Scoring System

**Hypothesis:** The Gentle Reminder composite cognitive score correlates at Pearson r ≥ 0.80 with MMSE and MoCA, while STAI anxiety scores decrease by ≥30% during Gentle Reminder sessions compared to standard testing.

**Study Design:** Prospective, within-subject crossover. 60 patients (N=30 mild AD per NINDS-ADRDA criteria with MMSE 20-26, N=30 moderate AD with MMSE 10-19) recruited from the collaborating memory center. Each patient completes (in randomized order across 12 weeks):
- MMSE (30-point, ~10 min)
- MoCA (30-point, ~12 min)
- ADAS-Cog-13 (~30 min)
- Gentle Reminder full session (~15 min, includes orientation, identity, memory, language)
- State-Trait Anxiety Inventory (STAI-6, ~3 min) immediately after each instrument

**Analytical Plan:**
- **Concurrent validity:** Pearson and Spearman correlations between Gentle Reminder composite and each standard instrument (target Pearson r ≥ 0.80, Bland-Altman limits of agreement reported).
- **Anxiety comparison:** Paired t-test comparing STAI scores post-Gentle Reminder vs. post-standard testing (target ≥30% reduction, p<0.01, Cohen's d ≥ 0.5).
- **Completion rates:** Chi-square test comparing session completion across instruments (target Gentle Reminder completion ≥90% vs. standard ≥60%).
- **Sample size rationale:** N=60 provides 80% power to detect r=0.70 vs. 0.80 at α=0.05, and 85% power to detect a 30% anxiety reduction at Cohen's d=0.5.

**Rigor and Reproducibility:** Pre-registered on ClinicalTrials.gov before enrollment. Blinded outcome assessment (scorers unaware of instrument order). Statistical analysis plan frozen before unblinding.

### C.3 Specific Aim 2: Characterize Digital Biomarker Correlation with Decline

**Hypothesis:** Baseline composite digital biomarker scores (from speech, response time, routine, sleep, medication adherence) predict 6-month MMSE change with Pearson r ≥ 0.65.

**Study Design:** Longitudinal cohort using the same 60 patients from Aim 1. Digital biomarker data captured continuously through patient device usage and wearable integration over 6 months. MMSE administered at baseline, 3 months, and 6 months.

**Analytical Plan:**
- **Predictive validity:** Linear regression of 6-month MMSE change on baseline composite biomarker score (target r ≥ 0.65).
- **Per-biomarker analysis:** Individual regression models for each of the 5 biomarkers (speech hesitation, response time, routine, sleep, medication adherence) to identify strongest predictor.
- **Machine learning:** Apply our 8-feature decline predictor (Docket GR-11-PROV) with 5-fold cross-validation; report AUC for binary classification (decline ≥3 MMSE points vs. stable).

**Deliverables:** Predictive validity coefficient per biomarker. ML model performance metrics. Identification of strongest single-biomarker predictor for Phase II power calculations.

### C.4 Specific Aim 3: Demonstrate Caregiver Burden Reduction

**Hypothesis:** Caregivers of patients using Gentle Reminder show ≥20% reduction in Zarit Burden Interview (ZBI) scores at 3 months vs. baseline.

**Study Design:** Prospective cohort. Primary caregivers of the 60 enrolled patients (N=60 dyads) complete ZBI at baseline, 1 month, and 3 months. Patients receive full Gentle Reminder platform access including caregiver dashboard, family messaging, and clinical alerts.

**Analytical Plan:**
- **Primary endpoint:** Paired t-test comparing ZBI baseline vs. 3-month (target ≥20% reduction, p<0.05).
- **Secondary endpoints:** Caregiver-reported patient engagement (7-point Likert), facility census retention (if applicable), platform feature utilization analytics.

### C.5 Timeline

| Month | Activities |
|------:|-----------|
| 1 | Study startup: IRB approval, site activation, staff training |
| 2 | Enrollment begins; first patients complete baseline assessments |
| 3-4 | Enrollment continues; Aim 1 cross-instrument sessions begin |
| 5 | Enrollment complete; midpoint Aim 2 biomarker data collection |
| 6 | Aim 1 analysis; Aim 3 baseline/1-month ZBI |
| 7-9 | 3-month and 6-month follow-ups |
| 10 | Final data collection; Aim 2 longitudinal analysis |
| 11 | Statistical analysis complete; manuscript preparation |
| 12 | Final report; Phase II preparation |

### C.6 Potential Problems and Alternative Approaches

**Problem:** Enrollment slower than projected.
**Mitigation:** Pre-screen pool identified prior to grant start. Enrollment sites willing to expand to neighboring clinics if needed.

**Problem:** Standard-instrument anxiety scores lower than expected (reducing effect size).
**Mitigation:** Anxiety effect size is conservative; even 20% reduction would demonstrate clinical meaning. Secondary endpoints (completion rates, engagement) provide parallel evidence.

**Problem:** Technical issues with Gentle Reminder platform in clinical setting.
**Mitigation:** Platform is production-ready with 5 deployed applications and extensive QA. Dedicated engineer allocated to rapid response during study.

### C.7 Phase II Plan Preview

Phase II will expand validation to 3-5 memory centers with 300 patients, conduct FDA Pre-Submission meeting based on Phase I data, begin real-world evidence collection with 2 pharmaceutical partners (pre-identified: Biogen Digital Health and Eisai), and develop a commercial launch plan with memory care facility networks.

---

*References available upon request. References cited include Folstein 1975, Nasreddine 2005, Rosen 1984, Clare 2003, Woods 2005, Burgener & Twigg 2002, Bahar-Fuchs et al. 2013 (Cochrane), WHO 2023, Alzheimer's Disease International 2023.*
