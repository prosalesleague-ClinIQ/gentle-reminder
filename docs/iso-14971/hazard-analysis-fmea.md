# Hazard Analysis -- Failure Mode and Effects Analysis (FMEA)

**Document ID:** HA-001
**ISO 14971 Reference:** Clause 5 - Risk Analysis
**Version:** 1.0
**Effective Date:** 2026-04-06
**Author:** Regulatory Affairs

---

## 1. Purpose

This document presents the Failure Mode and Effects Analysis (FMEA) for the Gentle Reminder cognitive health monitoring platform. Each identified hazard is evaluated for severity, probability of occurrence, and detectability to determine a Risk Priority Number (RPN) and appropriate mitigation strategy.

## 2. Scoring Criteria

### Severity (S) -- 1 to 5

| Score | Level | Description |
|-------|-------|-------------|
| 1 | Negligible | No noticeable effect on patient or caregiver |
| 2 | Minor | Temporary inconvenience, no clinical impact |
| 3 | Moderate | Could delay appropriate clinical intervention |
| 4 | Serious | Could result in harm requiring medical attention |
| 5 | Critical | Could result in permanent harm or life-threatening situation |

### Probability of Occurrence (O) -- 1 to 5

| Score | Level | Description |
|-------|-------|-------------|
| 1 | Improbable | < 1 in 1,000,000 uses |
| 2 | Remote | 1 in 100,000 uses |
| 3 | Occasional | 1 in 10,000 uses |
| 4 | Probable | 1 in 1,000 uses |
| 5 | Frequent | 1 in 100 uses |

### Detectability (D) -- 1 to 5

| Score | Level | Description |
|-------|-------|-------------|
| 1 | Certain | Automated detection with immediate alert |
| 2 | High | Detected within hours through monitoring |
| 3 | Moderate | Detected within days through review |
| 4 | Low | Requires specific investigation to detect |
| 5 | Undetectable | Cannot be detected before reaching patient/caregiver |

### Risk Priority Number

**RPN = S x O x D** (Range: 1-125)

| RPN Range | Risk Level | Action Required |
|-----------|------------|-----------------|
| 1-15 | Low | Monitor, no immediate action required |
| 16-40 | Medium | Implement risk controls, document rationale |
| 41-75 | High | Mandatory risk controls before release |
| 76-125 | Critical | Design change required, unacceptable without mitigation |

## 3. FMEA Table

### HAZ-001: Cognitive Score Miscalculation

| Field | Value |
|-------|-------|
| **Hazard ID** | HAZ-001 |
| **Failure Mode** | Cognitive scoring algorithm produces inaccurate domain or overall scores |
| **Cause** | Software bug in scoring logic, rounding errors, incorrect domain mapping, SOUP defect |
| **Effect** | Clinician receives misleading cognitive trend data; could mask decline or create false alarm |
| **Severity (S)** | 3 (Moderate -- delayed clinical intervention) |
| **Occurrence (O)** | 2 (Remote -- deterministic logic with extensive test coverage) |
| **Detectability (D)** | 2 (High -- known-answer regression tests, post-market accuracy monitoring) |
| **RPN** | **12 (Low)** |
| **Mitigation** | (1) Pure deterministic scoring functions with no randomness. (2) Known-answer regression test suite with clinically validated test vectors. (3) Post-market algorithm accuracy tracking comparing predicted vs. clinical outcomes. (4) Algorithm version tracking for traceability. |
| **Residual Risk** | Acceptable |

### HAZ-002: Medication Reminder Failure

| Field | Value |
|-------|-------|
| **Hazard ID** | HAZ-002 |
| **Failure Mode** | Medication reminder notification is not delivered to the patient |
| **Cause** | Push notification service failure, device offline, app killed by OS, notification permissions revoked |
| **Effect** | Patient misses medication dose; could lead to symptom worsening or medical event |
| **Severity (S)** | 4 (Serious -- missed medication could require medical attention) |
| **Occurrence (O)** | 3 (Occasional -- push notification infrastructure is not 100% reliable) |
| **Detectability (D)** | 2 (High -- unacknowledged reminders trigger escalation after timeout) |
| **RPN** | **24 (Medium)** |
| **Mitigation** | (1) Escalation to caregiver after configurable timeout (default 30 min). (2) Multiple notification channels (push, SMS, email). (3) Local alarm fallback on device when network is unavailable. (4) Delivery confirmation tracking with retry logic. (5) Clear labeling that system supplements, not replaces, clinical medication management. |
| **Residual Risk** | ALARP -- further reduction impracticable given platform notification limitations |

### HAZ-003: Fall Detection False Negative

| Field | Value |
|-------|-------|
| **Hazard ID** | HAZ-003 |
| **Failure Mode** | System fails to detect an actual patient fall |
| **Cause** | Wearable device not worn, sensor malfunction, algorithm threshold too high, atypical fall pattern |
| **Effect** | Patient lies unattended after fall; delayed emergency response |
| **Severity (S)** | 4 (Serious -- delayed response to fall can worsen outcomes) |
| **Occurrence (O)** | 3 (Occasional -- fall detection algorithms have known limitations) |
| **Detectability (D)** | 4 (Low -- no secondary detection if wearable misses the event) |
| **RPN** | **48 (High)** |
| **Mitigation** | (1) Clear labeling that fall detection is supplementary, not a standalone safety system. (2) Regular check-in prompts when wearable data is absent for extended periods. (3) Caregiver education that system does not replace personal monitoring. (4) Algorithm tuning toward sensitivity (accepting higher false positive rate). (5) Wearable connectivity monitoring with alerts when device is disconnected. |
| **Residual Risk** | ALARP -- inherent limitation of wearable-based detection |

### HAZ-004: Fall Detection False Positive

| Field | Value |
|-------|-------|
| **Hazard ID** | HAZ-004 |
| **Failure Mode** | System generates fall alert when no fall occurred |
| **Cause** | Vigorous movement misclassified, sensor noise, algorithm sensitivity too high |
| **Effect** | Unnecessary caregiver alarm; potential caregiver fatigue leading to ignored future alerts |
| **Severity (S)** | 2 (Minor -- unnecessary worry, no physical harm) |
| **Occurrence (O)** | 4 (Probable -- common with high-sensitivity fall detection) |
| **Detectability (D)** | 1 (Certain -- patient can dismiss false alert within 60 seconds) |
| **RPN** | **8 (Low)** |
| **Mitigation** | (1) 60-second patient dismissal window before caregiver notification. (2) Machine learning model refinement with false positive feedback. (3) Rate limiting of repeated alerts from same movement pattern. (4) Caregiver education on expected false positive rate. |
| **Residual Risk** | Acceptable |

### HAZ-005: Patient Data Breach

| Field | Value |
|-------|-------|
| **Hazard ID** | HAZ-005 |
| **Failure Mode** | Unauthorized access to patient health information (PHI) |
| **Cause** | Authentication bypass, SQL injection, API vulnerability, insider threat, stolen credentials |
| **Effect** | HIPAA violation, patient privacy harm, loss of trust |
| **Severity (S)** | 4 (Serious -- privacy violation with potential for identity theft or discrimination) |
| **Occurrence (O)** | 2 (Remote -- multiple security layers in place) |
| **Detectability (D)** | 2 (High -- audit logging, intrusion detection, anomaly monitoring) |
| **RPN** | **16 (Medium)** |
| **Mitigation** | (1) AES-256 encryption at rest, TLS 1.3 in transit. (2) RBAC with tenant isolation at database layer. (3) Input validation and parameterized queries via ORM. (4) Comprehensive audit logging of all PHI access. (5) Regular penetration testing and vulnerability scanning. (6) Rate limiting and brute-force protection. (7) SBOM maintenance and dependency vulnerability monitoring. |
| **Residual Risk** | ALARP |

### HAZ-006: Alert Delivery Failure

| Field | Value |
|-------|-------|
| **Hazard ID** | HAZ-006 |
| **Failure Mode** | Critical alert (fall, distress, medication escalation) fails to reach caregiver |
| **Cause** | Notification service outage, caregiver device offline, incorrect contact information, network failure |
| **Effect** | Caregiver unaware of patient emergency; delayed response |
| **Severity (S)** | 4 (Serious -- delayed emergency response) |
| **Occurrence (O)** | 2 (Remote -- multiple delivery channels with retry) |
| **Detectability (D)** | 1 (Certain -- delivery confirmation tracking with automated re-routing) |
| **RPN** | **8 (Low)** |
| **Mitigation** | (1) Multi-channel delivery (push, SMS, email) with automatic failover. (2) Delivery confirmation tracking with retry logic (exponential backoff). (3) Escalation to secondary caregiver if primary does not acknowledge. (4) Alert delivery latency monitoring in post-market surveillance. (5) 30-second delivery SLA with automated alerting on violations. |
| **Residual Risk** | Acceptable |

### HAZ-007: Algorithm Drift

| Field | Value |
|-------|-------|
| **Hazard ID** | HAZ-007 |
| **Failure Mode** | Cognitive scoring algorithm gradually produces less accurate results over time |
| **Cause** | Changes in patient population characteristics, data distribution shift, SOUP updates affecting scoring dependencies |
| **Effect** | Systematic under- or over-estimation of cognitive function across patient population |
| **Severity (S)** | 3 (Moderate -- systematic bias could mislead clinical decisions) |
| **Occurrence (O)** | 2 (Remote -- deterministic algorithms are inherently stable, but population drift possible) |
| **Detectability (D)** | 2 (High -- automated drift detection in post-market surveillance) |
| **RPN** | **12 (Low)** |
| **Mitigation** | (1) Automated algorithm drift detection comparing predicted vs. actual outcomes over rolling windows. (2) Algorithm version tracking with immutable deployment records. (3) Quarterly review of algorithm performance metrics. (4) Adaptive difficulty engine maintains self-correcting feedback loop. (5) Clinical validation study protocol for ongoing accuracy monitoring. |
| **Residual Risk** | Acceptable |

### HAZ-008: Unauthorized Access to Clinical Controls

| Field | Value |
|-------|-------|
| **Hazard ID** | HAZ-008 |
| **Failure Mode** | Non-authorized user gains access to clinical-level functions (score adjustment, patient management, reporting) |
| **Cause** | Privilege escalation vulnerability, RBAC misconfiguration, session hijacking, social engineering |
| **Effect** | Manipulation of patient data, unauthorized clinical decisions, data integrity compromise |
| **Severity (S)** | 4 (Serious -- could lead to incorrect clinical actions based on manipulated data) |
| **Occurrence (O)** | 2 (Remote -- RBAC enforced at middleware and database layers) |
| **Detectability (D)** | 2 (High -- audit logging captures all role-based actions, anomaly detection) |
| **RPN** | **16 (Medium)** |
| **Mitigation** | (1) RBAC enforced at API middleware and database query layers (defense in depth). (2) JWT tokens with short expiry (15 min) and refresh token rotation. (3) All privileged actions logged with user identity, timestamp, and action details. (4) Session timeout after 30 minutes of inactivity. (5) Multi-factor authentication for clinical and admin roles. (6) Regular access review and role audit. |
| **Residual Risk** | Acceptable |

## 4. Risk Summary

| Risk Level | Count | Hazard IDs |
|------------|-------|------------|
| Low (1-15) | 4 | HAZ-001, HAZ-004, HAZ-006, HAZ-007 |
| Medium (16-40) | 3 | HAZ-002, HAZ-005, HAZ-008 |
| High (41-75) | 1 | HAZ-003 |
| Critical (76-125) | 0 | -- |

All risks have been reduced to Acceptable or ALARP with documented mitigations. The highest-RPN hazard (HAZ-003: Fall Detection False Negative, RPN=48) has been classified as ALARP with clear labeling that the system is supplementary to personal monitoring.

## 5. Overall Residual Risk Assessment

Considering the totality of residual risks and the clinical benefit of continuous cognitive monitoring for elderly patients with mild-to-moderate dementia, the overall residual risk of the Gentle Reminder system is **acceptable**. The system provides significant benefit through early cognitive decline detection, medication adherence support, and caregiver coordination that outweighs the residual risks documented above.
