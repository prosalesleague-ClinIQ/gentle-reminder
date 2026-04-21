# Data Management Plan

**Document ID:** DMP-001
**Version:** 1.0
**Effective Date:** 2026-04-06
**Companion to:** `study-protocol.md` (CVP-001)
**Regulatory basis:** 21 CFR Part 11, ICH-GCP E6(R2) §5.5, HIPAA 45 CFR 164, 45 CFR Part 46

---

## 1. PURPOSE

This plan defines how data are captured, transferred, stored, validated, audited, retained, and destroyed across the **Gentle Reminder Cognitive Validation Study (CVP-001)**. It is designed to meet 21 CFR Part 11 electronic records requirements and to support future FDA submissions (510(k), De Novo, or PMA) if the study results are used as clinical evidence.

## 2. DATA SOURCES

### 2.1 Platform-Captured Data (Gentle Reminder App)

| Data element | Capture mechanism | Cadence |
|--------------|-------------------|---------|
| Cognitive domain scores (0–100) | App telemetry | Per session (≥3x/week) |
| Session completion rate | App telemetry | Continuous |
| Response latencies (per item) | App telemetry | Per item |
| Speech hesitation / pause metrics | On-device audio analysis | Per spoken-answer item |
| Medication reminder adherence | App event log | Per reminder |
| Caregiver alert delivery | Notification receipts | Per alert |
| Sleep irregularity signal (self-report) | In-app log | Nightly |
| Routine disruption signal | App inference | Continuous |
| App version, device model, OS version | Platform telemetry | Per session |

**Transmission:** TLS 1.3 over HTTPS to the study backend hosted in AWS `us-east-1`, segregated from Gentle Reminder's commercial production environment.

### 2.2 Clinical Assessment Data (eCRF)

| Assessment | Instrument | Entered via |
|-----------|-----------|-------------|
| Demographics | Site intake form | eCRF |
| Medical history | Site intake form | eCRF |
| MMSE total + subscores | Folstein (1975) | eCRF |
| MoCA total + subscores | Nasreddine (2005) | eCRF |
| SUS score | System Usability Scale | eCRF |
| Caregiver satisfaction | Study-specific Likert | eCRF |
| Adverse events | AE form (see SMP-001) | eCRF |
| Exit interview | Structured script | eCRF free-text |

**Platform:** REDCap (Research Electronic Data Capture), hosted by [Academic Site] under institutional HIPAA BAA, or equivalent 21 CFR Part 11-validated EDC system.

### 2.3 Source Documents

- Signed informed consent forms (paper or electronic-signature PDF) — stored at site, scanned to encrypted site study folder.
- Clinical notes at Baseline, Month 1, Month 3, Month 6 visits — retained in site medical record.
- MMSE/MoCA raw score sheets — scanned as PDF, filed in Trial Master File (TMF).

## 3. DOUBLE-CODING / IDENTIFIER SCHEME

Each participant receives **two identifiers**:

1. **Site Subject ID** (`SSID`) — format `S{site}-{seq}` (e.g., `S01-0042`). Links to medical record. Stored only in the site's local **Subject Identification Log** (not transmitted to sponsor, not in eCRF or platform data).
2. **Study Subject Code** (`SSC`) — random 8-character alphanumeric (e.g., `7F4K9QWX`). Used in eCRF, platform data, and all statistical analysis datasets.

The Subject Identification Log mapping SSID ↔ SSC is:
- Maintained by the Site Study Coordinator on institutional secure drive, access-restricted.
- Never exported to the sponsor, statistical team, or platform vendor.
- Destroyed 25 years after study close per record retention policy (§10).

**Sponsor (Gentle Reminder, Inc.) and all downstream analyses work exclusively with SSC-coded data.** Re-identification is possible only at the site.

## 4. DATA VALIDATION

### 4.1 Entry-time validation (eCRF)

- Field-level range checks (e.g., MMSE total 0–30, age ≥ 65).
- Required-field enforcement before form submission.
- Cross-form consistency rules (e.g., MMSE score must be ≤ MoCA orientation + memory subscale sum only if within biological plausibility).
- Double-entry verification for high-risk fields (MMSE total, MoCA total) at ≥10% random sample audit.

### 4.2 Post-entry validation

- **Source Data Verification (SDV):** Monitor reviews 100% of consent forms, 100% of AE/SAE reports, and a 20% sample of eCRF entries against source documents at monthly site visits.
- **Edit checks:** Automated weekly scan for out-of-range, missing-required, and internally-inconsistent values. Queries routed to Site Coordinator for resolution within 5 business days.
- **Platform data reconciliation:** Weekly automated reconciliation between app telemetry (session counts) and eCRF-recorded session logs.

### 4.3 Data lock

The database is **soft-locked** when all queries are resolved and the Data Management Committee signs off. A **hard lock** occurs after final statistical analysis plan approval. Post-lock changes require a documented amendment approved by the PI and Sponsor.

## 5. AUDIT TRAIL (21 CFR Part 11)

**All data-modifying events are logged** with:
- User ID (authenticated, unique per person — no shared accounts)
- Timestamp (server UTC, to the second)
- Old value → new value
- Reason code (from controlled vocabulary: `data entry`, `correction`, `query resolution`, `source document update`, `system correction`)
- Optional free-text explanation

Audit logs are:
- **Append-only** — no deletion capability exposed to any user, including administrators.
- **Retained for 25 years** (see §10) in immutable storage (AWS S3 Object Lock in Compliance mode, or institutional equivalent).
- Exportable in human-readable format on request by FDA, IRB, sponsor, or PI.

## 6. ACCESS CONTROL

### 6.1 Roles

| Role | Read | Write | Delete | Export |
|------|------|-------|--------|--------|
| Participant | Own summary only | — | — | Own data |
| Site Coordinator | Site data only | Site data | — | Site data |
| PI | All site data | — | — | Site data |
| Data Manager | All study data | Query/correct | — | De-identified |
| Sponsor (GR, Inc.) | De-identified only | — | — | De-identified |
| Statistician | De-identified only | — | — | De-identified |
| IRB Auditor | All study data | — | — | Audit reports |
| FDA / Regulator | All study data (on request) | — | — | All |

### 6.2 Authentication

- **MFA required** for all non-participant roles (TOTP or WebAuthn).
- Passwords rotated every 90 days.
- Accounts auto-disabled after 90 days of inactivity.
- Password complexity: NIST SP 800-63B AAL2 minimum.

## 7. BACKUP AND RECOVERY

- **Platform telemetry:** AWS RDS daily snapshots, 35-day retention; weekly full backups to cross-region S3 with 1-year retention.
- **eCRF (REDCap):** Institutional backup policy (typically daily incremental, weekly full, 90-day retention).
- **TMF (paper-equivalent):** Scanned PDFs backed up nightly to site secure drive.
- **Recovery time objective (RTO):** 4 hours for eCRF, 24 hours for platform.
- **Recovery point objective (RPO):** 24 hours (maximum tolerable data loss).
- **Annual restore drill:** Recover full study database to a staging environment and verify integrity against production; results documented.

## 8. TRANSFER AND EXPORT

### 8.1 Platform → Sponsor

- De-identified data packages generated monthly.
- Transferred via SFTP with key-based authentication, or AWS S3 presigned URL with 24-hour expiration.
- Transfer log retained indefinitely; hash (SHA-256) recorded for each file.

### 8.2 eCRF → Statistician

- CSV or SAS-format export from REDCap, de-identified.
- Transferred via institutional encrypted file transfer (e.g., Globus, CITI-Box).
- Statistician signs Data Use Agreement before first transfer.

### 8.3 Publication data

- De-identified dataset (SSC only, no dates more specific than quarter, no ages above 89 → bucketed as "90+", per HIPAA Safe Harbor) prepared at study close.
- Deposited in a qualified repository (e.g., NIMH Data Archive) with controlled access, per NIH Data Management and Sharing Policy (effective 2023-01-25).

## 9. DE-IDENTIFICATION STANDARD

Dataset is considered de-identified when **all 18 HIPAA Safe Harbor identifiers are removed**:

1. Names
2. Geographic subdivisions smaller than state
3. All date elements (except year) — dates shifted ± uniform random within ±90 days per-subject
4. Phone numbers
5. Fax numbers
6. Email addresses
7. SSNs
8. Medical record numbers
9. Health plan beneficiary numbers
10. Account numbers
11. Certificate / license numbers
12. Vehicle identifiers
13. Device identifiers and serial numbers (platform session IDs are hashed)
14. Web URLs
15. IP addresses (truncated to /24 or removed)
16. Biometric identifiers
17. Full-face photographs
18. Any other unique identifying number, characteristic, or code (verified by statistician before release)

Ages over 89 are bucketed as "90+".

Re-identification risk assessment performed by statistician before each public release per HIPAA 164.514(b).

## 10. RECORD RETENTION

| Record type | Retention period | Trigger |
|-------------|------------------|---------|
| Signed consent forms | 25 years | After last participant visit |
| Source documents | 25 years | After last participant visit |
| eCRF | 25 years | After database hard-lock |
| Platform telemetry | 25 years | After database hard-lock |
| Audit trail | 25 years | After database hard-lock |
| Subject Identification Log | 25 years | After last participant visit |
| TMF | 25 years | After last participant visit or study termination |

**Basis:** 21 CFR 812.140 (FDA IDE records) specifies 2 years past marketing approval OR 2 years after last use; for a potential 510(k) medical device this typically resolves to 10–15 years. We adopt **25 years** as a conservative margin aligning with common institutional IRB standards and ICH-GCP.

After retention, records are destroyed using NIST SP 800-88 methods (media sanitization) and a destruction certificate is filed in the TMF.

## 11. CHANGE CONTROL

- Changes to this DMP require version increment, rationale, effective date, and approval signatures (Sponsor, PI, Data Manager).
- Material changes (definition of data elements, retention period, de-identification standard, access role assignment) require re-submission to the IRB.
- Minor changes (typo, reference correction) require Sponsor + PI sign-off only.

## 12. SOP REFERENCES

| SOP | Reference |
|-----|-----------|
| Informed Consent Process | `docs/clinical-validation/informed-consent-template.md` |
| Safety Monitoring | `docs/clinical-validation/safety-monitoring-plan.md` |
| Risk Management | `docs/iso-14971/risk-management-plan.md` |
| Software Lifecycle | `docs/iec-62304/software-lifecycle-plan.md` (if published) |
| QMS — Document Control | `docs/iso-13485/document-control.md` (if published) |
| Cybersecurity | `docs/security/stride-threat-model.md` (if published) |

---

*This Data Management Plan is subject to site IRB review. Final operational details (specific EDC instance, SFTP endpoints, key management) are documented in a site-specific Data Management Operational Procedures addendum.*
