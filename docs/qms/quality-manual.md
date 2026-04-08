# Quality Management System Manual

**Document ID:** QMS-001
**References:** 21 CFR Part 820, ISO 13485:2016
**Version:** 1.0
**Effective Date:** 2026-04-06
**Author:** Quality Management

---

## 1. Quality Policy

Gentle Reminder is committed to developing and maintaining a cognitive health monitoring platform that is safe, effective, and compliant with applicable regulatory requirements. Our quality objectives are:

- Deliver software that meets all specified requirements and user needs
- Continuously improve product quality through data-driven post-market surveillance
- Maintain compliance with IEC 62304, ISO 14971, ISO 13485, and 21 CFR Part 820
- Ensure patient safety through systematic risk management and design controls
- Protect patient health information in accordance with HIPAA requirements

## 2. Organizational Structure

### 2.1 Quality Roles

| Role | Responsibilities |
|------|-----------------|
| Quality Manager | Maintains QMS, leads audits, manages CAPA process, regulatory submissions |
| Risk Manager | Owns risk management file, conducts hazard analyses, evaluates residual risk |
| Software Lead | Ensures development follows IEC 62304, manages design controls |
| Clinical Advisor | Reviews clinical safety, validates algorithm accuracy, advises on indications |
| Cybersecurity Lead | Manages security risk assessment, vulnerability management, SBOM |
| Regulatory Affairs | FDA submissions, standards compliance, labeling review |

### 2.2 Management Review

Management reviews are conducted quarterly and include:
- Quality metrics and trends
- CAPA status and effectiveness
- Complaint analysis
- Post-market surveillance data
- Audit findings
- Risk management updates
- Resource adequacy

## 3. Design Controls (21 CFR 820.30)

### 3.1 Design Planning

Each design phase is planned with defined:
- Activities and deliverables
- Responsibilities and authorities
- Review and approval gates
- Resource requirements

### 3.2 Design Input

Design inputs are documented in the Software Requirements Specification (`docs/iec-62304/requirements-specification.md`) and include:
- Functional requirements derived from user needs
- Performance requirements
- Safety requirements from risk analysis
- Security requirements from cybersecurity assessment
- Regulatory requirements

### 3.3 Design Output

Design outputs include:
- Architecture Design Document (`docs/iec-62304/architecture-design.md`)
- Source code in version-controlled repository
- Test procedures and expected results
- Labeling and user documentation

### 3.4 Design Review

Design reviews are conducted at defined milestones:
- Architecture review (before implementation)
- Code review (every pull request, minimum one qualified reviewer)
- Integration review (before system testing)
- Release review (before deployment to production)

### 3.5 Design Verification

Verification confirms that design outputs meet design inputs:
- Automated unit tests (Jest)
- Integration tests (API, database, FHIR)
- End-to-end tests (Playwright, Detox)
- Security tests (vulnerability scanning, penetration testing)
- Performance tests (load testing, latency benchmarks)

### 3.6 Design Validation

Validation confirms the product meets user needs:
- Clinical validation study (see `docs/clinical-validation/study-protocol.md`)
- Usability testing with target patient population
- Caregiver workflow validation
- Clinician reporting accuracy validation

### 3.7 Design Transfer

Transfer from development to production:
- Automated CI/CD pipelines ensure reproducible builds
- Infrastructure as code for deployment consistency
- Release checklist including regression testing and risk review
- Rollback procedures documented and tested

### 3.8 Design Changes

All design changes follow the change control process:
1. Change request with rationale and scope
2. Impact analysis (requirements, design, risk, testing)
3. Approval by Design Review Board
4. Implementation with verification
5. Updated documentation and traceability

## 4. Corrective and Preventive Action (CAPA)

### 4.1 CAPA Sources

- Customer complaints
- Post-market surveillance findings
- Audit findings (internal and external)
- Adverse event reports
- Algorithm drift detection
- Non-conformance reports

### 4.2 CAPA Process

1. **Identification:** Problem documented with supporting evidence
2. **Investigation:** Root cause analysis (5 Whys, Fishbone diagram)
3. **Action Plan:** Corrective and/or preventive actions defined with timeline
4. **Implementation:** Actions executed and documented
5. **Verification:** Effectiveness of actions verified through testing or monitoring
6. **Closure:** CAPA closed after verification demonstrates effectiveness

### 4.3 CAPA Records

All CAPA records include:
- Unique CAPA identifier
- Date opened and target closure date
- Problem description and source
- Root cause analysis results
- Planned actions with responsible parties
- Implementation evidence
- Effectiveness verification results
- Closure date and approver

## 5. Complaint Handling

### 5.1 Complaint Sources

- In-app feedback
- Customer support channels
- Post-market surveillance system
- Clinical site feedback
- App store reviews (monitored)

### 5.2 Complaint Processing

1. **Receipt:** Complaint logged with date, source, and description
2. **Assessment:** Evaluated for safety significance and reportability
3. **Investigation:** Root cause determined; CAPA initiated if systemic
4. **Response:** Complainant notified of resolution within 30 days
5. **Trending:** Complaints categorized and trended quarterly

### 5.3 Medical Device Reporting

Complaints involving death, serious injury, or malfunction that could cause harm are reported to FDA per 21 CFR Part 803 within required timeframes:
- Death or serious injury: 30 calendar days (5 days if remedial action required)
- Malfunction: 30 calendar days

## 6. Document Control

### 6.1 Document Hierarchy

| Level | Document Type | Examples |
|-------|--------------|---------|
| Level 1 | Quality Manual | This document |
| Level 2 | Procedures | SOPs, work instructions |
| Level 3 | Plans | Development plan, risk management plan, clinical protocol |
| Level 4 | Records | Test reports, CAPA records, audit reports, complaints |

### 6.2 Document Management

- All controlled documents are stored in version control (Git) or the QMS document management system
- Documents have unique identifiers, version numbers, and effective dates
- Draft documents are clearly marked and not used for production activities
- Obsolete documents are archived and marked as superseded
- Electronic signatures comply with 21 CFR Part 11

### 6.3 Record Retention

Quality records are retained for the following periods:
- Design history file: Life of device + 2 years
- CAPA records: 5 years after closure
- Complaint records: Life of device + 2 years
- Audit records: 5 years
- Training records: Duration of employment + 3 years

## 7. Training

### 7.1 Training Requirements

All personnel performing quality-affecting activities must be trained on:
- Quality Management System procedures
- Role-specific technical competencies
- IEC 62304 software lifecycle requirements (development team)
- ISO 14971 risk management (risk management team)
- HIPAA privacy and security (all personnel with PHI access)

### 7.2 Training Records

Training records include:
- Employee name and role
- Training topic and date
- Training method (classroom, self-study, on-the-job)
- Assessment results (if applicable)
- Trainer identification

### 7.3 Effectiveness Assessment

Training effectiveness is assessed through:
- Written or practical assessments
- Observed work performance
- Audit findings related to trained activities

## 8. Internal Audits

### 8.1 Audit Schedule

Internal audits are conducted at least annually, covering all QMS processes. High-risk areas (CAPA, complaint handling, design controls) may be audited more frequently.

### 8.2 Audit Process

1. Audit plan with scope, criteria, and schedule
2. Audit execution by trained, independent auditors
3. Findings classified (major non-conformance, minor non-conformance, observation)
4. Corrective actions for non-conformances tracked through CAPA
5. Follow-up audit to verify corrective action effectiveness

## 9. Supplier Management

### 9.1 Critical Suppliers

| Supplier | Service | Risk Level |
|----------|---------|------------|
| Cloud infrastructure provider | Hosting, database, compute | High |
| Push notification service | Alert delivery | High |
| SMS provider | Caregiver notifications | Medium |
| Email service | Communication delivery | Low |

### 9.2 Supplier Controls

- Qualified suppliers are evaluated for quality, security, and reliability
- Critical suppliers are audited or assessed annually
- Service level agreements (SLAs) are maintained for uptime and performance
- Supplier changes are evaluated through the change control process

## 10. Document References

| Document | Location |
|----------|----------|
| Software Development Plan | `docs/iec-62304/software-development-plan.md` |
| Requirements Specification | `docs/iec-62304/requirements-specification.md` |
| Architecture Design | `docs/iec-62304/architecture-design.md` |
| Risk Management Plan | `docs/iso-14971/risk-management-plan.md` |
| Hazard Analysis (FMEA) | `docs/iso-14971/hazard-analysis-fmea.md` |
| Cybersecurity Risk Assessment | `docs/cybersecurity/security-risk-assessment.md` |
| Clinical Validation Protocol | `docs/clinical-validation/study-protocol.md` |
| Indications for Use | `docs/labeling/indications-for-use.md` |
