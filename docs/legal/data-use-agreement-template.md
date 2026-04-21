# Data Use Agreement — Template

**Document ID:** DUA-001
**Version:** 1.0
**Effective Date:** 2026-04-20
**Status:** TEMPLATE — requires counsel review and, for PHI, institutional IRB approval.

---

## Usage

Used when Protected Health Information (PHI) or a **Limited Data Set** (per HIPAA 45 CFR 164.514(e)) flows between Gentle Reminder, Inc. and an academic collaborator or other covered entity. Establishes HIPAA-compliant terms for PHI handling without making Gentle Reminder a HIPAA Business Associate (unless separately agreed).

**Do NOT use this template for:**
- Fully de-identified data (no agreement required under HIPAA Safe Harbor)
- Research data that is not PHI (use a standard data access agreement)
- Commercial data sales (use a master data services agreement)

---

## 1. PARTIES

**DATA PROVIDER** ("Provider"): [Academic institution / Covered Entity] — [ADDRESS]

**DATA RECIPIENT** ("Recipient"): Gentle Reminder, Inc. — [ADDRESS]

## 2. DEFINITIONS

Terms defined in HIPAA 45 CFR 160.103 and 164.514 are incorporated by reference.

- **Limited Data Set (LDS):** PHI excluding the 16 direct identifiers listed in 45 CFR 164.514(e)(2), but may include dates (including dates of birth, admission, discharge), city, state, five-digit zip code, and ages including those over 89.
- **Research Purpose:** the research described in Attachment A, consistent with [IRB-approved protocol] and/or [federally-funded project].

## 3. PERMITTED USES AND DISCLOSURES

Recipient may use and disclose the LDS only for:

- The Research Purpose specified in Attachment A
- Statistical analysis, hypothesis generation, and publication of aggregate findings
- Management and administration of the research (internal quality assurance, audit trail)

Recipient shall NOT:

- Use or disclose the LDS for any purpose other than the Research Purpose
- Identify individuals or contact them in any manner
- Re-identify the LDS or combine it with information that would permit re-identification
- Use the LDS for any commercial purpose beyond research and development aligned with the Research Purpose

## 4. SAFEGUARDS

Recipient shall maintain **administrative, physical, and technical safeguards** appropriate for PHI:

- **Access control:** LDS stored on systems accessible only to named study personnel; role-based access with MFA; audit logs retained 7 years
- **Encryption:** At rest (AES-256) and in transit (TLS 1.3)
- **Physical:** Workstations secured; backup media encrypted; paper records secured in locked storage
- **Personnel:** Study team completes annual HIPAA privacy training; background checks per institutional standards
- **Incident response:** breach detection procedures; annual tabletop exercise

Recipient shall document its safeguards in a Data Security Plan (cross-reference: `docs/security/`) and make the plan available to Provider on request.

## 5. REPORTING

Recipient shall report to Provider **within 5 business days**:

- Any use or disclosure not provided for by this Agreement (Impermissible Use / Disclosure)
- Any breach of Unsecured PHI per HIPAA Breach Notification Rule standards
- Any security incident affecting the LDS, regardless of whether PHI is actually compromised

Reporting includes:
- Nature of the incident
- PHI affected (type and approximate count)
- Remediation steps taken
- Contact for follow-up

## 6. SUBCONTRACTORS

Recipient shall not disclose the LDS to any subcontractor, vendor, or agent without Provider's prior written consent and execution of a flow-down DUA or Business Associate Agreement covering the subcontractor.

Approved subcontractors are listed in Attachment B.

## 7. TERM AND TERMINATION

- **Term:** from Effective Date for [24] months, or until completion of the Research Purpose, whichever is earlier
- **Renewal:** by mutual written agreement
- **Termination for cause:** Provider may terminate immediately upon Recipient's material breach; Recipient returns or destroys all LDS within 30 days
- **Termination for convenience:** either Party with 60 days' written notice
- **Survival:** Sections 4 (Safeguards), 5 (Reporting), 8 (Return/Destruction), and 10 (Liability) survive termination

## 8. RETURN OR DESTRUCTION

Upon termination or at Provider's written request:

- Recipient returns the LDS to Provider OR destroys it per NIST SP 800-88 (media sanitization)
- Destruction certification provided to Provider within 30 days
- If return or destruction is infeasible (e.g., incorporated into aggregate analyses, archived in regulatory submissions), Recipient extends the protections of this Agreement to the LDS in its retained form for as long as it retains it

## 9. INDIVIDUAL RIGHTS

Recipient does NOT make the LDS available to individuals for access, amendment, or accounting purposes. Such requests are directed to Provider, who remains the Covered Entity.

## 10. INDEMNIFICATION AND LIABILITY

Recipient indemnifies Provider for any damages, fines, penalties, or costs arising from Recipient's material breach of this Agreement or the HIPAA Privacy, Security, or Breach Notification Rules.

Liability cap: two (2) times total fees received by Recipient under the related research agreement, or $500,000, whichever is greater. Cap does not apply to indemnification for Recipient's gross negligence, willful misconduct, or breach of confidentiality.

## 11. MISCELLANEOUS

- **Relationship:** Recipient is NOT a Business Associate of Provider. This DUA governs the LDS only. If Provider discloses full PHI to Recipient, a separate Business Associate Agreement is required.
- **Governing law:** [State of Provider's institution or Delaware by mutual agreement]
- **No waiver:** failure to enforce any provision is not a waiver
- **Severability:** if any provision is held unenforceable, the remaining provisions continue in force
- **Entire agreement:** this DUA plus Attachments A and B, along with any executed research agreement, constitutes the entire agreement
- **Amendments:** only in writing signed by both Parties

---

## ATTACHMENTS

- **Attachment A:** Research Purpose — description of approved research, IRB protocol reference, principal investigator, data elements shared
- **Attachment B:** Approved Subcontractors — list of third parties authorized to access the LDS

---

## SIGNATURES

**PROVIDER:** [Institution Name]

By: _______________________
Name:
Title:
Date:

**RECIPIENT:** Gentle Reminder, Inc.

By: _______________________
Name:
Title:
Date:

---

*Template developed for Gentle Reminder, Inc. research collaborations involving PHI Limited Data Sets under HIPAA 45 CFR 164.514(e). This template does not authorize fully identified PHI transfer; use a Business Associate Agreement for that scenario. Counsel review required before execution.*
