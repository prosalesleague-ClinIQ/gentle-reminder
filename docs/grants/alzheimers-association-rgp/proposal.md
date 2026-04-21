# RESEARCH PLAN — Alzheimer's Association AARG-NTF

**Title:** Real-World Deployment and Caregiver Impact of a Dementia-Safe Cognitive Assessment Platform

**Principal Investigator:** [Academic PI Name], [Title], [Institution]
**Industry Co-Investigator:** Christo Mac, Founder & CEO/COO, Gentle Reminder
**Award Mechanism:** AARG-NTF (Non-Traditional Focus)

---

## A. SIGNIFICANCE

### A.1 The Clinical Problem in Memory Care Settings

An estimated 6.9 million Americans age 65+ live with Alzheimer's disease in 2024, with 7 million caregivers providing 18.4 billion hours of unpaid care annually (Alzheimer's Association, 2024 Facts and Figures). Approximately 900,000 dementia patients reside in assisted living or memory care facilities; another 1.3 million receive professional home care.

Within these settings, cognitive assessment serves three critical functions:
1. **Clinical monitoring:** detecting decline requiring intervention
2. **Resident engagement:** measuring and promoting cognitive activity
3. **Caregiver planning:** adjusting care plans to cognitive capacity

Yet the instruments used — MMSE, MoCA, ADAS-Cog — cause documented distress in dementia populations (Clare 2003, Bahar-Fuchs 2013). In assisted living settings, 30-50% of residents resist or refuse these assessments, creating systematic gaps in clinical monitoring and care planning. Families report that post-assessment visits often have increased agitation or withdrawal.

### A.2 The Caregiver Burden Problem

The Zarit Burden Interview (ZBI) and related caregiver burden measures consistently show that:
- 40-60% of primary caregivers meet criteria for "high burden"
- Caregiver depression rates are 40-50%
- Burden correlates with premature facility placement, hospitalization, and caregiver mortality

Technology interventions have shown modest ZBI reductions (5-15%) in isolated studies, but most fail at deployment scale. We hypothesize that integrated platforms reducing BOTH patient-facing distress AND providing real-time caregiver visibility can achieve clinically meaningful (>20%) burden reduction.

### A.3 Why Alzheimer's Association Support Is Critical

This research bridges technology development and real-world patient/caregiver outcomes — a gap that traditional NIH funding (R01, SBIR) often cannot fill because:
- NIH R01 requires academic-only PIs; we are academic-industry hybrid
- NIH SBIR focuses on commercialization, not patient-centered outcomes
- Pharmaceutical funding ties research to drug development

Alzheimer's Association's mission — to accelerate "research with direct patient and caregiver benefit" — makes AARG-NTF the ideal fit.

---

## B. INNOVATION

### B.1 The Platform

Gentle Reminder is a clinical-grade software platform comprising 23 patent-pending innovations:
- **Three-state positive-only cognitive assessment system** (Patent GR-01) — architecturally prevents negative feedback delivery to the patient while preserving granular clinician-facing data
- **Asymmetric adaptive difficulty** (Patent GR-02) — targets 70-85% success zone; drops after 2 failures but requires 4 successes to advance
- **Dementia-adapted spaced repetition** (Patent GR-03) — modified SM-2 with 5 dementia-specific adaptations including 7-day max interval and no-reset-on-failure
- **Multimodal cognitive state classifier** (Patent GR-04) — 7-state classification from speech, behavior, biometric signals
- **Composite digital biomarker engine** (Patent GR-07) — 5 analyzers with automatic weight redistribution when data is sparse

### B.2 Platform Maturity (Preliminary Data)

- **53,000+ lines of production code** across 5 deployed applications
- **10-language support** with right-to-left (Hebrew, Arabic) capability
- **FHIR R4 integration** for electronic health record interoperability
- **Full FDA SaMD documentation**: IEC 62304, ISO 14971, ISO 13485 QMS, 21 CFR Part 11, STRIDE cybersecurity
- **510(k) pathway identified**: predicate K201738 (Linus Health Digital Clock and Recall)

### B.3 Deployed in Real-World Facility Settings

[Customize with actual pilot data when available]. Three memory care facilities in the [region] have agreed to participate in platform deployment for this study.

### B.4 Innovation Summary

Most cognitive assessment research focuses on novel algorithms or novel biomarkers. We are validating a deployed platform with real caregivers and real patients in real memory care facilities. This pragmatic, real-world focus is what makes the work non-traditional within AARG-NTF mechanism.

---

## C. APPROACH

### C.1 Overall Strategy

This 1-year study validates Gentle Reminder in a pragmatic real-world deployment across 3 memory care facilities (N=150 patient-caregiver dyads). The primary endpoint is caregiver burden reduction; secondary endpoints include patient engagement, clinician-reported utility, and facility-level census retention.

### C.2 Specific Aim 1 — Caregiver Burden Reduction

**Hypothesis:** Primary caregivers of patients using Gentle Reminder for 6 months show a ≥20% reduction in Zarit Burden Interview (ZBI) scores vs. control (usual care) caregivers.

**Design:**
- 150 patient-caregiver dyads enrolled across 3 memory care facilities
- Cluster-randomized by facility (2 intervention, 1 control — adjustable based on facility preference)
- Intervention: Patient receives Gentle Reminder on facility iPad + caregiver receives daily app summary
- Control: usual care

**Outcome Measurement:**
- Primary: ZBI at baseline, 3 months, 6 months (paired t-test, within-intervention; independent t-test vs. control)
- Secondary: Caregiver-reported Quality of Life (WHOQOL-BREF), depression screening (PHQ-9)

### C.3 Specific Aim 2 — Patient Engagement and Clinical Utility

**Hypothesis:** Gentle Reminder sessions achieve ≥80% completion rates vs. ≤60% baseline for standard assessments in the same population.

**Design:**
- All 100 intervention-arm patients complete both Gentle Reminder sessions AND monthly MMSE during the 6-month period
- Clinicians rate each session for clinical utility (7-point Likert)
- Session completion + patient-reported anxiety (STAI-6 post-session) tracked

### C.4 Specific Aim 3 — Facility-Level Operational Impact

**Hypothesis:** Intervention facilities show ≥10% improvement in 6-month census retention and ≥15% reduction in caregiver-reported unmet needs.

**Design:**
- Facility KPIs: census retention, family satisfaction (quarterly survey), caregiver-requested intervention frequency
- Compared intervention vs. control facility over 6-month intervention + 6-month follow-up

### C.5 Analytical Plan

Primary analysis: paired t-tests for within-arm ZBI change; independent t-tests for between-arm comparison.

Power calculation: N=150 dyads provides 90% power to detect a 20% ZBI reduction at α=0.05 assuming baseline ZBI SD = 11.5 (from published benchmarks).

Sensitivity analyses: (a) intent-to-treat vs. per-protocol, (b) stratification by patient baseline MMSE.

### C.6 Timeline

| Months | Activity |
|-------:|---------|
| 1-2 | IRB approval + facility activation |
| 3-6 | Enrollment (150 dyads) |
| 4-12 | Intervention + monthly follow-ups |
| 13-15 | Final data collection + analysis |
| 16-18 | Manuscript preparation + publication |

### C.7 Risks and Mitigation

**Risk:** Enrollment at a single facility insufficient.
**Mitigation:** 3 facilities identified; can activate 5th if needed.

**Risk:** Control arm caregivers request access.
**Mitigation:** Wait-list design — control receives intervention in Year 2.

**Risk:** Platform issues at facility.
**Mitigation:** Production-ready platform with 24/7 support; dedicated engineer.

---

## D. CAREGIVER + PATIENT ENGAGEMENT PLAN

Alzheimer's Association particularly values caregiver/patient engagement in research:

- Caregiver advisory board (3-5 facility caregivers) meets quarterly
- Patient voice captured through moderated focus groups at 3 months and 6 months
- All intervention modifications informed by caregiver/patient feedback
- Findings translated to plain-language summary shared with all participants

## E. DISSEMINATION

- Target journals: Alzheimer's & Dementia, Journal of the American Medical Directors Association (JAMDA), Gerontologist
- Conference: Alzheimer's Association International Conference (AAIC)
- Plain-language summaries for facility operators and caregivers
- Alzheimer's Association network: publish findings on Alzheimer's Association research channels

## F. SIGNIFICANCE TO ALZHEIMER'S ASSOCIATION MISSION

This research directly supports the Alzheimer's Association's strategic priorities:
1. **Accelerating research with patient benefit** — concrete caregiver burden outcome
2. **Supporting non-traditional investigators** — academic-industry partnership
3. **Real-world evidence** — deployment in actual memory care facilities
4. **Caregiver support** — explicit focus on reducing burden

Upon successful completion, we will partner with the Alzheimer's Association on dissemination and potentially propose a Part the Cloud Phase 2 application for larger-scale deployment.

---

*Complete with academic PI biosketch, institutional letter of support, budget, human subjects documentation, and facilities resources before submission.*
