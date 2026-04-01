# HIPAA Compliance Guide - Gentle Reminder

## Overview

Gentle Reminder is a dementia care platform that handles Protected Health Information (PHI) including cognitive assessment scores, medication records, behavioral data, and patient demographics. This document outlines the administrative, technical, and physical safeguards implemented to comply with the Health Insurance Portability and Accountability Act (HIPAA).

---

## 1. Administrative Safeguards

### 1.1 Access Controls

- **Role-Based Access Control (RBAC):** Six defined roles (`patient`, `family_member`, `caregiver`, `clinician`, `facility_admin`, `system_admin`) with granular permissions.
- **Minimum Necessary Principle:** Each role receives only the permissions required for its function. Family members see only their linked patient's data. Caregivers see only assigned patients.
- **Account Provisioning:** New accounts require approval by a `facility_admin` or `system_admin`. Default accounts are inactive until verified.
- **Account Deprovisioning:** Terminated users are deactivated (`isActive = false`) immediately. Access tokens are revoked on deactivation.

### 1.2 Audit Logging

- **Comprehensive Audit Trail:** All data access and modifications are logged in the `AuditLog` model with user ID, action, resource, resource ID, IP address, and timestamp.
- **Immutable Logs:** Audit log entries cannot be modified or deleted through the application layer.
- **Log Retention:** Audit logs are retained for a minimum of 6 years per HIPAA requirements.
- **Regular Review:** Audit logs are reviewed monthly by the Privacy Officer for unauthorized access patterns.

### 1.3 Security Officer Designation

- A designated HIPAA Security Officer is responsible for developing and implementing security policies.
- A designated Privacy Officer oversees PHI handling procedures and responds to patient rights requests.

### 1.4 Risk Assessment

- Annual risk assessments are conducted to identify vulnerabilities in administrative, physical, and technical safeguards.
- Risk assessment results are documented and remediation plans are tracked to completion.
- Penetration testing is performed annually by qualified third-party assessors.

### 1.5 Sanctions Policy

- Violations of HIPAA policies result in disciplinary action up to and including termination.
- All violations are documented and reported to the Privacy Officer.

---

## 2. Technical Safeguards

### 2.1 Encryption

- **Data at Rest:** All database fields containing PHI are stored in encrypted PostgreSQL databases. Storage volumes use AES-256 encryption.
- **Data in Transit:** All API communications use TLS 1.2 or higher. HSTS headers enforce HTTPS connections.
- **Encryption Keys:** Keys are managed through the cloud provider's key management service (KMS) with automatic rotation.

### 2.2 Authentication

- **JWT-Based Authentication:** Stateless authentication using JSON Web Tokens with configurable expiration.
- **Password Requirements:** Minimum 12 characters, complexity requirements enforced at account creation and password change.
- **Session Management:** Tokens expire after configurable period (default 1 hour). Refresh tokens rotate on each use.
- **Multi-Factor Authentication (MFA):** Required for all clinician and admin accounts.

### 2.3 Authorization

- **Middleware Enforcement:** The `authenticate` middleware validates JWT tokens on every API request before route handlers execute.
- **Resource-Level Authorization:** Each endpoint verifies the requesting user has permission to access the specific patient record.
- **API Rate Limiting:** Rate limits prevent brute-force attacks and abuse.

### 2.4 Network Security

- **Firewall Rules:** Only required ports are exposed. Database ports are not publicly accessible.
- **VPC Isolation:** Application and database tiers run in isolated virtual private cloud networks.
- **API Gateway:** All external traffic routes through an API gateway with request validation.

### 2.5 Integrity Controls

- **Input Validation:** All API inputs are validated against defined schemas before processing.
- **Database Constraints:** Foreign key constraints, unique constraints, and data type enforcement at the database level.
- **Checksums:** File uploads (photos, voice recordings) include integrity checksums.

### 2.6 Automatic Logoff

- Inactive sessions are terminated after 15 minutes for clinical users.
- Mobile applications lock after 5 minutes of inactivity.

---

## 3. Physical Safeguards

### 3.1 Cloud Provider Responsibilities

Gentle Reminder deploys on HIPAA-eligible cloud infrastructure. The cloud provider is responsible for:

- Physical access controls to data centers (biometric, security guards, surveillance).
- Environmental controls (fire suppression, climate control, redundant power).
- Media disposal and degaussing procedures.
- Business continuity and disaster recovery for physical infrastructure.

### 3.2 Workstation Security

- Development workstations must use full-disk encryption.
- Production database access requires VPN connection.
- No PHI is stored on developer workstations; all development uses synthetic data.

### 3.3 Device and Media Controls

- Mobile devices accessing the platform must have device-level encryption enabled.
- Remote wipe capability is required for all devices with platform access.
- Removable media containing PHI is prohibited.

---

## 4. Data Handling

### 4.1 PHI Identification

The following data elements constitute PHI within Gentle Reminder:

| Data Element | Storage Location | Sensitivity |
|---|---|---|
| Patient name, date of birth | `patients`, `users` tables | High |
| Cognitive assessment scores | `cognitive_scores`, `exercise_results` | High |
| Medication records | `medications`, `medication_logs` | High |
| Behavioral signals | `behavioral_signals`, `biomarker_scores` | High |
| Location data | `movement_patterns` | High |
| Voice recordings | `voice_recordings` | High |
| Family member information | `family_members` | Moderate |
| Session metadata | `sessions` | Moderate |
| Photos | `photos` | High |
| Incident reports | `incidents` | High |

### 4.2 Minimum Necessary Standard

- API responses include only the data fields required for the requesting user's role and the specific operation.
- List endpoints return summary data; detail endpoints require explicit resource-level authorization.
- Report generation uses aggregated and de-identified data where possible.

### 4.3 Data Retention

- **Clinical Records:** Retained for a minimum of 7 years after last patient interaction, or longer if required by state law.
- **Audit Logs:** Retained for a minimum of 6 years.
- **Session Data:** Retained for the duration of the care relationship plus the retention period.
- **Configurable Retention:** Facility administrators can configure retention periods that exceed (but not fall below) the minimums.

### 4.4 Data Disposal

- Expired data is purged through automated scheduled jobs.
- Database records are hard-deleted (not soft-deleted) after the retention period.
- Backups containing expired data are rotated out per the backup retention schedule.
- Disposal actions are logged in the audit trail.

---

## 5. Business Associate Agreement (BAA) Template Outline

A BAA must be executed with all third-party service providers that access, process, or store PHI on behalf of Gentle Reminder.

### Required BAA Provisions

1. **Permitted Uses and Disclosures:** Specify exact purposes for which the BA may use PHI.
2. **Safeguard Requirements:** BA must implement administrative, physical, and technical safeguards.
3. **Breach Notification:** BA must report any security incident or breach within 24 hours of discovery.
4. **Subcontractor Requirements:** BA must ensure subcontractors agree to equivalent restrictions.
5. **Access to PHI:** BA must make PHI available to satisfy patient rights requests.
6. **Amendment of PHI:** BA must accommodate amendments to PHI as directed.
7. **Accounting of Disclosures:** BA must document and make available an accounting of disclosures.
8. **Compliance with HHS:** BA must make internal practices available to HHS for compliance determination.
9. **Return or Destruction:** Upon termination, BA must return or destroy all PHI.
10. **Term and Termination:** Specify conditions under which the BAA may be terminated for cause.

### Current Business Associates

- Cloud infrastructure provider
- Email/notification service provider
- Voice synthesis provider (ElevenLabs or equivalent)
- Payment processor (if applicable)
- Backup and disaster recovery provider

---

## 6. Incident Response Plan

### 6.1 Incident Classification

| Severity | Description | Response Time |
|---|---|---|
| Critical | Confirmed PHI breach affecting multiple patients | Immediate (within 1 hour) |
| High | Suspected PHI breach or unauthorized access detected | Within 4 hours |
| Medium | Security vulnerability discovered, no confirmed breach | Within 24 hours |
| Low | Policy violation with no data exposure | Within 72 hours |

### 6.2 Response Procedures

1. **Detection and Reporting:** Any team member who suspects a security incident must report it immediately to the Security Officer.
2. **Containment:** Isolate affected systems to prevent further exposure. Revoke compromised credentials.
3. **Investigation:** Determine the scope of the incident using audit logs, system logs, and network logs.
4. **Assessment:** Evaluate whether the incident constitutes a breach under the HIPAA Breach Notification Rule.
5. **Notification:** If a breach is confirmed:
   - Notify affected individuals within 60 days of discovery.
   - Notify HHS as required (immediately if 500+ individuals affected, annually if fewer).
   - Notify media if 500+ individuals in a single state/jurisdiction are affected.
6. **Remediation:** Implement corrective actions to prevent recurrence.
7. **Documentation:** Document the entire incident lifecycle, actions taken, and outcomes.

### 6.3 Breach Risk Assessment

The following factors determine whether an incident constitutes a reportable breach:

- Nature and extent of PHI involved.
- Identity of the unauthorized person who accessed or received the PHI.
- Whether PHI was actually acquired or viewed.
- Extent to which the risk to the PHI has been mitigated.

---

## 7. Employee Training Requirements

### 7.1 Initial Training

All workforce members must complete HIPAA training within 30 days of hire, covering:

- HIPAA Privacy Rule fundamentals.
- HIPAA Security Rule requirements.
- Organization-specific policies and procedures.
- PHI identification and handling.
- Incident reporting procedures.
- Patient rights and request handling.

### 7.2 Ongoing Training

- Annual refresher training is mandatory for all workforce members.
- Role-specific training for users with elevated access (clinicians, administrators).
- Training on new features or system changes that affect PHI handling.
- Phishing awareness and social engineering defense training.

### 7.3 Training Documentation

- Training completion is tracked and documented.
- Training materials are reviewed and updated annually.
- Training records are retained for 6 years.

---

## Document Control

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-04-01 | Platform Team | Initial version |

This document is reviewed and updated annually, or when significant changes occur to the platform or regulatory requirements.
