# NEXT STEPS — What You Must Do (and the exact click-paths)

**Purpose:** Single-page action checklist so you can get from "TESS clean" to "Cert filed + 83(b) mailed" in one focused 3-hour session.
**Last updated:** 2026-04-22
**Status:** Phase 0 complete (TESS clean). All prep-work I can do autonomously is done. Remaining actions require your signature, payment, SSN, or physical presence.

---

## Step 2 — DE name availability check (5 min, USER)

Claude cannot programmatically query the DE Division's stateful ASP.NET search form. You must do this manually.

**URL:** [https://icis.corp.delaware.gov/ecorp/entitysearch/namesearch.aspx](https://icis.corp.delaware.gov/ecorp/entitysearch/namesearch.aspx)

**Search term:** `Gentle Reminder Health Corp`

**Expected result:** "No record found" or "Entity name is available."

**If taken:** Pivot to one of:
- `Gentle Reminder, Inc.`
- `Gentle Reminder Health Corp`
- `Gentle Reminder Platform Corp`
- `GR Dementia Care Corp`

**Save:** Right-click → Save As → `docs/legal/trademark-search-results/de-name-check-2026-MM-DD.pdf`

---

## Step 3 — Save TESS screenshot (2 min, USER)

You mentioned TESS is clean. Save the search results page as PDF:
- Browser → Print → Save as PDF
- File → `docs/legal/trademark-search-results/tess-2026-MM-DD.pdf`

This becomes your evidence in the event of a future TM dispute: "I searched on [date] and found no conflict."

---

## Step 4 — Register a DE Registered Agent (10 min, USER)

**Recommendation (locked after 2026 pricing research): Harvard Business Services**

Why Harvard over alternatives:
- **$50/yr renewal** (lowest long-term cost of reputable agents — [confirmed in 2026 pricing](https://www.delawareinc.com/compare-registered-agent-fees/))
- **Delaware-native** since 1981 — knows DE GCL cold
- **Same-day filing** available if you pay for expedited
- **Free compliance reminders** for DE franchise tax + annual report
- **Mail forwarding** included

Alternatives (for reference):
| Service | Annual renewal | Notes |
|---------|---------------|-------|
| Harvard Business Services | **$50** | ← recommended |
| Northwest Registered Agent | $125 | Better UX, multi-state focus, higher price |
| InCorp Services | $99 | Cheaper than NW but weaker customer service per 2026 reviews |
| Spiegel & Utrera (AmeriLawyer) | $149 | Legacy option, higher price |

### Sign-up click path (Harvard):

1. Go to [https://www.delawareinc.com/ourservices/appoint-registered-agent/](https://www.delawareinc.com/ourservices/appoint-registered-agent/)
2. Click "Appoint Harvard Business Services as your Registered Agent"
3. Fill in:
   - Company name: `Gentle Reminder Health Corp` *(pending formation — that's fine; Harvard accepts RA engagements before Cert is filed)*
   - Your name: `Christopher McPherson`
   - Your contact email: `gentlereminderapp@gmail.com`
   - Your phone: [your number]
4. Pay $50 annual fee (credit card)
5. Within 24 hours, you'll receive an email with:
   - **Registered agent name:** (e.g., "Harvard Business Services, Inc.")
   - **Registered agent DE address:** (e.g., "16192 Coastal Highway, Lewes, DE 19958")
   - **Registered agent phone:** for record

**IMPORTANT:** Save this email. You'll paste the agent name + address into the Certificate of Incorporation in Step 5.

**Alternative:** If you'd rather not use Harvard, pick from the table above and follow their sign-up flow. The Cert placeholders are agent-agnostic.

---

## Step 5 — Fill remaining placeholders in all 8 formation docs (15 min, USER)

I've pre-filled every field I have values for. Below is the complete list of remaining fields you must fill. Work through this checklist sequentially.

### FORM-001 — Certificate of Incorporation

| Location | Current | Fill with |
|----------|---------|-----------|
| Article II — Registered office address | `[REGISTERED AGENT ADDRESS]` | Harvard's DE address (from Step 4 email) |
| Article II — City | `[CITY]` | e.g., `Lewes` (from Harvard email) |
| Article II — County | `[COUNTY]` | e.g., `Sussex` (from Harvard email) |
| Article II — Zip | `[ZIP]` | e.g., `19958` (from Harvard email) |
| Article II — Registered agent name | `[REGISTERED AGENT NAME]` | e.g., `Harvard Business Services, Inc.` |
| Article IX — Incorporator mailing address | `[MAILING ADDRESS — FILL IN]` | Your personal residence or mailing address |
| Article IX — City / State / Zip | `[CITY], [STATE] [ZIP]` | Your personal city / state / zip |

That's 7 fields in FORM-001. Everything else is locked in (entity name, 10M shares at $0.0001 par, liability limitation, forum selection, etc.).

### FORM-003 — Action by Sole Incorporator

| Location | Current | Fill with |
|----------|---------|-----------|
| Date | `________________, 2026` | Date you sign (same as or after Cert filing date) |

Only 1 field.

### FORM-004 — Initial Board Resolutions

| Location | Current | Fill with |
|----------|---------|-----------|
| Section 4 — Principal office address | `[PRINCIPAL OFFICE ADDRESS]` | Your business operating address (home OK for pre-seed) |
| Date | `________________` | Date you sign |

Only 2 fields.

### FORM-005 — Founder Stock Purchase Agreement

| Location | Current | Fill with |
|----------|---------|-----------|
| Top date | `[EFFECTIVE DATE]` | Date you sign (same as FORM-004) |
| § 2.1 Vesting Commencement Date | `[DATE CERTIFICATE OF INCORPORATION WAS FILED]` | Filing date from DE-stamped Cert |
| Signature block — Principal office | `[PRINCIPAL OFFICE ADDRESS]` | Same as FORM-004 Section 4 |
| Signature block — Purchaser address | `[PURCHASER MAILING ADDRESS]` | Your personal mailing address |
| Signature block — SSN | `[REDACTED — enter on final signed copy, not in repo]` | On paper/DocuSign copy ONLY; never type into repo |

5 fields total.

### FORM-006 — Share Certificate

| Location | Current | Fill with |
|----------|---------|-----------|
| State of residence | `[STATE OF RESIDENCE]` | e.g., `California` |
| Date of Issue | `________________` | Same as FORM-005 Effective Date |
| FSPA reference date (in second legend) | `[EFFECTIVE DATE]` | Same as FORM-005 Effective Date |

3 fields total.

### FORM-007 — 83(b) Election Letter

| Location | Current | Fill with |
|----------|---------|-----------|
| IRS service center address | Blank at top | **`Department of the Treasury, Internal Revenue Service, Fresno, CA 93888-0002`** *(for CA residents — verify current address on IRS site before mailing)* |
| § 1 — Personal mailing address | `[YOUR PERSONAL MAILING ADDRESS]` | Your personal mailing address |
| § 1 — City / State / Zip | `[CITY], [STATE] [ZIP]` | Your personal city / state / zip |
| § 1 — SSN | `[FILL IN ON SIGNED COPY ONLY — NEVER COMMIT TO REPO]` | Hand-write on the 3 paper copies; never type into repo |
| § 3 — Date of transfer | `[EFFECTIVE DATE OF FSPA]` | Same as FORM-005 Effective Date |
| § 5 — Effective Date reference | `[EFFECTIVE DATE]` | Same |
| § 5 — Vesting Commencement Date | `[VESTING COMMENCEMENT DATE]` | Same as FORM-005 § 2.1 |
| Signature — Date | `________________` | Date you sign (must be within 30 days of § 3 transfer date) |

8 fields total. **🔴 CRITICAL: Keep the §3 and §5 dates identical to FORM-005's Effective Date.**

### FORM-008 — Founder IP Assignment (filled)

| Location | Current | Fill with |
|----------|---------|-----------|
| Top — Effective Date | `[EFFECTIVE DATE]` | Same as FORM-005 |
| § 1 — Founder address | `[FOUNDER MAILING ADDRESS]` | Your personal mailing address |
| § 1 — Company address | `[PRINCIPAL OFFICE ADDRESS]` | Same as FORM-004 Section 4 |
| § 2B — Date Cert was filed | `[DATE OF CERTIFICATE OF INCORPORATION FILING]` | From DE-stamped Cert |
| Exhibit A — 23 inventions dates | `[PRE-EFFECTIVE-DATE]` × 23 | Easier: write "Various dates prior to Effective Date" across the column |
| Signature block — Date × 2 | `________________` × 2 | Date you sign |
| Signature block — addresses × 2 | `[FOUNDER MAILING ADDRESS]`, `[PRINCIPAL OFFICE ADDRESS]` | Same as above |

~6 unique fields (some repeat).

---

## Step 6 — Retain a startup attorney for 1-3 hour flat-fee review ($500-$1,500, USER)

This is the highest-leverage legal spend before you file. Per `risk-assessment.md`, the biggest risks are:
- 83(b) missed deadline (catastrophic, self-solvable with calendar discipline)
- FIAA scope gap (diligence-killer)
- FSPA structure (Series A re-papering)

A 1-3 hour counsel review of FIAA + FSPA + Cert cures 80% of the risk for ~10% of the cost of full Clerky.

### Where to find:

1. **Clerky's Legal Counsel Network** — [https://www.clerky.com/](https://www.clerky.com/) — they list approved attorneys. Flat-fee review typically $300-$800.
2. **Cooley GO's referral program** — attorneys who honor startup-friendly flat-fee review ahead of full engagement
3. **LinkedIn search:** `"startup attorney" "Delaware" site:linkedin.com/in` — find solo practitioners
4. **Y Combinator legal referrals** — YC-affiliated attorneys offer founder-friendly rates even for non-YC companies
5. **California Bar Lawyer Referral** — [https://www.calbar.ca.gov/Public/Need-Legal-Help/Lawyer-Referral-Service](https://www.calbar.ca.gov/Public/Need-Legal-Help/Lawyer-Referral-Service)

### Outreach email template (copy-paste, fill in brackets):

**Subject:** Founder-friendly flat-fee review — DE C-Corp formation docs (pre-filing, 3 hours)

```
Hi [attorney name],

I'm Christopher McPherson, founder of Gentle Reminder Health Corp — a pre-seed
dementia care platform forming as a Delaware C-Corp via direct DIY
filing this week.

I'm looking for a 2-3 hour flat-fee review of my founder formation
docs BEFORE I sign or file. Specifically:

1. Founder Invention Assignment Agreement (cross-company IP — 23 patents
   + software copyrights, CA § 2870 compliant)
2. Founder Stock Purchase Agreement (5M shares at $0.0001, 4-year
   vesting with 1-year cliff, Corp repurchase right)
3. Certificate of Incorporation (10M authorized, standard DE GCL
   §102(b)(7) + §145 protections, Delaware Chancery forum)

Documents are Cooley-GO-patterned; review would be spot-check for
compliance + 409A + CA-founder tax issues. Not looking for full
drafting — just a second set of eyes before I file.

Can you quote a flat fee for ~3 hours of review? Turnaround I'm
targeting: within 5 business days.

I'll plan to file the Cert after receiving your feedback. Happy to
sign a short engagement letter and pay upfront if preferred.

Thanks,
Christopher McPherson
Founder, Gentle Reminder Health Corp (forming)
gentlereminderapp@gmail.com
```

Send to 3-5 attorneys. Pick the one with the best turnaround + flat-fee quote (typically $400-$800).

---

## Step 7 — File Certificate of Incorporation at Delaware (20 min, USER)

**Only do this after Steps 2-6 are complete.**

### Click path:

1. Go to [https://icis.corp.delaware.gov/ecorp/OnlineFiling/](https://icis.corp.delaware.gov/ecorp/OnlineFiling/)
2. Create a myDelaware account (if not already)
3. Click **"Incorporate a New Business"** or **"File a New Document"**
4. Select entity type: **General Corporation (for-profit, stock)**
5. Upload your completed Certificate of Incorporation PDF OR paste text into their web form
6. Pay filing fee:
   - **$109 standard** (5-business-day turnaround)
   - **$189 expedited** (24-hour turnaround) — recommended if you want to start 83(b) + stock issuance ASAP
7. Receive confirmation email
8. Within 1-5 business days (or 24 hours if expedited), receive **stamped Certificate of Incorporation** by email with your DE file number

**CRITICAL:** Save the stamped Cert PDF to `docs/legal/formation/certificate-of-incorporation-signed.pdf`. Record:
- DE file number
- Filing date (this is your Vesting Commencement Date)
- Effective date

---

## Phase 4 onward — after Cert is stamped

### Same-day (Phase 3):
1. Sign FORM-003 (Action by Sole Incorporator) — e-signature OK
2. Sign FORM-004 (Initial Board Resolutions)
3. Sign FORM-005 (Founder Stock Purchase Agreement)
4. Sign FORM-006 (Share Certificate)
5. Sign FORM-008 (FIAA)
6. Pay $500 to Corp (check, held until bank account opens)

### 🔴 Within 30 days of FORM-005 signing (Phase 4):
1. Fill SSN on 3 copies of FORM-007
2. USPS Certified Mail with Return Receipt to IRS Fresno
3. **THIS IS THE SINGLE MOST IMPORTANT DEADLINE IN FORMATION**

### Days 7-14 (Phase 4-5):
1. Apply for EIN at [irs.gov/businesses/...ein-online](https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online) — same-day, free
2. Open Mercury business account — 3-5 days approval, free
3. Deposit $500 founder stock payment

### Days 14-30 (Phase 5):
1. File USPTO trademark — [tmep.uspto.gov](https://tmep.uspto.gov/) — $500 for Classes 9+44
2. Tell Claude "Cert filed, file number X, dated Y" → Claude runs Phase 8 repo unlock commit

---

## What I've done autonomously (done, no user action)

- ✅ Step 4 research: Harvard Business Services confirmed as best-value DE registered agent ($50/yr)
- ✅ Step 6 attorney outreach email drafted (copy-paste ready above)
- ✅ Step 7 DE filing click path documented
- ✅ Phase 4 IRS Fresno mailing address pre-populated (for CA residents)
- ✅ All 8 foundational docs drafted, reviewed by risk assessment, and committed to repo
- ✅ Day-0-to-30 runbook committed to repo
- ✅ This NEXT-STEPS doc committed

---

## What you have left (in order)

1. [ ] DE name check (5 min) — Step 2
2. [ ] Save 2 screenshots (2 min) — Step 3
3. [ ] Register with Harvard Business Services ($50 + 10 min) — Step 4
4. [ ] Paste Harvard's DE address into FORM-001 Article II (2 min) — Step 5
5. [ ] Fill 6 personal-info placeholders across FORM-001, 004, 005, 006, 007, 008 (10 min) — Step 5
6. [ ] Email 3-5 startup attorneys (copy-paste the template, 5 min) — Step 6
7. [ ] Receive attorney review feedback (~3-5 days, ~$400-800)
8. [ ] Implement feedback if any
9. [ ] File Cert at DE ($109-189, 20 min) — Step 7
10. [ ] Receive stamped Cert (1-5 days)
11. [ ] Ping me with file number — I handle everything code-side

**Total your time:** ~1 hour of active work + passive wait time.
**Total cash outlay to filing:** $50 (RA) + $109 (Cert) + $400-800 (counsel) = **$560-$960**.

Once stamped Cert arrives, the 30-day 83(b) clock starts the day you sign FORM-005. That's the deadline I'll remind you about every day through Day 30.

---

Sources used in research:
- [Harvard Business Services 2026 pricing](https://www.delawareinc.com/compare-registered-agent-fees/)
- [Northwest Registered Agent review (2026)](https://boostsuite.com/best-registered-agent/delaware/)
- [InCorp Services review (2026)](https://www.llcuniversity.com/harvard-business-services-review/)
- [Delaware Division of Corporations filing portal](https://icis.corp.delaware.gov/)
