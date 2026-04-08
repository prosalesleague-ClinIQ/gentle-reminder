# Clinical Validation Study Protocol

**Document ID:** CVP-001
**Version:** 1.0
**Effective Date:** 2026-04-06
**Author:** Clinical Affairs

---

## 1. Study Title

Validation of the Gentle Reminder Cognitive Monitoring Platform Against Standardized Neuropsychological Assessments in Elderly Adults with Mild-to-Moderate Dementia

## 2. Study Objectives

### 2.1 Primary Objective

To evaluate the correlation between Gentle Reminder composite cognitive scores and established neuropsychological assessment instruments (MMSE and MoCA) in adults aged 65 and older with mild-to-moderate dementia.

### 2.2 Secondary Objectives

- Evaluate per-domain score correlation (orientation, memory, attention, language, visuospatial, executive function) with corresponding MMSE/MoCA subscales
- Assess the sensitivity of Gentle Reminder longitudinal tracking to detect clinically meaningful cognitive change (>= 3-point MMSE decline)
- Evaluate medication reminder adherence rates compared to standard-of-care reminders
- Assess caregiver satisfaction and perceived clinical utility
- Evaluate system usability in the target patient population (SUS score)

## 3. Study Design

**Type:** Prospective, multi-site, observational cohort study with paired comparison

**Duration:** 6 months per participant

**Sites:** 3 clinical sites (academic medical center, community memory clinic, assisted living facility)

## 4. Study Population

### 4.1 Sample Size

**Target enrollment:** 200 participants

**Power analysis:** Based on detecting a Pearson correlation coefficient of r >= 0.70 between Gentle Reminder composite score and MMSE, with alpha = 0.05 and power = 0.90, a minimum of 134 participants is required. Enrolling 200 accounts for an estimated 25% attrition over 6 months, yielding approximately 150 completers.

### 4.2 Inclusion Criteria

1. Age >= 65 years
2. Clinical diagnosis of mild-to-moderate dementia (MMSE score 10-26)
3. Able to use a touchscreen device with assistance
4. Has an identified caregiver willing to participate
5. English-speaking (or fluent in one of the 8 supported languages)
6. Willing and able to provide informed consent (or legally authorized representative)

### 4.3 Exclusion Criteria

1. Severe dementia (MMSE < 10) or inability to interact with a touchscreen
2. Acute medical illness expected to affect cognitive function during study period
3. Significant uncorrected visual or hearing impairment preventing device use
4. Current participation in a cognitive intervention clinical trial
5. Expected life expectancy less than 6 months

## 5. Study Procedures

### 5.1 Enrollment (Week 0)

1. Informed consent obtained
2. Demographics and medical history recorded
3. Baseline MMSE administered by trained assessor
4. Baseline MoCA administered by trained assessor
5. Gentle Reminder app installed and configured on participant device
6. Caregiver enrolled and alert preferences configured
7. Baseline Gentle Reminder cognitive session completed

### 5.2 Active Monitoring (Weeks 1-24)

- Participants complete Gentle Reminder exercises at least 3 times per week
- Medication reminders active per clinical schedule
- Cognitive scores and adherence data collected continuously
- Caregiver alerts delivered per configuration

### 5.3 Assessment Timepoints

| Timepoint | Week | Assessments |
|-----------|------|-------------|
| Baseline | 0 | MMSE, MoCA, SUS, GR session |
| Month 1 | 4 | MMSE, GR session, adherence review |
| Month 3 | 12 | MMSE, MoCA, GR session, SUS, caregiver survey |
| Month 6 | 24 | MMSE, MoCA, GR session, SUS, caregiver survey, exit interview |

### 5.4 Standardized Assessments

**Mini-Mental State Examination (MMSE):**
- Administered by trained clinical assessor
- Scored 0-30 per standard protocol
- Domains: orientation, registration, attention/calculation, recall, language

**Montreal Cognitive Assessment (MoCA):**
- Administered by certified MoCA rater
- Scored 0-30 per standard protocol
- Domains: visuospatial/executive, naming, memory, attention, language, abstraction, orientation

**System Usability Scale (SUS):**
- 10-item questionnaire administered to participant and caregiver
- Scored 0-100

## 6. Endpoints

### 6.1 Primary Endpoint

Pearson correlation coefficient between Gentle Reminder composite cognitive score (0-100) and MMSE total score at Month 6.

**Success criterion:** r >= 0.70 (strong positive correlation)

### 6.2 Secondary Endpoints

| Endpoint | Metric | Success Criterion |
|----------|--------|-------------------|
| Domain correlation | Pearson r per domain vs. MMSE/MoCA subscales | r >= 0.60 for at least 4 of 6 domains |
| Decline detection sensitivity | Sensitivity for detecting >= 3-point MMSE decline | >= 80% sensitivity |
| Decline detection specificity | Specificity for non-decliners | >= 70% specificity |
| Medication adherence | Percentage of acknowledged reminders | >= 75% mean adherence |
| Caregiver satisfaction | Likert scale survey | >= 4.0/5.0 mean score |
| System usability | SUS score | >= 68 (above average) |
| Alert latency | Time from trigger to caregiver notification | p95 < 30 seconds |

## 7. Statistical Analysis Plan

### 7.1 Primary Analysis

- Pearson correlation with 95% confidence interval
- Bland-Altman analysis to assess agreement between Gentle Reminder scores (normalized to 0-30 scale) and MMSE
- ICC (Intraclass Correlation Coefficient) for test-retest reliability

### 7.2 Secondary Analyses

- Spearman correlation for per-domain comparisons
- Receiver Operating Characteristic (ROC) analysis for decline detection (sensitivity/specificity)
- Paired t-test for change in MMSE vs. change in Gentle Reminder score
- Mixed-effects model for longitudinal trajectory analysis
- Descriptive statistics for adherence and usability

### 7.3 Missing Data

- Primary analysis: complete case analysis
- Sensitivity analysis: multiple imputation for missing assessment data
- Participants with < 50% exercise completion rate analyzed separately

## 8. Data Management

- All study data stored in HIPAA-compliant research database
- Gentle Reminder usage data collected automatically via the platform
- Clinical assessment data entered via electronic Case Report Forms (eCRF)
- Data monitored for completeness and quality at each site visit
- Participant identifiers stored separately from study data (double-coded)

## 9. Safety Monitoring

- Adverse events reviewed monthly by study coordinator
- Data Safety Monitoring Board (DSMB) reviews safety data at Month 3
- Stopping rules: study halted if >= 3 serious adverse events related to device use
- All device-related complaints reported to sponsor and tracked in QMS

## 10. Ethical Considerations

- IRB approval required at each site before enrollment
- Written informed consent from participant or legally authorized representative
- Assent obtained from participants who lack full decision-making capacity
- Right to withdraw at any time without impact on clinical care
- Data privacy in accordance with HIPAA, 45 CFR Part 46, and applicable state laws

## 11. Study Timeline

| Milestone | Target Date |
|-----------|-------------|
| Protocol finalization | Q2 2026 |
| IRB submissions | Q3 2026 |
| Site activation | Q4 2026 |
| First participant enrolled | Q4 2026 |
| Enrollment complete (200 participants) | Q2 2027 |
| Last participant last visit | Q4 2027 |
| Database lock | Q1 2028 |
| Statistical analysis complete | Q1 2028 |
| Clinical study report | Q2 2028 |

## 12. Document References

| Document | Location |
|----------|----------|
| Indications for Use | `docs/labeling/indications-for-use.md` |
| Algorithm Transparency | `docs/algorithm-transparency/cognitive-scoring.md` |
| Risk Management Plan | `docs/iso-14971/risk-management-plan.md` |
