# Subaward Agreement — Template

**Document ID:** SA-001
**Version:** 1.0
**Effective Date:** 2026-04-20
**Status:** TEMPLATE — requires counsel review and institutional modification before execution.

---

## Usage

Used when Gentle Reminder, Inc. serves as **prime** or **subawardee** on a federally-funded research collaboration (NIA SBIR, NIH R21, NSF, BrightFocus, Alzheimer's Association) with an academic medical center.

Covers:
- Scope of work and performance period
- Budget and reimbursement
- Intellectual property ownership split
- Publication rights and review period
- Data access and management
- Reporting obligations (PI progress, Bayh-Dole, FFATA, etc.)
- Termination

---

## 1. PARTIES AND EFFECTIVE DATE

This Subaward Agreement ("Agreement") is entered into on {{effective_date}} by and between:

**PRIME:** [Gentle Reminder, Inc.] — Delaware corporation, principal place of business at [ADDRESS] ("Prime")

**SUBAWARDEE:** [Academic Institution Name] — [state nonprofit / public university / academic medical center], principal place of business at [ADDRESS] ("Subawardee")

Funding source: [NIH / NSF / Foundation], Award Number {{federal_award_number}}, dated {{federal_award_date}} ("Federal Award").

## 2. SCOPE OF WORK

Subawardee shall conduct the research described in Attachment A (Statement of Work) under the direction of {{pi_name}} ("Principal Investigator" or "PI"), consistent with the Federal Award's approved project plan.

- **Performance period:** {{start_date}} through {{end_date}}
- **Deliverables:** enumerated in Attachment A, with target dates
- **Personnel:** PI effort at {{pi_percent_effort}}%; other key personnel listed in Attachment B

Any material change to the Scope of Work requires a written amendment signed by both Parties and, where required, prior written approval from the Federal Awarding Agency.

## 3. BUDGET AND REIMBURSEMENT

Total subaward amount: ${{total_subaward}} (exclusive of / inclusive of indirect costs per Attachment C).

- **Payment schedule:** quarterly in arrears, upon invoice + progress report
- **Invoicing:** Subawardee submits invoice within 30 days of quarter close; Prime pays within 30 days of approved invoice
- **Direct costs:** personnel, fringe, travel, materials, computer services, participant incentives per approved Federal Award budget
- **Indirect costs:** applied at Subawardee's federally negotiated rate or Federal Award's approved rate, whichever is lower (typically capped at 10% de minimis for SBIR subawards)
- **Cost overruns:** Subawardee absorbs any overrun beyond the budgeted amount unless a written amendment extends the budget

## 4. INTELLECTUAL PROPERTY

### 4.1 Background IP

Each Party retains all right, title, and interest in IP existing before the Effective Date ("Background IP") or developed outside the scope of this Agreement. Background IP includes, for Prime:

- All 23 provisional patent applications in the Gentle Reminder patent docket, whether filed before or during the performance period
- The Gentle Reminder software platform, source code, algorithms, and trade-secret parameters
- The Gentle Reminder trademark and brand

Background IP includes, for Subawardee:

- Prior research publications, methods, datasets, and protocols of the PI and Subawardee's institution
- Subawardee's general research know-how and capabilities

### 4.2 Foreground IP (developed under this Agreement)

**Platform-derived IP** — any improvement, modification, or extension to the Gentle Reminder platform, its algorithms, its scoring, its biomarkers, its user-interface patterns, or its data-handling methods: owned solely by **Prime**. Subawardee and PI hereby assign any such IP to Prime upon creation.

**Clinical findings IP** — any novel clinical or scientific findings, hypotheses, statistical models not specific to platform methods, or medical knowledge generated from analysis of study data: owned solely by **Subawardee**. Subawardee grants Prime a non-exclusive, royalty-free, perpetual license to use such clinical findings for commercial purposes.

**Joint IP** — any invention that both Parties materially contribute to: joint ownership, with each Party free to license without accounting to the other, with cross-license of joint IP to each Party for independent exploitation.

### 4.3 Bayh-Dole compliance

Because this is federally-funded, all Foreground IP is subject to the Bayh-Dole Act (35 U.S.C. §§ 200-212). Each Party:

- Discloses any invention arising from the Federal Award within 60 days of identification
- Elects title within 2 years of disclosure (default: yes, elect title)
- Files patent applications within statutory deadlines
- Includes federal funding acknowledgment in the patent specification
- Grants the Federal Government a nonexclusive, nontransferable, irrevocable, paid-up license

The Parties will coordinate all Bayh-Dole filings jointly.

## 5. PUBLICATION RIGHTS

### 5.1 Subawardee's right to publish

PI and Subawardee may publish results of the research conducted under this Agreement. However:

- **30-day review period:** PI shall provide Prime with a draft of any proposed publication (manuscript, abstract, poster, presentation, preprint) at least **30 calendar days** before submission or disclosure
- **Prime's review scope:** Prime reviews solely to (a) identify Prime's Confidential Information and Background IP that should be removed, and (b) identify patentable inventions that require provisional filing before disclosure. Prime may not block publication based on unfavorable results
- **Confidential information removal:** Prime may request removal of specific trade-secret parameters, unfiled patentable inventions, or Confidential Information. Subawardee will remove such content
- **Patent-filing delay:** If Prime identifies a patentable invention in the draft, publication is delayed by up to **60 additional calendar days** (90 days total from PI's submission to Prime) to allow provisional filing
- **Authorship:** all personnel meeting ICMJE authorship criteria are listed as co-authors regardless of Party

### 5.2 Publication acknowledgment

All publications include:

- Federal Award number
- Statement: "This research was supported in part by [Federal Awarding Agency] Award {{federal_award_number}}, with Gentle Reminder, Inc. as [prime / subawardee]."
- Data availability statement per journal requirements

## 6. DATA

### 6.1 Data ownership

- **Participant data** (medical records, cognitive assessments, etc.): owned by Subawardee and the participants per institutional data policy
- **Platform telemetry** (app usage, response latencies, session logs): owned by Prime; de-identified platform telemetry shared with Subawardee for analysis
- **Derived datasets** (statistical analyses, model outputs): joint

### 6.2 Data sharing

- **De-identification:** All data shared between Parties is de-identified per HIPAA Safe Harbor unless a Data Use Agreement (`docs/legal/data-use-agreement-template.md`) is separately executed for identifiable data
- **Secure transfer:** Data transferred via institutional SFTP, encrypted file transfer, or secure cloud with audit logging
- **Retention:** Per the Data Management Plan (`docs/clinical-validation/data-management-plan.md`) — 25 years after study close
- **Post-study access:** Subawardee retains copy of its analyses; Prime retains copy of platform telemetry; both may use de-identified data for their respective legitimate research purposes

### 6.3 NIH Data Management and Sharing Policy

If supported by NIH, both Parties comply with the NIH DMS Policy (effective 2023-01-25):

- Prospective Data Management and Sharing Plan submitted with application
- Scientific data deposited in a qualified repository post-publication
- Data made accessible consistent with FAIR principles

## 7. REPORTING

Subawardee submits:

- **Quarterly progress reports** to Prime (research milestones, spend, deliverables)
- **Annual progress reports** aligned with Federal Awarding Agency requirements
- **Final report** within 90 days of performance period end
- **Invention disclosures** per §4.3 (Bayh-Dole)
- **FFATA sub-recipient reporting** if subaward exceeds $30,000
- **Safety reports** aligned with Safety Monitoring Plan (`docs/clinical-validation/safety-monitoring-plan.md`)

## 8. HUMAN SUBJECTS PROTECTIONS

If the research involves human subjects:

- Subawardee secures IRB approval (or joint IRB reliance agreement) at its institution before enrollment
- Both Parties comply with 45 CFR Part 46 (Common Rule) and, where applicable, 21 CFR Part 50 (FDA)
- All study personnel complete CITI Human Subjects Research training (or equivalent) current within 3 years
- Adverse event reporting per SMP-001 and institutional IRB requirements

## 9. CONFIDENTIALITY

Each Party's Confidential Information is governed by the mutual NDA executed separately between the Parties or, if none, by this Section 9.

Each Party shall:
- Hold the other Party's Confidential Information in confidence
- Use it only for the Scope of Work
- Not disclose it to third parties except to personnel and counsel who have a need to know and are bound by equivalent confidentiality obligations
- Return or destroy Confidential Information at the conclusion of the Performance Period, subject to customary exceptions

## 10. TERM AND TERMINATION

- **Term:** from Effective Date until the end of Performance Period, subject to extensions with Federal Awarding Agency approval
- **Termination for cause:** either Party may terminate upon 30 days' written notice for material breach, uncured after 15 days' notice
- **Termination for convenience:** Prime may terminate with 60 days' written notice if the Federal Award is terminated, modified, or Prime loses its Award
- **Effects of termination:** Subawardee is entitled to payment for work performed and non-cancelable commitments up to termination date; both Parties return Confidential Information

## 11. MISCELLANEOUS

- **Independent contractors.** Each Party is an independent contractor, not an agent or employee of the other.
- **No third-party beneficiaries.** Except the Federal Awarding Agency.
- **Governing law.** [State of Subawardee's institution OR Delaware by mutual agreement]
- **Flow-down.** Subawardee complies with all federal terms and conditions flowed down from the Federal Award (included as Attachment D).
- **Indemnification.** Each Party is responsible for its own acts and omissions to the extent permitted by applicable law.
- **Insurance.** Subawardee maintains professional liability, general liability, and worker's compensation insurance per institutional standards.
- **Notice.** All notices in writing to the addresses above, effective on delivery.
- **Entire agreement.** This Agreement plus Attachments A–D plus any executed amendments. Supersedes prior discussions.
- **Counterparts and electronic signatures:** deemed originals.

---

## ATTACHMENTS

- **Attachment A:** Statement of Work
- **Attachment B:** Key Personnel
- **Attachment C:** Budget + Indirect Cost Rate Agreement
- **Attachment D:** Flow-Down Federal Terms and Conditions

---

## SIGNATURES

**GENTLE REMINDER, INC.**

By: _______________________
Name:
Title:
Date:

**[ACADEMIC INSTITUTION NAME]**

By: _______________________
Name:
Title:
Date:

---

*Template developed for Gentle Reminder, Inc. subaward collaborations. Final execution requires counsel review and may require institutional redlines (indirect cost rates, IRB reliance language, publication timelines, IP treatment). Not suitable for non-federal commercial collaborations — use a bilateral research agreement template instead.*
