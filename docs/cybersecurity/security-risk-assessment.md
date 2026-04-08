# Cybersecurity Risk Assessment

**Document ID:** CRA-001
**References:** FDA Premarket Cybersecurity Guidance (2023), NIST Cybersecurity Framework
**Version:** 1.0
**Effective Date:** 2026-04-06
**Author:** Cybersecurity Lead

---

## 1. Purpose

This document presents a STRIDE-based threat model and cybersecurity risk assessment for the Gentle Reminder cognitive health monitoring platform, in accordance with FDA premarket cybersecurity guidance.

## 2. System Boundary

The threat model covers:
- Mobile applications (iOS, Android, watchOS)
- Web applications (patient portal, caregiver dashboard, admin panel, clinical portal)
- API server and backend services
- Database systems (PostgreSQL, Neo4j, Redis)
- Third-party integrations (push notifications, SMS, email, FHIR endpoints)
- Cloud infrastructure

## 3. STRIDE Threat Model

### 3.1 Spoofing

| Threat ID | Component | Threat | Impact | Likelihood | Risk | Mitigation |
|-----------|-----------|--------|--------|------------|------|------------|
| S-01 | API Server | Attacker spoofs patient identity using stolen credentials | PHI access, false exercise submissions | Medium | High | JWT with RS256 signing, short token expiry (15 min), refresh token rotation, MFA for clinical roles |
| S-02 | Mobile App | Attacker spoofs push notification source | Phishing, false medication instructions | Low | Medium | APNs/FCM certificate pinning, notification content validation |
| S-03 | FHIR Gateway | Attacker spoofs EHR system in FHIR exchange | False clinical data injection | Low | High | Mutual TLS for FHIR endpoints, allowlisted EHR system certificates |
| S-04 | Web Apps | Session hijacking via stolen session token | Unauthorized account access | Medium | High | Secure HTTP-only cookies, SameSite attribute, session binding to IP/user-agent |

### 3.2 Tampering

| Threat ID | Component | Threat | Impact | Likelihood | Risk | Mitigation |
|-----------|-----------|--------|--------|------------|------|------------|
| T-01 | API Server | Attacker modifies cognitive scores in transit | Incorrect clinical data | Low | High | TLS 1.3 for all connections, request signing for critical operations |
| T-02 | Database | Unauthorized modification of exercise results | Clinical data integrity compromise | Low | Critical | Database-level audit triggers, row-level integrity checksums, RBAC on database operations |
| T-03 | Mobile App | Tampering with locally cached exercise data | Score manipulation | Medium | Medium | Integrity verification on sync, server-side score recalculation, certificate pinning |
| T-04 | CI/CD Pipeline | Supply chain attack via compromised dependency | Malicious code in production | Low | Critical | SBOM maintenance, dependency pinning, vulnerability scanning, signed commits |

### 3.3 Repudiation

| Threat ID | Component | Threat | Impact | Likelihood | Risk | Mitigation |
|-----------|-----------|--------|--------|------------|------|------------|
| R-01 | API Server | User denies performing clinical action | Accountability gap | Medium | Medium | Comprehensive audit logging (who, what, when, where) per 21 CFR Part 11, tamper-evident log storage |
| R-02 | Alert Engine | Caregiver denies receiving alert | Liability dispute | Medium | Medium | Delivery confirmation tracking, multi-channel delivery receipts, timestamped acknowledgment records |
| R-03 | Admin Panel | Administrator denies configuration change | Configuration accountability gap | Low | Medium | Admin action audit log, before/after state capture, electronic signatures for critical changes |

### 3.4 Information Disclosure

| Threat ID | Component | Threat | Impact | Likelihood | Risk | Mitigation |
|-----------|-----------|--------|--------|------------|------|------------|
| I-01 | Database | PHI exposed through SQL injection | HIPAA violation, patient harm | Low | Critical | Parameterized queries via Prisma ORM, input validation with Zod schemas, WAF rules |
| I-02 | API Server | PHI leaked in error messages or logs | Data exposure | Medium | High | Structured error responses without internal details, automatic PHI redaction in logs |
| I-03 | Mobile App | PHI exposed on shared/lost device | Data exposure | Medium | High | Biometric lock, automatic session timeout, local data encryption, remote wipe capability |
| I-04 | Web Apps | PHI exposed via browser storage | Data exposure | Low | Medium | No PHI in localStorage, session-only memory storage, Content Security Policy headers |
| I-05 | Backups | PHI exposed through backup access | Data exposure | Low | High | Encrypted backups, access-controlled backup storage, backup access audit logging |

### 3.5 Denial of Service

| Threat ID | Component | Threat | Impact | Likelihood | Risk | Mitigation |
|-----------|-----------|--------|--------|------------|------|------------|
| D-01 | API Server | Volumetric DDoS attack | Service unavailability, missed alerts | Medium | High | CDN-based DDoS protection, rate limiting, auto-scaling, geographic distribution |
| D-02 | Alert Engine | Alert queue flooding | Alert delivery delays | Low | High | Queue size limits, priority queuing for critical alerts, isolated alert processing infrastructure |
| D-03 | Database | Resource exhaustion from complex queries | Service degradation | Low | Medium | Query timeout limits, connection pooling, read replicas for reporting queries |

### 3.6 Elevation of Privilege

| Threat ID | Component | Threat | Impact | Likelihood | Risk | Mitigation |
|-----------|-----------|--------|--------|------------|------|------------|
| E-01 | API Server | Patient role escalates to clinician privileges | Unauthorized clinical data access | Low | Critical | RBAC enforced at middleware AND database layers (defense in depth), role assignment restricted to admin |
| E-02 | Multi-Tenant | Tenant A accesses Tenant B data | Cross-tenant data breach | Low | Critical | Tenant ID enforced on every database query via Prisma middleware, row-level security policies |
| E-03 | API Server | API parameter manipulation for privilege escalation | Access to other patients' data | Medium | High | Server-side authorization checks on every resource access, object-level access control |

## 4. Security Controls Summary

### 4.1 Authentication Controls

- JWT access tokens with RS256 signing and 15-minute expiry
- Refresh token rotation with revocation on anomaly detection
- Multi-factor authentication for clinical and admin roles
- Biometric authentication on mobile (Face ID / Touch ID)
- Account lockout after 5 failed authentication attempts
- Password policy: minimum 12 characters, complexity requirements

### 4.2 Authorization Controls

- Role-Based Access Control with five roles (Patient, Caregiver, Clinician, Admin, SuperAdmin)
- Resource-level and object-level access control
- Tenant isolation enforced at ORM middleware layer
- API endpoint authorization via roleGuard middleware

### 4.3 Data Protection Controls

- AES-256 encryption at rest for all PHI
- TLS 1.3 for all data in transit
- Field-level encryption for highly sensitive fields
- Automatic PHI redaction in application logs
- Encrypted database backups with access control

### 4.4 Monitoring and Detection Controls

- Comprehensive audit logging (21 CFR Part 11 compliant)
- Real-time anomaly detection for authentication patterns
- Dependency vulnerability scanning (continuous)
- Application performance monitoring with security alerting
- Post-market surveillance for algorithm integrity

### 4.5 Software Supply Chain Controls

- Software Bill of Materials (SBOM) in CycloneDX format
- Dependency version pinning with lock files
- Automated vulnerability scanning (npm audit, Snyk)
- Signed Git commits for code integrity
- CI/CD pipeline integrity verification

## 5. Patch and Update Management

| Component | Update Frequency | Process |
|-----------|-----------------|---------|
| Application code | Continuous (CI/CD) | Automated testing, staged rollout, instant rollback |
| Dependencies (critical CVE) | Within 48 hours | Automated PR, expedited review, hotfix deployment |
| Dependencies (routine) | Monthly | Batch update, full regression testing |
| Infrastructure | As available | Staged rollout, health check verification |
| Mobile app | As needed (OTA for JS, store release for native) | EAS Update for JS bundles, app store review for native |

## 6. Incident Response

### 6.1 Security Incident Classification

| Severity | Description | Response Time |
|----------|-------------|---------------|
| P1 - Critical | Active PHI breach, system compromise | Immediate (within 1 hour) |
| P2 - High | Vulnerability with active exploit, authentication bypass | Within 4 hours |
| P3 - Medium | Vulnerability without known exploit, suspicious activity | Within 24 hours |
| P4 - Low | Minor vulnerability, informational finding | Next business day |

### 6.2 Breach Notification

In the event of a confirmed PHI breach:
- HIPAA breach notification within 60 days of discovery
- State notification per applicable state breach notification laws
- FDA notification if breach affects device safety or effectiveness

## 7. SBOM

The Software Bill of Materials is generated automatically and maintained at `docs/cybersecurity/sbom.json`. See `scripts/generate-sbom.sh` for the generation process.

## 8. Document References

| Document | Location |
|----------|----------|
| Risk Management Plan | `docs/iso-14971/risk-management-plan.md` |
| SBOM | `docs/cybersecurity/sbom.json` |
| SBOM Generator | `scripts/generate-sbom.sh` |
