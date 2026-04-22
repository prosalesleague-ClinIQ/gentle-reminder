# RUNBOOK — Gentle Reminder Health Corp Formation (Day 0 → Day 30)

**Owner:** Christopher McPherson (Founder)
**Claude assist:** Drafting, review, repo updates, GHL updates
**Frequency:** One-time (formation). Compliance runbook takes over at Day 30+.
**Last updated:** 2026-04-21
**Last run:** TBD (pending user execution)

---

## Purpose

Establish **Gentle Reminder Health Corp** as a Delaware C-Corporation via DIY direct filing, issue founder stock, file the 83(b) election within the 30-day statutory deadline, obtain EIN, open business banking, and unlock the outreach + repo cascade that has been gated on entity formation.

**Critical hard deadline:** 🔴 **83(b) election must be postmarked within 30 days of founder stock issuance (Day 5-7).** Missing this costs $100K–$2M+ over the corp's life. Certified mail with return receipt is non-negotiable.

## Prerequisites

- [ ] All 7 foundational documents drafted — verify at `docs/legal/formation/FORM-001` through `FORM-008`
- [ ] $500 liquid cash for founder stock purchase
- [ ] ~$260 budget for formation costs (DE fee $109 + RA $50-$150 + certified mail ~$8)
- [ ] $500 budget for trademark (Day 20-30)
- [ ] Mailing address for Cert of Incorporation (personal address OK)
- [ ] Personal SSN available (for EIN + 83(b); never pasted into this repo)
- [ ] USPTO account to be created Day 20 (trademark)
- [ ] Clerky / Google Drive / password-manager for storing signed PDFs securely
- [ ] Mercury or Brex account application pre-filled (Day 10)

---

# PHASE 1 — DAY 0: PRE-FLIGHT (USER, 20 MIN)

**Gate:** Cannot proceed to Phase 2 until both TESS and DE name checks are clean.

### Step 1.1 — USPTO TESS Trademark Search
```
Open https://tmsearch.uspto.gov/
  → Basic Word Mark Search (TESS)
  → Search term: "GENTLE REMINDER"
  → Field: Combined Word Mark
  → Status: Live
  → Class filter: 009 (software) and 044 (medical services)
```
**Expected result:** Zero live marks with phonetic similarity in Class 9 or 44. Dead marks are OK.
**If it fails:** If a live mark exists in the same class with similar wording — **STOP**. Pivot the corp name OR engage a trademark attorney before filing. Options:
- "Gentle Reminder, Inc." (if TESS match is on "Corp")
- "Gentle Reminder Platform Corp"
- "GR Health Corp"
- Invoke `legal:legal-risk-assessment` for a classification

**Save:** Screenshot results to `docs/legal/trademark-search-results/tess-2026-MM-DD.pdf`.

### Step 1.2 — Delaware Name Availability Check
```
Open https://icis.corp.delaware.gov/ecorp/entitysearch/namesearch.aspx
  → Enter: "Gentle Reminder Health Corp"
  → Search
```
**Expected result:** "Entity name is available."
**If it fails:** The name is taken in Delaware. Pivot to one of:
- "Gentle Reminder, Inc."
- "Gentle Reminder Holdings Corp"
- Or check alternates from Step 1.1

**Save:** Screenshot to `docs/legal/trademark-search-results/de-name-check-2026-MM-DD.pdf`.

### Step 1.3 — Reserve DE Name (Optional, 24-hour buffer)

If you want to lock the name for 120 days while preparing the Cert, file a Name Reservation:
- DE Form: https://corpfiles.delaware.gov/NR.pdf
- Fee: $75
- Validity: 120 days

**Skip this if you're filing the Cert within the week — the name is protected once the Cert is filed.**

### Verification (End of Phase 1)
- [ ] TESS search returned no live conflicts in Class 9 or 44
- [ ] DE name check confirmed "Gentle Reminder Health Corp" available
- [ ] Screenshots saved to repo

---

# PHASE 2 — DAYS 1-5: CERTIFICATE OF INCORPORATION (USER + CLAUDE)

### Step 2.1 — Select DE Registered Agent
```
Visit one of:
  → Harvard Business Services: https://www.delawareinc.com/registered-agent/ ($50/yr)
  → Incorp Services: https://incorp.com/ ($99/yr)
  → Spiegel & Utrera: https://www.amerilawyer.com/ ($149/yr)
  → Northwest Registered Agent: https://www.northwestregisteredagent.com/ ($125/yr)
```
**Recommended:** Harvard Business Services (cheapest, reliable, used by thousands of DE corps).
**Deliverable:** Registered agent contract + the DE address + agent name (these go in Article II of Cert).
**Time:** 10 min sign-up + 24-48 hours for agent to confirm.

### Step 2.2 — Fill in Cert of Incorporation Placeholders
```
Open docs/legal/formation/certificate-of-incorporation.md
Replace bracketed fields:
  Article II: [REGISTERED AGENT ADDRESS], [CITY], [COUNTY], [ZIP], [REGISTERED AGENT NAME]
  Article IX: Christopher McPherson mailing address
```
**Owner:** User (filling in values I don't have)
**Verification:** All `[BRACKETED]` fields replaced; no `[...]` remains.

### Step 2.3 — File Cert at Delaware Division of Corporations
```
Open https://icis.corp.delaware.gov/ecorp/OnlineFiling/
  → Create account (or sign in)
  → Select "Incorporate a New Business"
  → Entity type: General Corporation (for-profit, stock)
  → Upload the filled Certificate (as PDF) or paste into their web form
  → Filing fee: $109 standard (5-day turnaround) OR $189 24-hour expedited
  → Pay by credit card
```
**Expected result:** Confirmation email with DE filing receipt + tracking number.
**Deliverable:** Stamped Certificate of Incorporation (arrives by email in 1-5 business days).
**If it fails:** DE sometimes rejects if Article II has a non-matching RA address or if an Article cites an invalid statute. Re-check registered agent address; re-check Cert wording against FORM-001.

### Step 2.4 — Save Stamped Certificate
```
Save PDF email attachment from DE Division to:
  docs/legal/formation/certificate-of-incorporation-signed.pdf

Record:
  - File number (DE assigns one)
  - Filing date (this is the "birth date" of Gentle Reminder Health Corp)
  - Effective date (usually same as filing date)
```

### Verification (End of Phase 2)
- [ ] Stamped Cert PDF saved to repo
- [ ] File number + filing date recorded
- [ ] 🔴 **VESTING COMMENCEMENT DATE = filing date of Cert** — this is the clock-start for founder stock vesting. Mark it everywhere.

---

# PHASE 3 — DAYS 5-7: POST-FORMATION GOVERNANCE + STOCK ISSUANCE

🔴 **The moment founder stock is issued (Step 3.4), the 30-day 83(b) clock starts.** Do not delay beyond Day 5-7 unless you're also going to file 83(b) later.

### Step 3.1 — Sign Action by Sole Incorporator (FORM-003)
```
Open docs/legal/formation/action-by-sole-incorporator.md
  → Fill in date (same as Cert filing date or later)
  → Sign as "Christopher McPherson, Sole Incorporator"
  → Attach Bylaws (FORM-002) as Exhibit A
```
**Method:** E-signature via DocuSign / PandaDoc / HelloSign, OR print-and-sign PDF.
**Save:** `docs/legal/formation/action-by-sole-incorporator-signed.pdf`.

### Step 3.2 — Sign Initial Board Resolutions (FORM-004)
```
Open docs/legal/formation/initial-board-resolutions.md
  → Fill in principal office address (Section 4)
  → Fill in date (same as or after FORM-003)
  → Sign as "Christopher McPherson, Sole Director"
  → Attach FSPA (FORM-005) as Exhibit A
  → Attach FIAA (FORM-008) as Exhibit B
```
**Method:** Same as FORM-003. Both documents should be signed the same day.
**Save:** `docs/legal/formation/initial-board-resolutions-signed.pdf`.

### Step 3.3 — Sign Founder Stock Purchase Agreement (FORM-005)
```
Open docs/legal/formation/founder-stock-purchase-agreement.md
  → Fill in Effective Date = Vesting Commencement Date = Cert filing date
  → Fill in principal office address
  → Fill in personal mailing address
  → Sign as CEO (Corporation side)
  → Sign as Purchaser (Founder side) — yes, you sign both
  → Payment: $500 cash to Corp
```
🔴 **Record the exact Effective Date — the 83(b) 30-day clock starts here.**
**Save:** `docs/legal/formation/founder-stock-purchase-agreement-signed.pdf` (repo version with SSN redacted).

### Step 3.4 — Issue Share Certificate (FORM-006)
```
Open docs/legal/formation/share-certificate-001.md
  → Fill in Date of Issue (same as FSPA Effective Date)
  → Fill in state of residence
  → Sign as CEO and as Secretary (both roles = you)
```
**Save:** `docs/legal/formation/share-certificate-001-signed.pdf`.

### Step 3.5 — Sign Founder IP Assignment Agreement (FORM-008)
```
Open docs/legal/formation/founder-ip-assignment-filled.md
  → Fill in Effective Date (same as FSPA)
  → Fill in founder + company addresses
  → Sign as Founder (assignor)
  → Sign as CEO (assignee)
```
**Save:** `docs/legal/formation/founder-ip-assignment-signed.pdf`.

### Step 3.6 — Pay $500 to Gentle Reminder Health Corp

You don't have a bank account yet. Options:
- **Keep the $500 in cash** in a marked envelope labeled "Gentle Reminder Health Corp initial capitalization — $500 founder stock purchase — [DATE]". Deposit into the Corp bank account when opened (Day 10).
- **Write a personal check** payable to "Gentle Reminder Health Corp" and hold it until bank account opens.
- **Wait to open bank account first** (Day 10), then wire $500. Slightly awkward — you'd have issued stock before payment, which is fine if you mark it as "paid via promissory note due on demand."

**Recommended:** Write the check and hold it. Deposit Day 10 alongside bank account opening.

### Verification (End of Phase 3)
- [ ] All 4 docs signed (FORM-003, 004, 005, 006, 008) — 5 docs total
- [ ] Same Effective Date used throughout
- [ ] $500 Purchase Price committed (cash / check / promissory note)
- [ ] 🔴 **30-day 83(b) clock started on Effective Date** — mark this date in your calendar with daily countdown alerts starting Day 25

---

# PHASE 4 — DAYS 7-14: CRITICAL 83(b) FILING + EIN + BANKING

## 🔴🔴🔴 HARD DEADLINE: 83(b) MUST BE POSTMARKED BY (EFFECTIVE_DATE + 30 DAYS)

### Step 4.1 — Fill in 83(b) Letter (FORM-007)
```
Open docs/legal/formation/83b-election-letter.md
Fill in:
  - Section 1: Personal mailing address + SSN
  - Section 3: Date of transfer = FSPA Effective Date
  - Section 5: Vesting Commencement Date = FSPA Effective Date
  - Date of signature
```
**Time:** 10 min.

### Step 4.2 — Print Three Copies of Signed 83(b) Letter
- **Copy 1:** For IRS (the filing)
- **Copy 2:** Personal tax records
- **Copy 3:** Corporate records

### Step 4.3 — Identify Correct IRS Service Center

```
Open https://www.irs.gov/filing/where-to-file-addresses-for-taxpayers-and-tax-professionals-filing-form-1040
  → Find your state of residence (California)
  → Use "Not enclosing a payment" address
```
**For California residents (verify current):** Department of the Treasury, Internal Revenue Service, Fresno, CA 93888-0002.

### Step 4.4 — 🔴 MAIL 83(b) VIA CERTIFIED MAIL + RETURN RECEIPT
```
At USPS post office:
  → Copy 1 in envelope addressed to IRS service center
  → Fill USPS Form 3800 (Certified Mail) — ~$4.40
  → Fill USPS Form 3811 (Return Receipt) — ~$3.55
  → Total cost: ~$8
  → KEEP the certified mail receipt with tracking number
```
**Expected result:** Return receipt arrives by mail 1-2 weeks later with IRS agent signature + date stamp.
**Verification:** Tracking number on USPS.com shows "Delivered" within 10 days. This is your evidence of timely filing.

**Risk if skipped:** Missing the 30-day deadline is PERMANENT. Courts have upheld strict compliance. No late-filing remedy exists. Consequence: every vesting event post-cliff becomes ordinary-income tax on the spread between purchase price and then-current FMV. Over 4 years with a successful Seed + Series A, this can be $300K-$2M+ in additional tax owed.

### Step 4.5 — Scan + Save 83(b) with Certified Mail Evidence
```
Scan:
  - Signed 83(b) letter (Copy 2 with SSN redacted for repo)
  - USPS certified mail receipt
  - Return receipt (when received)

Save:
  docs/legal/formation/83b-election-letter-mailed-YYYY-MM-DD.pdf
  docs/legal/formation/83b-certified-mail-receipt.pdf
  docs/legal/formation/83b-return-receipt.pdf
```

### Step 4.6 — Notify the Corporation
Per FSPA § 5.3, provide Copy 3 to Gentle Reminder Health Corp's records within 7 days of mailing.

### Step 4.7 — Apply for EIN at IRS
```
Open https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online
  → Click "Apply Online Now"
  → Entity type: Corporation
  → State: Delaware
  → Reason for applying: "Started a new business"
  → Responsible Party: Christopher McPherson + SSN
  → Complete form (10 minutes)
```
**Expected result:** EIN issued IMMEDIATELY. Download the CP-575 (EIN confirmation) PDF.
**Deliverable:** EIN (format: XX-XXXXXXX).
**Save:** `docs/legal/formation/ein-letter.pdf` (repo version with SSN redacted; keep full version in personal records).
**Time:** Same-day. IRS online EIN system only works Monday-Friday 7am-10pm ET.

### Step 4.8 — Open Business Bank Account

**Recommended: Mercury** (https://mercury.com)
- Free, online-only business banking for startups
- Approves in 3-5 business days
- Required docs: Cert of Incorp, EIN letter, Bylaws, Initial Board Resolutions authorizing bank account
- Initial deposit: $500 (your founder stock payment)

**Alternative: Brex** (https://brex.com) — similar, includes corporate card.

### Verification (End of Phase 4)
- [ ] 🔴 **83(b) certified mail receipt has postmark within 30 days of FSPA Effective Date**
- [ ] Return receipt received from IRS (allow 2 weeks)
- [ ] EIN issued by IRS (same day of application)
- [ ] Business bank account opened and $500 deposited
- [ ] All documents backed up in 3 places (repo, personal archive, password manager)

---

# PHASE 5 — DAYS 14-30: TRADEMARK, REPO, OPERATIONAL SETUP

### Step 5.1 — File USPTO Trademark
```
Open https://tmep.uspto.gov/
  → Create USPTO account
  → Complete TEAS Plus application for "GENTLE REMINDER"
  → Classes 9 (software) + 44 (medical services)
  → Filing basis: 1(b) Intent to Use
  → Applicant: Gentle Reminder Health Corp (not personal)
  → Pay: $250 × 2 classes = $500
```
**Per:** `docs/legal/trademark-filing-checklist.md`.
**Deliverable:** USPTO application serial number (priority date established).
**Time:** 60 min form + $500 fee.

### Step 5.2 — Record Trademark Decision in Repo
```
Update docs/legal/trademark-filing-checklist.md:
  → Decision log: Path A (post-entity) selected on YYYY-MM-DD
  → Serial number: [RECEIVED FROM USPTO]
  → Classes filed: 9, 44
  → Next action: Monitor TSDR for Office Actions (Month 4-6)
```

### Step 5.3 — CLAUDE: Repo Unlock Commit (Phase 8 in parent plan)
```
Claude will run a single commit updating:
  - send-priority.ts SIGNATURE (remove "formation in final stages")
  - pitch-deck.ts DECK_DATA (add "Gentle Reminder Health Corp, a Delaware corporation")
  - nda-templates.ts (all 3 templates: update party line)
  - pre-contact-checklists.ts (auto-check entity-exists, ein-ready, ip-assignments)
  - /private/send page (remove PRE-ENTITY banner)
  - pre-entity-outreach-safety.md (mark ARCHIVED)
  - Regenerate pitch deck PPTX + PDF
  - cap-table-starter.md → cap-table.md with real data

Commit: "Phase 39: Gentle Reminder Health Corp formed in Delaware — entity unlock"
Redeploy: vercel deploy --prod
```
**Timing:** Claude runs this within 24 hours of user confirming Cert is stamped AND FSPA + 83(b) are mailed.

### Step 5.4 — CLAUDE: Remove `pre-entity-hold` Tag from 34 GHL Contacts
```
For each contact in docs/crm-ghl/contact-id-map.md:
  Call mcp__gohighlevel__contacts_add-tags (or equivalent remove endpoint)
  to remove "pre-entity-hold" from each of the 34 contacts.

Verify: GHL smart-list "tag is pre-entity-hold" should return 0 contacts.
```
**Note:** GHL MCP may not expose a direct "remove tag" endpoint. If not, user does this in GHL UI via bulk action on the smart-list.

### Step 5.5 — Update GHL Location (USER, via GHL UI)
```
GHL → Settings → Business Profile:
  First name: Christopher (or Christo if preferred branding)
  Last name: McPherson (or Mack if preferred branding)
  Business name: Gentle Reminder Health Corp
  Address: [PRINCIPAL OFFICE ADDRESS]
  City/State/Zip: [UPDATE]
  Phone: [CONFIRM ACCURATE]
```

### Step 5.6 — Trigger Tier 1 Outreach (the whole point of this)
```
Open /private/send on pitch site.
Send Carson / Wojcik / Miller IP drafts — they now carry:
  - Accurate entity status: "Gentle Reminder Health Corp, a Delaware corporation"
  - Real EIN (don't include in email, just on file)
  - Clean signature without "formation in final stages" qualifier
```
**Per:** original Tier-1 plan prepared in prior session.

### Step 5.7 — Engage Patent Attorney
After Carson / Wojcik / Miller IP reply with fee quotes (expected within 3-7 days of Tier-1 outreach):
```
  → Compare fees vs vendor vetting worksheet (docs/legal/vendor-vetting-worksheets.md §1)
  → Select winning firm
  → Sign engagement letter (Corp signs — not you personally)
  → Execute unilateral NDA (Gentle Reminder Health Corp is Disclosing Party)
  → Begin 6-week sprint filing 23 provisional patents
```

### Step 5.8 — File CA Foreign Qualification (If Operating in CA)
If principal office is in California:
```
Open https://bizfileonline.sos.ca.gov/
  → File Statement of Information (SI-550) for foreign corp
  → Pay $25 filing fee + $800 CA Franchise Tax (annual, first due 15th day of 4th month after formation)
```
**Timing:** Within 90 days of first "doing business" in CA.

### Step 5.9 — Co-Founder Expansion (If Ready)
For each co-founder (Leo Kinsman, Chris Hamel, Jayla Patzer) who is ready:
```
1. New Board Resolution authorizing stock issuance to that founder
2. Co-founder signs their own FSPA (different vesting schedule permitted)
3. Co-founder files their own 83(b) within 30 days
4. Co-founder signs their own Invention Assignment Agreement
5. Issue new share certificate
6. Update cap table: docs/legal/cap-table.md
```
**Templates:** Reuse FSPA + 83(b) templates; adjust vesting start date to each co-founder's service start date.

### Step 5.10 — Calendar Ongoing Compliance
```
Set recurring calendar reminders:
  - DE Franchise Tax: Annual by March 1 — $175+ (via https://corp.delaware.gov/paytaxes/)
  - DE RA renewal: Annual
  - Federal Form 1120: April 15 annually (C-Corp income tax return)
  - CA Franchise Tax: 15th day of 4th month after formation + annual
  - USPTO TM TSDR monitoring: Quarterly
  - Annual Stockholder Meeting: First annual meeting within 13 months of incorporation
  - Annual Board Meeting(s): At least once per year
```
**Per:** `docs/legal/compliance-calendar.md` (Claude to generate separately via `operations:compliance-tracking` skill).

### Verification (End of Phase 5 — Day 30)
- [ ] Trademark application filed, serial number recorded
- [ ] Repo commit pushed, pitch site redeployed
- [ ] 34 GHL contacts no longer have `pre-entity-hold` tag
- [ ] GHL location info updated
- [ ] Tier 1 outreach sent (Carson / Wojcik / Miller IP)
- [ ] CA foreign qualification filed (if applicable)
- [ ] Compliance calendar set

---

## VERIFICATION — WHAT "DONE" LOOKS LIKE AT DAY 30

- [ ] Gentle Reminder Health Corp exists in DE Division of Corporations search (status: Active)
- [ ] Corp has EIN registered with IRS
- [ ] Corp has a business bank account with $500 initial capital
- [ ] You own 5,000,000 shares of Common Stock, 0% vested (cliff in 12 months)
- [ ] 83(b) election is postmarked and IRS-received (certified mail receipt proof)
- [ ] All pre-formation IP is assigned to the Corp (FIAA signed)
- [ ] Trademark application filed, priority date established
- [ ] Pitch site reflects real entity status
- [ ] 34 GHL contacts are unblocked from outreach
- [ ] Compliance calendar is set

Total cash out the door (Day 0-30): ~$1,500
- DE Cert filing: $109
- DE registered agent: $50-$150
- Certified mail: $8
- Business bank account: $0 (Mercury/Brex)
- Trademark (Classes 9 + 44): $500
- Founder stock purchase: $500 (goes to corp bank, returns to you as corp cash)
- Buffer: $250 for unexpected

---

## TROUBLESHOOTING

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| DE Cert rejected | RA address mismatch or Article citation error | Compare FORM-001 against DE GCL § 102; update RA block |
| DE Cert "pending" > 7 days | Standard DE backlog | Call DE Division: (302) 739-3073, reference DE filing receipt |
| TESS returns ambiguous match | Phonetic similarity in Class 9 or 44 | Pause filing; invoke `legal:legal-risk-assessment` or retain TM counsel |
| IRS EIN online system unavailable | System hours (weekdays 7am-10pm ET) | Retry during business hours OR fax Form SS-4 (slower, 4 weeks) |
| 83(b) return receipt not received after 3 weeks | USPS loss or slow IRS processing | USPS Certified Mail tracking # is proof of timely mailing — that's what matters, not the return receipt |
| Mercury bank application rejected | Typical reasons: mismatch between Cert name and EIN name, or incomplete address history | Open with Brex or SVB (slower but established); or add CA state registration info |
| Co-founder can't sign 83(b) before 30 days | They waited too long after their FSPA | Their 30-day clock is independent of yours — each founder has own clock from own stock issuance date |

## ROLLBACK

If a **fatal error** is discovered (e.g., incorrect entity name, wrong founder stock count) after Cert filing:

**Option A — Certificate of Amendment (DE GCL § 242):** File amendment with DE Division, $194 fee, corrects specific items. Good for name change, address change, share count adjustment.

**Option B — Dissolution + re-filing:** Cleanest for major structural errors. File Certificate of Dissolution ($204), then re-file new Cert. All assets/IP transfer to new corp via new FIAA. Rare but possible.

**Option C — 83(b) error:** NOT rollbackable. The election is irrevocable once filed. If wrong numbers, best option is to consult tax counsel — in many cases the $0 election result is unaffected by downstream errors.

**DO NOT** touch any rollback without counsel for anything beyond Option A.

## ESCALATION

| Situation | Contact | Method |
|-----------|---------|--------|
| DE Cert filing error | Delaware Division of Corporations | (302) 739-3073 / onlineinfo@corp.delaware.gov |
| 83(b) uncertainty or late-mail | Tax counsel (CPA or tax attorney) | Engage same-day if you've missed/are about to miss 30-day window |
| IP ownership dispute | Corporate / IP counsel | Before any investor diligence call |
| DE Cert of Amendment needed | Delaware Division or DE formation lawyer | Form DE-A at https://corpfiles.delaware.gov |
| Business bank account rejected | Mercury/Brex support + alternative bank | Usually resolvable; escalate within the bank |

## HISTORY

| Date | Run By | Notes |
|------|--------|-------|
| 2026-04-21 | Claude (draft) | Runbook drafted; 7 foundational docs ready for user execution |
| [PENDING] | Christopher McPherson | Day 0 pre-flight |

---

## Related documents

| Document | Location |
|----------|----------|
| Certificate of Incorporation (FORM-001) | `docs/legal/formation/certificate-of-incorporation.md` |
| Bylaws (FORM-002) | `docs/legal/formation/bylaws.md` |
| Action by Sole Incorporator (FORM-003) | `docs/legal/formation/action-by-sole-incorporator.md` |
| Initial Board Resolutions (FORM-004) | `docs/legal/formation/initial-board-resolutions.md` |
| Founder Stock Purchase Agreement (FORM-005) | `docs/legal/formation/founder-stock-purchase-agreement.md` |
| Share Certificate #1 (FORM-006) | `docs/legal/formation/share-certificate-001.md` |
| 83(b) Election Letter (FORM-007) | `docs/legal/formation/83b-election-letter.md` |
| FIAA filled for Gentle Reminder Health Corp (FORM-008) | `docs/legal/formation/founder-ip-assignment-filled.md` |
| Cap Table Starter (CT-001) | `docs/legal/cap-table-starter.md` |
| Trademark Filing Checklist | `docs/legal/trademark-filing-checklist.md` |
| Pre-Entity Outreach Safety | `docs/legal/pre-entity-outreach-safety.md` |
| Vendor Vetting Worksheets | `docs/legal/vendor-vetting-worksheets.md` |
| GHL Contact ID Map | `docs/crm-ghl/contact-id-map.md` |
| Disclosure Log Template | `docs/legal/disclosure-log-template.md` |

*This runbook is operational guidance, not legal or tax advice. If any step surfaces uncertainty, engage counsel before proceeding.*
