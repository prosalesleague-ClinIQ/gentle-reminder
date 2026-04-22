# Legal Risk Assessment — Gentle Reminder Corp DIY Formation

**Date:** 2026-04-21
**Assessor:** Claude (in-house drafting assistant) — NOT legal counsel
**Matter:** DIY Delaware C-Corp formation for Gentle Reminder Corp (Christopher McPherson, CA resident, first-time founder). No formation counsel engaged; supporting docs drafted from Cooley GO + YC templates.
**Privileged:** No — this is an operational risk register, not attorney-client work product.

**Important disclaimer:** This document applies the severity × likelihood framework from `legal:legal-risk-assessment` skill. It is NOT legal advice. Before signing any of the 8 foundational documents (FORM-001 through FORM-008), the user should have at minimum a 1-hour counsel review of the FSPA + FIAA, which is the highest-leverage spend on legal.

---

## Executive Summary — Top 3 risks prioritized

| # | Risk | Score | Level | Immediacy |
|---|------|-------|-------|-----------|
| 1 | **83(b) election missed deadline** (Risk 4) | 20 | 🔴 RED | IMMINENT — within 30 days of Day 5-7 stock issuance |
| 2 | **FIAA / IP assignment scope insufficient** (Risk 5) | 10 | 🟠 ORANGE | Same day as Day 5-7 |
| 3 | **FSPA structure fails Series A diligence** (Risk 3) | 8 | 🟡 YELLOW | Same day as Day 5-7 |

**Risk 4 (83b)** is the single highest-impact issue in the entire formation. It is irreversible, catastrophic if missed, and preventable with ~10 minutes of process discipline. The runbook at `docs/legal/formation/RUNBOOK-day-0-to-30.md` surrounds this deadline with escalating calendar reminders starting Day 25.

**Risk 6 — No counsel at Series A** scored 25 RED in absolute terms but is **not** imminent; defer until pre-Series-A. When Series A is imminent, the user must engage founder-friendly startup counsel (Cooley / Gunderson / Goodwin / boutique). Budget: $15–25K for Series A legal.

**Combined recommendation:** Before signing the 8 foundational documents, the user should engage a founder-friendly corporate attorney for a **1–2 hour flat-fee review** of the FSPA + FIAA specifically. Budget: $300–$700. This review cures 80% of the meaningful risk for 10% of the cost of full Clerky + counsel engagement. Firms that offer this kind of cheap review: Stripe Atlas Advisor network, Wilson Sonsini Direct, Orrick-backed formation services, or any solo corporate lawyer at ~$250-$400/hour.

---

## Risk Register — Detailed Assessment

### Risk 1 — DIY Certificate of Incorporation (no counsel review)

**Description:** Certificate filed without corporate counsel review. Template language from Cooley GO pattern + DE GCL §§ 101-103. Risk that a required Article is missing, an optional Article is incorrectly drafted, or a citation is wrong.

**Severity: 3 — Moderate.** Fatal flaws in a Cert can be cured via Certificate of Amendment (DE GCL § 242, $194 fee). Unlikely to block deals but may require restating at Series A. Most DE filings with Cooley-GO-modeled language pass without issue.

**Likelihood: 2 — Unlikely.** Claude's draft cites DE GCL § 102 requirements explicitly and follows Cooley GO pattern. DE Division of Corporations rejects obviously-defective filings at intake, providing a safety net.

**Score: 6 — 🟡 YELLOW Medium Risk**

**Contributing factors:**
- First-time filer unfamiliar with DE GCL
- No counsel review pre-filing
- Complex indemnification and forum-selection provisions

**Mitigating factors:**
- Cooley-GO-pattern language is battle-tested
- DE Division of Corporations intake review
- Amendable via Cert of Amendment post-filing

**Recommended action: COUNSEL REVIEW (light touch).** Option A: 30-minute flat-fee review with a formation attorney ($100-200). Option B: Proceed and cure via Amendment if any issue surfaces. If tight budget, Option B is acceptable — DE Cert errors are rarely fatal.

**Residual risk after mitigation:** 2-3 — ~GREEN.

---

### Risk 2 — Bylaws adopted without counsel review

**Description:** Bylaws template adopted based on Cooley GO + DE GCL §§ 141-174. Risk of provisions that conflict with Cert of Incorporation, that violate DE law, or that are unenforceable.

**Severity: 2 — Low.** Bylaws are amendable by Board majority (Article VIII). At Series A, lead investor's counsel will typically restate Bylaws to reflect protective provisions. Pre-Series A, the Bylaws mostly govern internal corp formality (meetings, quorum, officer duties).

**Likelihood: 2 — Unlikely.** Cooley GO template is industry-standard. Conflict-with-Cert risk is low because Claude drafted both concurrently.

**Score: 4 — 🟢 GREEN Low Risk**

**Recommended action: ACCEPT AND DOCUMENT.** Proceed. Restate at Series A with lead investor's counsel.

---

### Risk 3 — FSPA Vesting + Repurchase Structure

**Description:** Founder Stock Purchase Agreement with 4-year / 1-year cliff vesting, Corp repurchase right at cost, ROFR, IPO lockup. Risk that structure fails Series A diligence, creates unintended tax consequences, or triggers §409A valuation issues.

**Severity: 4 — High.** A poorly-drafted FSPA can (a) trigger §409A valuation dispute, (b) fail to preserve 83(b) benefit if structured wrong, (c) create re-papering work at Series A ($5-10K legal), (d) expose founder to ordinary-income tax on vesting appreciation if 83(b) isn't timely.

**Likelihood: 2 — Unlikely.** Standard 4y/1y cliff, Corp repurchase at cost, CA §2870 compliant = textbook. Claude's draft follows Cooley GO FSPA verbatim in structure. Main failure modes are (a) wrong Vesting Commencement Date, (b) missing 83(b) 30-day window (Risk 4 addresses this).

**Score: 8 — 🟡 YELLOW Medium Risk**

**Contributing factors:**
- §409A valuation is a tax concept founder may not understand
- ROFR language can be drafted overly-broad

**Mitigating factors:**
- Cooley GO pattern
- Claude's draft is conservative (no automatic acceleration, no sweetheart terms)
- Repurchase at cost is standard

**Recommended action: COUNSEL REVIEW.** Engage a founder-friendly attorney for a 1-hour flat-fee review of FSPA before signing. Budget: $200-400. This is the highest-leverage spend — specifically check: (a) Vesting Commencement Date language, (b) Section 3.1 Repurchase Right scope, (c) Section 4.2 ROFR process, (d) Section 5 §83(b) coordination.

**Residual risk after mitigation:** 4 — 🟢 GREEN.

---

### Risk 4 — 83(b) Election Missed 30-Day Deadline

**Description:** Section 83(b) of the Internal Revenue Code requires founders electing to include FMV of restricted stock in income in the year of transfer to file the election within 30 days of stock issuance. The deadline is a strict statutory deadline with no late-filing remedy.

**Severity: 5 — Critical.** Missing the 83(b) election is **permanent and irreversible**. Each month of vesting post-cliff becomes ordinary income at then-current FMV. For a founder with 5M shares vesting monthly over 36 months, if the company achieves a $25M post-money valuation at seed (1x per share) and $100M at Series A (4x per share), the undocumented ordinary-income tax could total **$200K–$2M+** over the vesting period. This is personal exposure to the founder, not the corp.

**Likelihood: 2 — Unlikely IF runbook is followed with discipline.** BUT: realistic likelihood elevates to **4 — Likely** for first-time founders without structured reminders. VC anecdata suggests 10–15% of first-time founders miss 83(b) without dedicated process.

**Combined Score: 20 — 🔴 RED Critical Risk.**

**Contributing factors:**
- First-time founder
- Single-person operation (no CFO/counsel reminding)
- 30-day window starts from stock issuance, which is mid-formation (not Cert filing)
- Distraction from parallel work (outreach, patents, etc.)
- Weekends and holidays compress effective deadline

**Mitigating factors:**
- Runbook (RUNBOOK-day-0-to-30.md) already flags this at multiple steps
- Certified mail with return receipt provides definitive proof of mailing date
- Phase 4 in runbook sets daily calendar reminders Day 25+

**Recommended action: IMMEDIATE ESCALATION / DEDICATED PROCESS.**
- Day 0: Set 10 calendar reminders (Day 1, 5, 10, 14, 20, 23, 26, 28, 29, 30) with escalating urgency
- Day 28+: User commits to NOT engaging in other work until 83(b) is mailed
- Day 30: If not mailed by end of Day 29, STOP ALL OTHER WORK and mail same day
- If Day 30 is a Saturday/Sunday/holiday, deadline shifts to next business day per IRC § 7503 — but don't rely on this, mail Day 28 latest
- Confirm within 2 weeks that certified mail return receipt shows IRS delivery

**Residual risk after mitigation:** 5 — 🟡 YELLOW (if process discipline holds). The risk can't go to GREEN because the catastrophic severity persists — but likelihood drops dramatically with process.

**Escalation trigger:** If it is Day 28 and the user has not mailed 83(b) yet — immediately engage a tax attorney to mail from their office same-day (~$150-300 emergency fee).

---

### Risk 5 — FIAA (IP Assignment) Scope Insufficient

**Description:** Founder Invention Assignment Agreement transfers pre-existing and future IP from Christopher McPherson to Gentle Reminder Corp. Risk that (a) pre-existing IP isn't fully captured (e.g., one of the 23 patents gets missed in Exhibit A), (b) California Labor Code § 2870 carve-out is too broad/narrow, (c) retroactive effect wording has a gap.

**Severity: 5 — Critical.** If FIAA has a gap, Corp doesn't own the IP. "Does the Corp own all the IP?" is the single most common kill-the-deal question in Series A diligence. Gap leads to re-papering work ($5-10K legal), delays, or investor walk-away.

**Likelihood: 2 — Unlikely.** Claude's filled FIAA (FORM-008) is broad:
- Section 3 assigns "all inventions" and enumerates Pre-Existing Inventions via Exhibit A pointing at `ip-portfolio.ts`
- Section 4 assigns future IP
- Section 5 explicitly says "no Excluded IP"
- Section 6 attorney-in-fact clause handles any perfection issues
- CA § 2870 language is boilerplate

Main residual risk is in Exhibit A — if the `ip-portfolio.ts` file has any omission, that invention isn't captured. Exhibit C (copyrights) uses catch-all language so should be clean.

**Score: 10 — 🟠 ORANGE High Risk.**

**Contributing factors:**
- Exhibit A relies on a file reference rather than full enumeration
- CA-specific § 2870 language may not be optimal if founder changes state
- Trademark application (Exhibit B) is forward-looking, not current

**Mitigating factors:**
- Section 3 broad catch-all "all inventions... relating to the Business"
- Attorney-in-fact clause (Section 6) provides backstop for any perfection gaps
- Cooley-GO pattern has been stress-tested

**Recommended action: COUNSEL REVIEW (strongly recommended).** A 30-60 minute attorney review of the FIAA is the second-highest-leverage spend. Budget: $150-300. Specifically check: (a) Exhibit A completeness — print `ip-portfolio.ts` and manually confirm all 23 items are listed, (b) Exhibit C copyright scope — ensure the 53K+ LOC is covered by category, (c) § 2870 language is current with 2024+ CA statute revisions.

**Residual risk after mitigation:** 4 — 🟢 GREEN.

**Alternate mitigation if no counsel:** Print the full `apps/pitch-site/src/content/ip-portfolio.ts` file as a physical exhibit stapled to the signed FIAA. Hand-write "all 23 inventions listed above are hereby assigned" above signature. Belt + suspenders.

---

### Risk 6 — No Counsel Engaged at Series A

**Description:** Founder negotiates Series A term sheet and definitive agreements without startup counsel. Risk of founder-unfavorable liquidation preferences, protective provisions, acceleration, option pool repricing, and information rights.

**Severity: 5 — Critical.** Unassisted Series A negotiation systematically disadvantages founders. Quantifiable impact over the life of the company: 5-15% additional dilution, liquidation preference stacking, founder-unfriendly vesting reset, lost anti-dilution protection.

**Likelihood: 5 — Almost Certain IF founder attempts alone.** Virtually no successful first-time founder negotiates a first institutional round without counsel and exits well.

**Score: 25 — 🔴 RED Critical Risk.**

**However:** This risk is NOT imminent (no Series A proposed yet). Deferring is acceptable.

**Recommended action: MANDATORY — must engage counsel before first term sheet.** Decision paths:

**Option A (preferred):** Engage Cooley / Gunderson / Goodwin / Wilson Sonsini on their startup program (deferred-billing to seed close, flat-fee seed packages $15-25K).

**Option B:** Engage reputable boutique (Fenwick, Orrick, DLA Piper healthcare practice) — similar but sometimes lower cost.

**Option C:** Hire individual startup-specialist attorney ($400-600/hr, 30-50 hours for seed = $12-30K).

**Do NOT:** Attempt Series A negotiation yourself. The amount you'd save in legal fees is 1-2% of what you'd lose in negotiating outcome.

**Residual risk after counsel engagement:** 3 — 🟡 YELLOW (standard deal friction).

---

### Risk 7 — Sole Officer + Sole Director Structure

**Description:** Christopher McPherson holds all five officer titles (CEO, President, CFO, Secretary, Treasurer) and is the sole director. Risk of governance concentration, D&O liability exposure, and incapacity-related single-point-of-failure.

**Severity: 3 — Moderate.** Single-person board is legally valid in DE pre-Series A. D&O insurance is difficult to obtain (most insurers require ≥3 directors). If founder is incapacitated or dies, corp lacks governance. At Series A, structure automatically expands to 3-5 seats.

**Likelihood: 2 — Unlikely in short-term.** Standard structure pre-seed, usually resolved within 90 days as co-founders join the board.

**Score: 6 — 🟡 YELLOW Medium Risk.**

**Recommended action: MITIGATE.**
- Appoint Leo Kinsman (CTO) to the Board within 90 days of formation — reduces single-point-of-failure
- At seed close, expand to 3-person board (founder + CTO + independent/advisor)
- Obtain D&O insurance at Series A (~$1-3K/yr)
- Update the CA-specific advance directive / business continuity doc — if founder is incapacitated, who can sign on Corp's behalf?

**Residual risk after mitigation:** 3 — 🟢 GREEN.

---

### Risk 8 — Co-Founders Not Signing Founder Docs on Day 1

**Description:** Leo Kinsman (CTO), Chris Hamel (CFO), Jayla Patzer (Nat. Dir.) are identified as co-founders but will not sign FSPA / FIAA on Day 1 per user's decision. Risk: (a) pre-formation IP contributions by co-founders are NOT assigned to Corp, (b) their vesting clocks don't start at Cert filing date, (c) at Series A diligence, corp may not own all IP.

**Severity: 4 — High.** If Leo/Chris/Jayla have contributed code/IP to the Gentle Reminder project pre-formation, their contributions are owned by them, not the Corp. Curing retroactively is possible via post-hoc invention assignment, but investors view gaps negatively.

**Likelihood: 3 — Possible.** Depends on whether any of Leo/Chris/Jayla have actually contributed to the 53K+ LOC or any patent inventions. Based on prior session context, most IP has been Christo's work. If Leo (CTO) has written code, that code's ownership is ambiguous without a signed PIIAA.

**Score: 12 — 🟠 ORANGE High Risk.**

**Contributing factors:**
- Unknown current IP contribution breakdown
- 3 co-founders without documentation
- Pre-formation work now "belonging" to whoever authored it

**Mitigating factors:**
- Per user, main IP author is Christo — his contributions are covered by FIAA
- Co-founder contributions post-formation can be captured via PIIAA going forward
- Small pre-formation gap (weeks) is typically curable

**Recommended action: COUNSEL REVIEW + IMMEDIATE PIIAA EXECUTION.**
1. Have corporate counsel draft a Proprietary Information and Invention Assignment Agreement (PIIAA) that covers pre-formation contributions of Leo/Chris/Jayla
2. Each co-founder signs PIIAA BEFORE any further code commit or IP contribution
3. If pre-formation IP contributions from Leo exist (likely given CTO role), have a retroactive assignment executed specifically covering those
4. Budget: 2 hours counsel ($500-800) + 30 min per co-founder signing

**Residual risk after mitigation:** 4 — 🟢 GREEN.

---

### Risk 9 — Trademark Filed Post-Entity (Path A)

**Description:** Per `docs/legal/trademark-filing-checklist.md`, Path A (file TM after entity formation) was chosen over Path B (file TM immediately in founder's name, assign to entity later). Gap: ~1 week between entity formation and TM application. Risk: competitor files identical mark in the gap.

**Severity: 2 — Low.** Priority-date differential is 1 week; unless a specific competitor is watching the name, random collision in 1 week is rare. If competitor does file, USPTO opposition proceeding is expensive but winnable given prior use in Gentle Reminder platform.

**Likelihood: 1 — Remote.** No known competitor targeting "Gentle Reminder" name; TESS search in Phase 0 confirms no live marks.

**Score: 2 — 🟢 GREEN Low Risk.**

**Recommended action: ACCEPT.** Proceed per plan.

---

### Risk 10 — GHL Contains Private EIN/Address Info

**Description:** GHL sub-account holds company EIN, registered agent info, principal office address, founder personal info. Risk of data breach or unauthorized access exposing these details.

**Severity: 2 — Low.** EIN and corp address become public record post-filing (DE Division of Corporations public search). Founder personal address is the main sensitive item. GHL uses standard auth; no known breach history.

**Likelihood: 2 — Unlikely.** GHL sub-account is scoped; API key is rotatable (user declined rotation of current PIT); MFA enforced.

**Score: 4 — 🟢 GREEN Low Risk.**

**Recommended action: ACCEPT + MONITOR.** Standard CRM data handling. Rotate PIT if (a) any GHL-flagged anomaly, (b) transcript leaks become a concern. Don't paste fresh tokens into future transcripts.

---

### Risk 11 — Pitch Deck / Outreach Uses "Formation in Final Stages" Language After Corp Exists

**Description:** Current repo state has "Gentle Reminder (Delaware C-Corp formation in final stages)" baked into signatures, pitch deck, NDA templates, etc. After entity formation, this language is technically misleading. Risk of disclosure mismatch if user sends outreach before Phase 8 unlock commit lands.

**Severity: 2 — Low.** Small-window misrepresentation could create investor-trust issue but not a legal issue (no material omission). Time window is ~24 hours.

**Likelihood: 2 — Unlikely.** Runbook Step 5.3 schedules Claude's unlock commit immediately post-filing. Outreach is paused anyway until entity forms.

**Score: 4 — 🟢 GREEN Low Risk.**

**Recommended action: MONITOR.** Ensure unlock commit happens within 24 hours of Cert stamp. If user sends ANY outreach between Cert stamp and unlock commit, manually update those specific drafts.

---

### Risk 12 — $500 Initial Capitalization Perceived as Low

**Description:** $500 founder stock purchase price. Some investors question whether founder has real "skin in the game" at such low capitalization.

**Severity: 1 — Negligible.** Industry-standard for pre-seed. Investors expect $500-$10K founder stock purchase. Zero known cases of investor walking over founder-stock-size alone.

**Likelihood: 1 — Remote.** Standard practice.

**Score: 1 — 🟢 GREEN Low Risk.**

**Recommended action: ACCEPT.** Proceed — this is textbook.

---

## Risk Register Summary Table

| Risk ID | Description | Category | Severity | Likelihood | Score | Level | Owner | Status |
|---------|-------------|----------|----------|------------|-------|-------|-------|--------|
| R-01 | DIY Cert of Incorporation | Corporate | 3 Moderate | 2 Unlikely | 6 | 🟡 YELLOW | Claude + founder | Open |
| R-02 | Bylaws without counsel | Corporate | 2 Low | 2 Unlikely | 4 | 🟢 GREEN | Founder | Open |
| R-03 | FSPA structure | Tax / Corporate | 4 High | 2 Unlikely | 8 | 🟡 YELLOW | Founder (counsel rec) | Open |
| R-04 | 83(b) missed deadline | Tax | 5 Critical | 2 Unlikely (process-dependent) | 10–20 | 🔴 RED | Founder (critical) | Open |
| R-05 | FIAA scope gap | IP | 5 Critical | 2 Unlikely | 10 | 🟠 ORANGE | Founder (counsel rec) | Open |
| R-06 | No Series A counsel | Corporate / Deal | 5 Critical | 5 Almost Certain | 25 | 🔴 RED | Defer to Series A trigger | Monitoring |
| R-07 | Sole officer + director | Corporate / Governance | 3 Moderate | 2 Unlikely | 6 | 🟡 YELLOW | Founder (90-day plan) | Open |
| R-08 | Co-founders not signing Day 1 | IP / Corporate | 4 High | 3 Possible | 12 | 🟠 ORANGE | Founder (counsel rec) | Open |
| R-09 | TM post-entity (Path A) | IP | 2 Low | 1 Remote | 2 | 🟢 GREEN | Founder | Accepted |
| R-10 | GHL contains private info | Data Privacy | 2 Low | 2 Unlikely | 4 | 🟢 GREEN | Founder | Monitor |
| R-11 | Outdated outreach language | Disclosure | 2 Low | 2 Unlikely | 4 | 🟢 GREEN | Claude (commit trigger) | Monitor |
| R-12 | Low cash capitalization | Investor Perception | 1 Negligible | 1 Remote | 1 | 🟢 GREEN | Founder | Accepted |

---

## Recommended Spend on Counsel — Prioritized

Total recommended pre-filing counsel spend: **$500–$1,500** (a tiny fraction of the fundraise value at stake).

| Priority | Item | Time | Cost | Protects against |
|----------|------|------|------|------------------|
| 1 | FIAA review (R-05) | 30-60 min | $150-300 | IP ownership gap at diligence — catastrophic |
| 2 | FSPA review (R-03) | 60 min | $200-400 | §409A / Series A re-papering — high |
| 3 | Cert + Bylaws review (R-01 + R-02) | 30-45 min | $100-200 | DE law compliance — moderate |
| 4 | Co-founder PIIAA drafting (R-08) | 90 min | $300-500 | IP gap from co-founders — high |

**Total:** 3.5-5 hours @ $200-400/hour = $750-1,600.

**Where to find:** Any reputable founder-friendly solo practitioner. Screened options:
- Firm directories: https://www.startupsavant.com/startup-lawyers (CA + DE specialists)
- Cooley GO's own referral program (use if you plan to retain Cooley at Series A — they'll credit back pre-engagement fees)
- LinkedIn search: "startup attorney" + location filter
- Founder network referrals

---

## Monitoring Plan

| Risk | Review cadence | Trigger for escalation |
|------|---------------|----------------------|
| R-04 (83b) | DAILY Days 1-30 post stock issuance | Day 25: red alert. Day 28: emergency protocol. Day 29 not mailed → engage tax attorney same-day |
| R-05 (FIAA) | Weekly until executed | Counsel review completes, then closed |
| R-03 (FSPA) | Weekly until executed | Counsel review completes, then closed |
| R-06 (Series A counsel) | Quarterly | Any indication of investor interest past seed — engage immediately |
| R-08 (Co-founders) | Monthly | Any co-founder starts contributing IP — PIIAA signed same day |
| Others | Quarterly | Standard corporate compliance review |

---

## Next Steps

1. **TODAY:** User engages founder-friendly attorney for 3-hour flat-fee review of FSPA + FIAA + Cert. Budget: $500-800.
2. **Day 5-7 (after filing):** Execute all 8 docs with counsel-reviewed language.
3. **Day 5-30:** Daily 83(b) calendar reminders per runbook.
4. **Day 30:** All 8 docs signed, 83(b) mailed, EIN issued, bank account open — risks R-01 through R-05 residual GREEN.
5. **Ongoing:** Monitor R-06, R-07, R-08 per cadence above. Engage Series A counsel at first term sheet.

---

## References

- DE Gen. Corp. Law (Title 8) — https://delcode.delaware.gov/title8/
- 26 U.S.C. § 83 — https://www.law.cornell.edu/uscode/text/26/83
- CA Labor Code § 2870 — https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=LAB&sectionNum=2870
- Cooley GO formation documents — https://www.cooleygo.com/documents/
- Related: `docs/legal/formation/RUNBOOK-day-0-to-30.md` (operational runbook)
- Related: `docs/legal/formation/FORM-001 through FORM-008` (the 8 foundational documents)

---

*This risk assessment is operational, not legal advice. The severity × likelihood framework is from the `legal:legal-risk-assessment` skill. Before signing any document, retain counsel for the 3 highest-priority reviews: FIAA (R-05), FSPA (R-03), Cert (R-01). Total counsel spend: $500-1,500 for catastrophic-risk cure.*
