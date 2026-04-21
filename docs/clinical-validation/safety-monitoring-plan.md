# Safety Monitoring Plan

**Document ID:** SMP-001
**Version:** 1.0
**Effective Date:** 2026-04-06
**Companion to:** `study-protocol.md` (CVP-001)
**Regulatory basis:** 21 CFR 812.150, ICH-GCP E6(R2) §5.17, FDA MedDevice Vigilance, ISO 14971:2019

---

## 1. PURPOSE

This plan defines how **adverse events (AEs)**, **serious adverse events (SAEs)**, and **device complaints** are identified, classified, reported, reviewed, and tracked during the Gentle Reminder Cognitive Validation Study (CVP-001). It is designed to satisfy:

- FDA requirements for Significant Risk (SR) / Non-Significant Risk (NSR) device studies
- IRB continuing-review obligations
- ISO 14971 post-market surveillance linkage
- ICH-GCP E6(R2) safety reporting

**Risk classification of the study:** This study is classified as **Non-Significant Risk (NSR)** under 21 CFR 812.3(m) because the Gentle Reminder platform is a software application running on commercial off-the-shelf tablets. It does not implant or penetrate tissue, does not support or sustain life, and is not of substantial importance in diagnosing/curing/treating/preventing disease such that failure would present a potential for serious risk to health. NSR classification is subject to IRB concurrence.

## 2. DEFINITIONS

### 2.1 Adverse Event (AE)

Any untoward medical occurrence in a study participant, whether or not causally related to the investigational device. An AE does NOT need to be:
- Unexpected
- Related to the device
- Serious

### 2.2 Serious Adverse Event (SAE)

An AE is serious if it results in any of:
- **Death**
- **Life-threatening** condition (immediate risk of death)
- **Inpatient hospitalization** or prolongation of existing hospitalization
- **Persistent or significant disability or incapacity**
- **Congenital anomaly** or birth defect
- **Important medical event** requiring medical intervention to prevent one of the above

### 2.3 Device-Related Event

An AE where the investigator assesses causal relationship to the device as:

| Relatedness | Definition |
|-------------|------------|
| `Not related` | Clearly due to other causes |
| `Unlikely related` | Alternate explanation more plausible |
| `Possibly related` | Device contribution cannot be ruled out |
| `Probably related` | Temporal + mechanistic evidence supports device contribution |
| `Definitely related` | Clear causal chain established |

Events with relatedness ≥ `Possibly related` are reported to the Sponsor for post-market surveillance integration (§8).

### 2.4 Unanticipated Adverse Device Effect (UADE)

Any serious adverse effect on health or safety, any life-threatening problem or death caused by or associated with the device, if that effect, problem, or death was not previously identified in nature, severity, or degree of incidence in the investigational plan, OR any other unanticipated serious problem associated with the device that relates to the rights, safety, or welfare of subjects. *(21 CFR 812.3(s))*

### 2.5 Device Complaint

Any written, electronic, or oral communication alleging deficiencies related to the identity, quality, durability, reliability, safety, effectiveness, or performance of the device. Complaints are tracked in the Gentle Reminder QMS complaint-handling system regardless of whether an AE is associated.

## 3. IDENTIFICATION AND CAPTURE

### 3.1 At study visits

At each study visit (Baseline, Month 1, Month 3, Month 6), the Study Coordinator asks:

> "Since your last visit, have you had any new health issues, changes in how you feel, changes in your medications, or times when you needed to go to a doctor or emergency room?"

All affirmative answers are entered on the **Adverse Event Log** in the eCRF.

### 3.2 Between visits

- **Caregiver-reported events:** Caregivers may call the site 24-hour line ([SITE AE LINE]) at any time. Site Coordinator returns call within 24 hours, logs event, classifies severity.
- **App-flagged anomalies:** Platform alerts site coordinator if (a) session completion drops >50% from prior 2-week baseline, (b) caregiver triggers ≥3 alerts within 48h, or (c) participant does not open app for 14 consecutive days. Coordinator contacts participant + caregiver to rule out health issues.
- **Medical record review:** At each visit, coordinator reviews participant's EHR (where accessible) for any ED visits or hospitalizations since last study contact.

## 4. SEVERITY CLASSIFICATION

Per CTCAE v5.0 (Common Terminology Criteria for Adverse Events):

| Grade | Definition |
|-------|------------|
| Grade 1 | Mild; asymptomatic or mild symptoms; clinical observation only |
| Grade 2 | Moderate; minimal / local / non-invasive intervention indicated; limits instrumental ADLs |
| Grade 3 | Severe or medically significant but not immediately life-threatening; hospitalization indicated; limits self-care ADLs |
| Grade 4 | Life-threatening; urgent intervention indicated |
| Grade 5 | Death related to AE |

## 5. REPORTING TIMELINES

| Event type | Report to Sponsor | Report to IRB | Report to FDA |
|-----------|-------------------|---------------|---------------|
| Grade 1 AE | Quarterly (aggregate) | Annual continuing review | — |
| Grade 2 AE | Quarterly (aggregate) | Annual continuing review | — |
| Grade 3 AE (non-serious) | Within 5 business days | Annual continuing review | — |
| SAE (Grade 3+ serious) | Within 24 hours | Within 10 business days | Per applicable IDE reporting obligations |
| Death | Within 24 hours | Within 7 calendar days | Per applicable IDE reporting obligations |
| UADE | Within 10 working days | Within 10 working days | Within 10 working days (PI obligation per 21 CFR 812.150(a)(1)) |
| Device complaint (no AE) | Within 10 business days | Annual continuing review | MDR per 21 CFR 803 if applicable post-market |

**Source of truth:** §6 reporting forms. All reporting timestamps audit-logged per DMP-001 §5.

## 6. REPORTING FORMS

- **Adverse Event Form** — eCRF form capturing: event term (MedDRA preferred), onset date, resolution date, severity (CTCAE grade), seriousness flag, device relatedness, action taken (none / concomitant medication / hospitalization / device discontinued / study withdrawal), outcome (recovered / recovering / not recovered / fatal / unknown).
- **SAE Form** — extended AE form with narrative, concomitant medications, relevant medical history, hospital discharge summary (if applicable).
- **UADE Notification** — PI-signed letter to Sponsor, IRB, and FDA (where applicable) with event description, root cause analysis status, proposed corrective action.
- **Device Complaint Form** — separate form in QMS for complaints not meeting AE criteria (e.g., app crash without clinical consequence).

## 7. DATA SAFETY MONITORING BOARD (DSMB)

### 7.1 Composition

Three-member independent DSMB:
- DSMB Chair: practicing geriatric neurologist not affiliated with any study site
- Biostatistician not affiliated with sponsor or site
- Bioethicist or patient advocate with dementia-research experience

DSMB members sign conflict-of-interest attestations annually.

### 7.2 Charter

- Written DSMB Charter signed by all three members and the PI before first enrollment.
- Meetings: **kick-off** (pre-enrollment), **Month 3 safety review**, **ad-hoc** upon any SAE or UADE, **close-out** review.
- Quorum: 3 of 3 (all members).
- Unblinded access: study is observational (no blinding), so DSMB reviews all data.
- Reports to: PI (primary), Sponsor, IRB.

### 7.3 Stopping rules

The DSMB recommends **study suspension** if any of:

- **≥ 3 device-related SAEs** accumulate at any time
- **Any device-related death** (even one)
- Any **UADE** prior to PI + Sponsor + IRB review and mitigation plan
- Cumulative **Grade 3 device-related AE rate exceeds 5%** of enrolled participants
- **Protocol deviation rate > 20%** across any single site indicating systemic quality failure

Final authority to suspend or terminate rests with the PI and Sponsor; DSMB provides recommendation.

## 8. LINKAGE TO POST-MARKET SURVEILLANCE

Because Gentle Reminder operates a commercial platform in parallel with this study, all device-related events (relatedness ≥ `Possibly related`) are:

1. De-identified per DMP-001 §9
2. Transmitted to Gentle Reminder's **ISO 14971 Risk Management File** (`docs/iso-14971/`) for re-evaluation of residual risk acceptability
3. Routed into the QMS complaint-handling system for CAPA (Corrective and Preventive Action) consideration
4. Integrated into the annual **Post-Market Surveillance Report**

This linkage ensures that study findings informing safety profile updates automatically propagate to commercial risk management, supporting future regulatory submissions (510(k)).

## 9. PARTICIPANT WITHDRAWAL ON SAFETY GROUNDS

A participant is **withdrawn from active study procedures** (but data already collected is retained) if:

- Any device-related Grade 3+ AE
- Participant or LAR requests withdrawal
- PI determines continued participation is unsafe
- Participant develops exclusion-criteria condition during study (e.g., severe dementia progression to MMSE < 10)

Withdrawal is documented with:
- Date
- Reason category (controlled vocabulary)
- Free-text narrative
- PI signature
- Participant / LAR acknowledgment when feasible

## 10. ANNUAL SAFETY REPORT

The PI prepares an **Annual Progress Report** to the IRB including:

- Enrollment count vs. target
- AE/SAE counts by grade and relatedness
- Device complaints from the study cohort
- Protocol deviations
- Changes to risk-benefit profile
- DSMB meeting summaries
- Any suspensions or terminations

## 11. TRAINING

All site personnel who interact with participants or enter study data complete:

- **Human Subjects Research training** (CITI or equivalent, current within 3 years)
- **ICH-GCP training** (CITI or equivalent, current within 3 years)
- **Protocol-specific training** by PI (documented attendance)
- **This SMP walkthrough** by site PI or study coordinator (documented attendance)
- **Reporting escalation drill** (tabletop exercise) within first 30 days

## 12. DOCUMENT REFERENCES

| Document | Location |
|----------|----------|
| Clinical Validation Study Protocol (CVP-001) | `docs/clinical-validation/study-protocol.md` |
| Informed Consent Form (ICF-001) | `docs/clinical-validation/informed-consent-template.md` |
| Data Management Plan (DMP-001) | `docs/clinical-validation/data-management-plan.md` |
| Risk Management Plan (RMP-001) | `docs/iso-14971/risk-management-plan.md` |
| Post-Market Surveillance Plan | `docs/iso-14971/post-market-surveillance.md` (if published) |

---

*This Safety Monitoring Plan supports 21 CFR Part 812 (IDE) obligations should the study be submitted as clinical evidence in a future 510(k) or De Novo filing. If the IRB classifies the study as Significant Risk, an IDE application will be filed with the FDA before enrollment begins.*
