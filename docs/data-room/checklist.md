# Data Room — Document Checklist

**Usage:** Required documents for each tier of data-room access, in the order investors typically ask for them. Mark `[x]` when a document is staged and accessible via the tier's platform.

---

## Tier 1 — Public-safe overview (self-serve from pitch site)

- [x] 16-slide pitch deck — `apps/pitch-site/public/Gentle-Reminder-Pitch-Deck.pptx` + `.pdf`
- [x] 1-page executive summary — `apps/pitch-site/public/Gentle-Reminder-Exec-Summary.pdf`
- [x] Public IP portfolio overview — `/ip` on pitch site
- [x] Team bios — `/private/team` + LinkedIn
- [x] Market positioning — `/private/exec-summary` + deck Slides 2, 5
- [x] Competitive landscape — deck Slide 11
- [x] Regulatory pathway summary — deck Slide 7 + `/clinical` on pitch site
- [x] Contact information — `mack@matrixadvancedsolutions.com`

## Tier 2 — Post-NDA diligence (Docsend)

### Company & legal
- [ ] Certificate of Incorporation (Delaware) — *awaiting entity formation*
- [ ] EIN confirmation letter from IRS — *awaiting entity formation*
- [ ] Founder IP Assignment Agreement — *to be signed at entity formation*
- [ ] Cap table — Carta / Pulley export, PDF
- [ ] Bylaws — *post-entity template from Clerky / Stripe Atlas*
- [ ] Founder stock purchase agreement + 83(b) filing — *post-entity*
- [ ] Active NDA with each Tier 2 viewer — individually attached per viewer

### Financial
- [ ] 5-year financial model — Excel / Google Sheets export to PDF
- [ ] Historical bookkeeping (if any) — QuickBooks / Xero export
- [ ] Bank statements (last 3 months) — *post-entity, post-bank-account*
- [ ] Budget to actuals variance report — *post-seed close*
- [ ] Key vendor contracts + burn summary — *as available*

### IP & technology
- [x] Full IP portfolio with tier rankings — `apps/pitch-site/src/content/ip-portfolio.ts`
- [ ] Per-IP provisional patent specifications — *covered by NDA; shared individually*
- [x] Prior art analysis summary — `docs/ip/PRIOR-ART-SEARCH.md`
- [x] Inventor disclosure with assignment chain — *to be finalized at entity formation*
- [x] 510(k) predicate analysis — deck Slide 7 + `docs/regulatory/`

### Regulatory & clinical
- [x] IEC 62304 Software Lifecycle compliance summary
- [x] ISO 14971 Risk Management (FMEA) summary — `docs/iso-14971/`
- [x] ISO 13485 QMS framework — `docs/iso-13485/`
- [x] 21 CFR Part 11 Electronic Records compliance — `docs/cfr-part-11/`
- [x] STRIDE Cybersecurity Assessment — `docs/security/`
- [x] Algorithm Transparency Module — `docs/algorithm-transparency/`
- [x] Clinical Validation Protocol (CVP-001) — `docs/clinical-validation/study-protocol.md`
- [x] Informed Consent Template (ICF-001) — `docs/clinical-validation/informed-consent-template.md`
- [x] Data Management Plan (DMP-001) — `docs/clinical-validation/data-management-plan.md`
- [x] Safety Monitoring Plan (SMP-001) — `docs/clinical-validation/safety-monitoring-plan.md`
- [x] 510(k) submission plan + timeline

### Commercial
- [ ] Pipeline by pilot facility — *as LOIs land*
- [ ] Target-institution list — `apps/pitch-site/src/content/outreach-plan.ts` (internal)
- [ ] Advisor list + engagement status — `apps/pitch-site/src/content/clinical-advisors.ts`
- [ ] Grant status summary — `docs/grants/` (NIA SBIR, R21, BrightFocus, Alz Assoc)

## Tier 3 — Post-LOI / term sheet (Docsend tight)

### Deep IP / code
- [ ] Architecture deep-dive document
- [ ] GitHub read-only access for lead investor's due-diligence engineer (time-boxed 72 hours)
- [ ] Trade-secret parameter **summary** (categories and purposes, not values)
- [ ] Test coverage report + CI pipeline summary

### References
- [ ] Customer / pilot-facility references (with consent)
- [ ] Advisor references (with consent)
- [ ] Prior investor references (if any)

### Terms documents
- [ ] Current term sheet draft (negotiated state)
- [ ] SAFE / convertible note history (if any pre-seed)
- [ ] Prior round investment agreements
- [ ] Reps & warranties exhibit

---

## Status key

- `[x]` = document exists in the repo or is objectively available
- `[ ]` = document not yet prepared; may require entity formation, signed NDAs, or late-stage diligence

## Next actions (to raise Tier 2 readiness)

1. Entity formation this week unlocks the first 7 Tier 2 legal documents
2. Open business bank account + Carta immediately post-entity
3. Execute founder stock purchase + 83(b) within 30 days of entity
4. File provisional patents (Tier 1) — moves 5 Tier 2 IP docs into place
5. Docsend account setup (~15 min) — prerequisite for Tier 2 delivery

## Related documents

| Document | Location |
|----------|----------|
| Data room README | `docs/data-room/README.md` |
| Access policy | `docs/data-room/access-policy.md` |
| NDA templates | `apps/pitch-site/src/content/nda-templates.ts` |
| Pre-entity safety | `docs/legal/pre-entity-outreach-safety.md` |
