# Software Requirements Specification

**Document ID:** SRS-001
**IEC 62304 Reference:** Clause 5.2 - Software Requirements Analysis
**Version:** 1.0
**Effective Date:** 2026-04-06
**Author:** Regulatory Affairs

---

## 1. Purpose

This document specifies the functional, performance, safety, and security requirements for the Gentle Reminder cognitive health monitoring platform.

## 2. Functional Requirements

### 2.1 Cognitive Exercises and Scoring

| ID | Requirement | Priority | Verification |
|----|------------|----------|-------------|
| FR-001 | The system shall provide cognitive exercises across six domains: orientation, memory, attention, language, visuospatial, and executive function | Essential | Test |
| FR-002 | Each exercise shall record the prompt presented, patient answer, time taken, correctness score (0.0-1.0), and feedback type | Essential | Test |
| FR-003 | The system shall calculate per-domain scores as the mean of individual exercise scores within that domain | Essential | Test |
| FR-004 | The system shall calculate an overall cognitive score as the equally-weighted mean of active domain scores | Essential | Test |
| FR-005 | The system shall adapt exercise difficulty based on recent patient performance, targeting a 70-85% success rate | Essential | Test |
| FR-006 | The system shall detect cognitive decline trends using longitudinal score analysis across rolling windows | Essential | Test |
| FR-007 | The system shall provide gentle, non-negative feedback for every exercise response (celebrated, guided, or supported) | Essential | Test |
| FR-008 | The system shall detect fatigue signals (declining response times, increasing errors) and offer session termination | Important | Test |

### 2.2 Medication Reminders

| ID | Requirement | Priority | Verification |
|----|------------|----------|-------------|
| FR-010 | The system shall deliver medication reminders at the configured time via push notification | Essential | Test |
| FR-011 | The system shall support configurable reminder schedules (daily, twice daily, custom times) | Essential | Test |
| FR-012 | The system shall escalate unacknowledged reminders to the assigned caregiver after a configurable timeout (default: 30 minutes) | Essential | Test |
| FR-013 | The system shall maintain a medication adherence log with timestamps for each acknowledged reminder | Essential | Test |

### 2.3 Fall Detection

| ID | Requirement | Priority | Verification |
|----|------------|----------|-------------|
| FR-020 | The system shall process accelerometer data from connected wearable devices for fall detection | Essential | Test |
| FR-021 | The system shall generate a fall alert to designated caregivers when a fall event is detected | Essential | Test |
| FR-022 | The system shall allow the patient to dismiss a false positive fall alert within 60 seconds before caregiver notification | Important | Test |

### 2.4 Caregiver Alerts

| ID | Requirement | Priority | Verification |
|----|------------|----------|-------------|
| FR-030 | The system shall deliver real-time alerts to caregivers for: fall detection, missed medications, significant cognitive score decline, and patient-initiated distress signals | Essential | Test |
| FR-031 | The system shall support multiple alert channels: push notification, SMS, and email | Essential | Test |
| FR-032 | The system shall maintain an alert acknowledgment audit trail | Essential | Test |

### 2.5 FHIR Data Exchange

| ID | Requirement | Priority | Verification |
|----|------------|----------|-------------|
| FR-040 | The system shall export patient cognitive assessment data as FHIR R4 Observation resources | Essential | Test |
| FR-041 | The system shall export medication adherence data as FHIR R4 MedicationStatement resources | Essential | Test |
| FR-042 | The system shall support FHIR R4 Patient resource import for clinical integration | Essential | Test |
| FR-043 | The system shall validate all FHIR resources against R4 profiles before exchange | Essential | Test |

### 2.6 Clinical Reporting

| ID | Requirement | Priority | Verification |
|----|------------|----------|-------------|
| FR-050 | The system shall generate longitudinal cognitive trend reports for clinical review | Essential | Test |
| FR-051 | The system shall provide per-domain score breakdowns over configurable time windows | Essential | Test |
| FR-052 | The system shall flag statistically significant score changes for clinician attention | Important | Test |

## 3. Performance Requirements

| ID | Requirement | Metric | Verification |
|----|------------|--------|-------------|
| PR-001 | API response time | p95 < 200ms for standard endpoints | Load test |
| PR-002 | System availability | 99.9% uptime (excludes planned maintenance) | Monitoring |
| PR-003 | Alert delivery latency | < 30 seconds from trigger to caregiver notification | End-to-end test |
| PR-004 | Concurrent users | Support 10,000 concurrent active sessions | Load test |
| PR-005 | Exercise load time | < 2 seconds on 4G connection | Performance test |
| PR-006 | Database query time | p95 < 50ms for patient data retrieval | Benchmark |

## 4. Safety Requirements

| ID | Requirement | Rationale | Verification |
|----|------------|-----------|-------------|
| SR-001 | The system shall not lose any patient exercise result data after submission | Data loss could mask cognitive decline | Transaction integrity test |
| SR-002 | The system shall deliver critical alerts (fall, distress) within 30 seconds | Delayed alerts could result in harm from unattended falls | End-to-end timing test |
| SR-003 | The system shall maintain scoring algorithm determinism: identical inputs shall always produce identical outputs | Non-deterministic scoring could produce misleading trends | Known-answer regression tests |
| SR-004 | The system shall display clear disclaimers that cognitive scores are supplementary and not diagnostic | Misinterpretation of scores as diagnosis could delay proper evaluation | UI inspection, labeling review |
| SR-005 | The system shall detect and alert on algorithm drift exceeding configurable thresholds | Undetected drift could produce systematically inaccurate scores | Post-market surveillance monitoring |
| SR-006 | The system shall gracefully degrade when network connectivity is lost, queuing data for later synchronization | Network loss should not cause data loss or missed local reminders | Offline mode testing |

## 5. Security Requirements

| ID | Requirement | Standard | Verification |
|----|------------|----------|-------------|
| SEC-001 | All patient health information (PHI) shall be encrypted at rest using AES-256 | HIPAA | Configuration audit |
| SEC-002 | All data in transit shall be encrypted using TLS 1.2 or higher | HIPAA | Certificate and protocol verification |
| SEC-003 | The system shall enforce role-based access control (RBAC) with principle of least privilege | HIPAA | Authorization boundary tests |
| SEC-004 | The system shall maintain audit logs of all PHI access, modification, and deletion | HIPAA / 21 CFR Part 11 | Audit log verification |
| SEC-005 | User authentication shall require strong passwords (min 12 chars) and support multi-factor authentication | HIPAA | Authentication tests |
| SEC-006 | The system shall implement tenant isolation preventing cross-tenant data access | HIPAA | Isolation boundary tests |
| SEC-007 | The system shall enforce session timeout after 30 minutes of inactivity | HIPAA | Session management tests |
| SEC-008 | The system shall rate-limit authentication attempts to prevent brute-force attacks | Security best practice | Rate limit tests |
| SEC-009 | The system shall sanitize all user inputs to prevent injection attacks | OWASP | Input validation tests |
| SEC-010 | The system shall generate and maintain a Software Bill of Materials (SBOM) for all dependencies | FDA cybersecurity guidance | SBOM generation verification |

## 6. Regulatory Requirements

| ID | Requirement | Standard |
|----|------------|----------|
| REG-001 | Software development shall follow IEC 62304 lifecycle processes | IEC 62304 |
| REG-002 | Risk management shall follow ISO 14971 processes | ISO 14971 |
| REG-003 | Electronic records shall comply with 21 CFR Part 11 requirements | 21 CFR Part 11 |
| REG-004 | The system shall support post-market surveillance data collection | FDA guidance |
| REG-005 | Algorithm changes shall be documented with impact assessment and re-verification | IEC 62304 |

## 7. Traceability

All requirements are traced through the following chain:

```
Requirement (this document)
  -> Design Element (architecture-design.md)
    -> Implementation (source code module)
      -> Test Case (test suite)
        -> Test Result (CI/CD report)
```

Traceability is maintained in the requirements traceability matrix and verified during design reviews.
