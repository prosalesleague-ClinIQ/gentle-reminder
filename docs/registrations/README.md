# Registrations Playbook

**CONFIDENTIAL — Internal**

Every registration required to (a) form the company, (b) file patents, (c) submit federal grants, (d) deploy the platform. Listed in the correct order of completion.

## Critical Path Sequencing

```
[1] Delaware C-Corp Formation ────┐
                                   ├─▶ [2] EIN ─▶ [3] Bank ─▶ [4] D-U-N-S / UEI
[5] USPTO + Pay.gov ───────────────┘                                    │
                                                                        ▼
                                                                  [6] SAM.gov ◀── 3-5 WEEKS (critical path)
                                                                        │
                                                                        ▼
                                                         [7] Grants.gov  +  [8] eRA Commons
                                                                                    │
                                                                                    ▼
                                                                            [9] SBC Registration
                                                                                    │
                                                                                    ▼
                                                                            READY to submit SBIR
```

**Longest pole:** SAM.gov UEI registration takes **3-5 weeks**. Start this first.

---

## Registration Order & Deep Links

### 1. Delaware C-Corp Formation
**Why:** All subsequent registrations require a legal entity. VC fundraising requires Delaware C-Corp specifically.
**How:**
- **Stripe Atlas** — $500 — https://stripe.com/atlas (fastest, best for technical founders)
- **Clerky** — $299-$799 — https://www.clerky.com (good for seed-round prep, lawyer-reviewed)
- **Local attorney** — $500-$2,000 — slower but personal relationship
**Deliverables:** Certificate of Incorporation, bylaws, board consent, founder stock issued.
**Time:** 2-3 business days.

### 2. EIN (Employer Identification Number)
**Why:** Required for bank account, IRS reporting, federal registrations.
**How:**
- **IRS direct (free):** https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online
- Stripe Atlas and Clerky can do this as part of formation.
**Time:** Same day online (weekdays 7am-10pm ET).
**Deliverable:** EIN letter (SS-4).

### 3. Business Bank Account
**Why:** Needed for USPTO filings, grant disbursements, contract payments.
**How:**
- **Mercury** — https://mercury.com — fast startup-friendly, no fees, FDIC-insured
- **Brex** — https://www.brex.com — strong fintech controls
- **Chase / First Republic** — traditional but slower
**Need:** EIN + Certificate of Incorporation.
**Time:** 1-3 business days.

### 4. D-U-N-S Number (deprecated — use UEI via SAM.gov instead)
**Note:** The D-U-N-S number was required for federal grants through April 2022. It has been **replaced by the Unique Entity ID (UEI)**, which is obtained via SAM.gov (see step 6 below). No separate D-U-N-S registration is needed.

### 5. USPTO + Pay.gov Accounts
**Why:** Required to file provisional patent applications.
**How:**
- **USPTO.gov account:** https://account.uspto.gov — free, 10 minutes
- **Patent Center access:** https://patentcenter.uspto.gov — free, requires USPTO.gov account
- **Pay.gov:** https://pay.gov — free, for paying USPTO fees
- **EFS-Web:** https://efs.uspto.gov/efile/portal/efs-unregistered — alternative filing interface
**Time:** 30-60 minutes total.
**Deliverables:** Active logins for patent filing.

### 6. SAM.gov — Unique Entity ID (UEI) 🔴 CRITICAL PATH
**Why:** Required for ALL federal grant applications. **Takes 3-5 weeks.** Start this FIRST.
**How:**
- Go to https://sam.gov/
- Create a Login.gov account if you don't have one
- Click "Register Entity"
- Provide: legal entity name, address, EIN, bank account for payment, NAICS code (use **541715** for scientific research & development, or **541990** for other professional services)
- Complete entity validation (IRS + Dun & Bradstreet cross-check)
**Common blockers:**
- Address mismatch between SAM.gov and IRS/USPS records — use **exact** address format from EIN letter
- Entity validation takes 2-3 weeks; monitor email for SAM.gov notifications
**Deliverable:** UEI (12-character alphanumeric code) + active SAM.gov registration (valid 1 year).
**Time:** 3-5 weeks total. Monitor weekly.

### 7. Grants.gov Registration
**Why:** Portal for submitting federal grant applications (some agencies use this; NIH SBIR uses NIH Assist/Workspace instead, but maintain Grants.gov account as backup).
**How:**
- Go to https://www.grants.gov/
- Click "Register" → "Applicant Registration"
- Need UEI (from SAM.gov step 6) — cannot complete without it
- Designate an Authorized Organization Representative (AOR)
**Time:** 30 minutes (once SAM.gov is complete).
**Deliverable:** Grants.gov account with AOR authorization.

### 8. eRA Commons Registration (NIH)
**Why:** Primary system for NIH grant submissions, including all SBIRs to NIA.
**How:**
- Go to https://public.era.nih.gov/commons/
- Signing Official (SO) account: for the company (typically the CEO or COO)
- Principal Investigator (PI) account: for the lead scientist
- Each person needs their own eRA Commons ID
**Process:**
1. SO registers the organization (1-2 business days for approval)
2. SO creates PI accounts within the organization
3. PI completes profile including biosketch information
**Time:** 1-2 business days for SO approval; PI accounts created same-day after SO is active.
**Deliverable:** Active eRA Commons ID for PI, SO account for submissions.

### 9. Small Business Concern (SBC) Registration
**Why:** Required to demonstrate SBIR eligibility.
**How:**
- Go to https://www.sbir.gov/registration
- Complete SBC registration form
- Certify: (a) <500 employees, (b) US-owned (51%+), (c) for-profit
**Time:** Self-certification, immediate.
**Deliverable:** SBC Registry Number.

### 10. State-Level Registrations (if applicable)
- **Foreign qualification** in any state where you operate (not Delaware): $50-$300/year
- **State tax registration** (sales tax, employment tax) if you have employees or sell in that state
- **Business license** in city/county of operation

---

## Supporting Registrations (Parallel Tracks)

### A. Alzheimer's Association Grant Programs
- https://www.alz.org/research/for_researchers/grants — review deadlines (multiple programs annually)
- Most have RGP (Research Grants Program) and PtC (Part the Cloud) tracks

### B. BrightFocus Foundation
- https://www.brightfocus.org/alzheimers/grants — annual cycle, deadline typically November
- $300K over 3 years

### C. NIH ASSIST (submission portal for grants)
- https://public.era.nih.gov/assist/ — web-based NIH grant submission (alternative to Workspace)
- Login via eRA Commons credentials

### D. HHS Vulnerability Disclosure Program (for platform security)
- https://www.hhs.gov/vulnerability-disclosure-policy — voluntary; demonstrates security maturity

### E. FDA Establishment Registration (Pre-Market)
- https://www.fda.gov/medical-devices/how-study-and-market-your-device/device-registration-and-listing — required once platform is commercially distributed (post-510(k))
- Free for initial registration; listing fee ~$8,000/year

---

## Quick-Start Checklist (Order of Execution)

- [ ] **Day 1:** Form Delaware C-Corp (Stripe Atlas recommended — 2-hour online form)
- [ ] **Day 1-3:** Obtain EIN (Stripe Atlas includes this, OR direct via IRS.gov)
- [ ] **Day 3-5:** Open business bank account (Mercury or Brex)
- [ ] **Day 5:** Start SAM.gov UEI registration ← **do this now, it's the long pole**
- [ ] **Day 5:** Create USPTO.gov and Pay.gov accounts
- [ ] **Day 7-10:** Begin patent attorney engagement (parallel to SAM.gov waiting)
- [ ] **Day 10:** Register SBC at sbir.gov/registration
- [ ] **Day 10-14:** Grants.gov registration (requires UEI — blocked until SAM.gov completes)
- [ ] **Day 10-14:** eRA Commons Signing Official account (can start before SAM.gov in parallel)
- [ ] **Week 4-5:** SAM.gov UEI issued
- [ ] **Week 5:** Complete Grants.gov + eRA Commons PI accounts
- [ ] **Week 5:** READY TO SUBMIT SBIR

---

## Cost Summary

| Item | One-Time | Annual |
|------|--------:|-------:|
| Delaware C-Corp formation | $299-$800 | — |
| Delaware Franchise Tax | — | ~$450 |
| Registered Agent (DE) | — | ~$100-$300 |
| EIN | $0 | — |
| SAM.gov registration | $0 | $0 (must renew annually) |
| USPTO accounts | $0 | — |
| eRA Commons / Grants.gov / SBC | $0 | — |
| Mercury / Brex business banking | $0 | $0 |
| **Total immediate** | **$299-$800** | **$550-$750** |

---

## Red Flags / Common Problems

1. **SAM.gov entity validation rejection** — almost always an address mismatch. Use the EXACT address on your IRS EIN letter, down to "STE" vs "Suite".
2. **NAICS code mismatch** — use 541715 (Research and Development in the Physical, Engineering, and Life Sciences) or 541990 (All Other Professional, Scientific, and Technical Services) for Gentle Reminder. Choose only ONE primary.
3. **eRA Commons SO approval delay** — contact era helpdesk at commons@od.nih.gov if pending >3 business days.
4. **Grants.gov AOR authorization fails** — requires UEI first; common mistake is attempting before SAM.gov is active.
5. **SBC Registration vs. Small Business Administration size standard** — use NAICS 541715 size standard ($47M average receipts over 3 years or <500 employees); we qualify.

---

## Who Is The Signing Official (SO) / AOR?

For most small startups, the Signing Official and Authorized Organization Representative are the same person — typically the CEO or founder. This person:
- Has legal authority to bind the company
- Submits final grant applications on behalf of the organization
- Must have their own eRA Commons account with SO role

A single-founder company can have the founder serve as both PI and SO (allowed for small businesses).
