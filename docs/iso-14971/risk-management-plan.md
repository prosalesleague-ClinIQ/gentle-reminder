# Risk Management Plan

**Document ID:** RMP-001
**ISO 14971 Reference:** Clause 3 - Risk Management Plan
**Version:** 1.0
**Effective Date:** 2026-04-06
**Author:** Regulatory Affairs

---

## 1. Purpose

This Risk Management Plan defines the systematic approach to identifying, evaluating, controlling, and monitoring risks associated with the Gentle Reminder cognitive health monitoring platform throughout its entire lifecycle, in compliance with ISO 14971:2019.

## 2. Scope

This plan covers all hazards related to:

- Cognitive scoring algorithms and exercise generation
- Medication reminder delivery and escalation
- Fall detection and emergency alerting
- Patient health data management and exchange
- Caregiver notification systems
- Clinical decision support information

## 3. Risk Management Activities

### 3.1 Activity Schedule

| Activity | Timing | Responsible |
|----------|--------|-------------|
| Hazard identification | Design phase, each major release | Risk Management Team |
| Risk estimation | After hazard identification | Risk Management Team |
| Risk evaluation | After risk estimation | Risk Management Team |
| Risk control implementation | During development | Development Team |
| Risk control verification | During verification phase | Quality Assurance |
| Residual risk evaluation | Pre-release | Risk Management Team |
| Post-market risk monitoring | Continuous | Post-Market Surveillance |

### 3.2 Risk Management Team

| Role | Responsibility |
|------|---------------|
| Risk Manager | Oversees risk management process, final risk acceptance |
| Clinical Advisor | Evaluates clinical significance of identified hazards |
| Software Lead | Assesses technical feasibility of risk controls |
| Quality Manager | Verifies risk control implementation and effectiveness |
| Cybersecurity Lead | Evaluates security-related risks |

## 4. Risk Acceptability Matrix

### 4.1 Severity Scale

| Level | Rating | Description | Examples |
|-------|--------|-------------|----------|
| S1 | Negligible | Inconvenience or temporary discomfort | Exercise displays incorrectly, cosmetic UI issue |
| S2 | Minor | Temporary minor harm, reversible | Unnecessary caregiver worry from false positive alert |
| S3 | Serious | Injury requiring medical intervention | Delayed response to a real fall due to system failure |
| S4 | Critical | Permanent impairment or life-threatening | Missed critical medication interaction warning |
| S5 | Catastrophic | Death | Not applicable for this Class B device |

### 4.2 Probability Scale

| Level | Rating | Description | Approximate Rate |
|-------|--------|-------------|-----------------|
| P1 | Improbable | Extremely unlikely to occur | < 1 in 1,000,000 uses |
| P2 | Remote | Could occur but unlikely | 1 in 100,000 uses |
| P3 | Occasional | May occur during device lifetime | 1 in 10,000 uses |
| P4 | Probable | Will likely occur during device lifetime | 1 in 1,000 uses |
| P5 | Frequent | Expected to occur regularly | 1 in 100 uses |

### 4.3 Risk Acceptability Matrix

| | P1 | P2 | P3 | P4 | P5 |
|--|----|----|----|----|-----|
| **S5** | ALARP | Unacceptable | Unacceptable | Unacceptable | Unacceptable |
| **S4** | Acceptable | ALARP | Unacceptable | Unacceptable | Unacceptable |
| **S3** | Acceptable | Acceptable | ALARP | Unacceptable | Unacceptable |
| **S2** | Acceptable | Acceptable | Acceptable | ALARP | Unacceptable |
| **S1** | Acceptable | Acceptable | Acceptable | Acceptable | ALARP |

**ALARP** = As Low As Reasonably Practicable. Risk is tolerable only if further reduction is impracticable or disproportionate to the improvement gained.

## 5. Risk Control Option Order of Preference

Risk controls shall be applied in the following order of preference (ISO 14971 Clause 7):

1. **Inherent safety by design** -- Eliminate the hazard entirely through design choices
2. **Protective measures in the device** -- Built-in technical controls (alerts, validation, redundancy)
3. **Information for safety** -- Labeling, warnings, user training, and documentation

## 6. Residual Risk Evaluation

After all risk controls are implemented and verified, residual risk is evaluated:

- Each individual risk must fall within the Acceptable or ALARP region of the risk matrix
- For ALARP risks, documented justification must demonstrate that further reduction is impracticable
- The overall residual risk of the device must be acceptable when considering the medical benefit
- The benefit-risk analysis considers the intended patient population (elderly with mild-to-moderate dementia) and the clinical value of continuous cognitive monitoring

## 7. Post-Market Risk Monitoring

Risks are monitored continuously after release through:

- **Algorithm accuracy tracking:** Predicted vs. actual clinical outcomes
- **Alert response time monitoring:** Time from event detection to caregiver notification
- **Complaint analysis:** All user complaints reviewed for risk relevance
- **Adverse event reporting:** Procedures for reporting to FDA per 21 CFR Part 803
- **Algorithm drift detection:** Statistical monitoring for scoring accuracy degradation
- **Periodic risk review:** Quarterly review of all risk data and update of hazard analysis

## 8. Risk Management File

The complete risk management file consists of:

| Document | Location |
|----------|----------|
| Risk Management Plan | This document |
| Hazard Analysis (FMEA) | `docs/iso-14971/hazard-analysis-fmea.md` |
| Risk Control Verification | Test reports in CI/CD |
| Post-Market Surveillance Data | `services/api/src/services/postMarketSurveillance.ts` |
| Residual Risk Evaluation | Appendix to this document (updated per release) |

## 9. Review and Approval

This Risk Management Plan is reviewed:
- At least annually
- Upon any significant design change
- When new hazards are identified through post-market surveillance
- When regulatory requirements change

Approval requires sign-off from the Risk Manager, Clinical Advisor, and Quality Manager.
