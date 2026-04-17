# Immediate Actions — Next 30 Days

**This is the execution doc.** If you only read one monetization document, read this one.

## Week 1 (Days 1-7)

### 1. Engage Patent Attorney (Priority: CRITICAL)
- **Action:** Schedule initial consultations with 3 firms (see INVESTOR-OUTREACH.md for recommendations)
- **Criteria:**
  - Software + medical device specialization
  - Experience with FDA SaMD
  - Fixed-fee provisional filings available
- **Budget:** $1,500-$5,000 for initial engagement + review
- **Outcome:** Signed engagement letter; attorney reviews `docs/ip/tier-1/*.md` drafts

### 2. Corporate Housekeeping
- [ ] Confirm legal entity (Delaware C-Corp recommended for fundraising)
- [ ] Confirm EIN is active
- [ ] Register for USPTO.gov account
- [ ] Register for EFS-Web filing
- [ ] Register for Pay.gov

### 3. Inventor Alignment
- [ ] Complete `docs/ip/INVENTOR-DISCLOSURE.md` with actual names
- [ ] Execute Invention Assignment Agreements with all inventors
- [ ] Confirm micro-entity vs small-entity status

### 4. Deploy Pitch Site
- [ ] Push `apps/pitch-site/` to Vercel
- [ ] Configure domain: `gentle-reminder.health`
- [ ] Verify all pages render (landing, /ip, /investors, /partners, /grants, /clinical, /team, /demo, /contact)
- [ ] Set up contact form backend (Vercel serverless function or Formspree)
- [ ] Add analytics (Plausible or PostHog)

## Week 2 (Days 8-14)

### 5. File Tier 1 Provisionals
- [ ] Attorney files 5 Tier 1 provisional patents
- [ ] USPTO receipts saved to `docs/ip/receipts/`
- [ ] 11-month and 12-month calendar reminders set
- [ ] Update `docs/ip/INVENTOR-DISCLOSURE.md` with application numbers
- **Spend:** $1,500 (micro-entity) + attorney fees

### 6. Create Investor Pitch Deck (PDF)
- [ ] Export from pitch site to PDF (16 slides)
- [ ] Problem / Market (3 slides)
- [ ] Solution / IP Portfolio (3 slides)
- [ ] Traction / Platform (2 slides)
- [ ] Business Model / Projections (2 slides)
- [ ] Competitive Moat (1 slide)
- [ ] FDA / Clinical Pathway (1 slide)
- [ ] Team (1 slide)
- [ ] Ask / Use of Funds (1 slide)
- [ ] Appendix: IP Portfolio Details (2 slides)

## Week 3 (Days 15-21)

### 7. File Tier 2 Provisionals
- [ ] Attorney files 7 Tier 2 provisional patents
- **Spend:** $2,100 (micro-entity)

### 8. Build Warm Investor List
Target: 20 warm intro paths to healthtech VCs.

- [ ] LinkedIn searches: "Partner at [VC firm] + dementia/Alzheimer's/digital health"
- [ ] Warm intro sources:
  - Other healthtech founders in network
  - Clinical advisory board members (once assembled)
  - Strategic partner contacts
  - Accelerators (Rock Health, HealthTech Capital)
- [ ] Create a tracking spreadsheet: VC firm, partner name, warm intro path, status

### 9. Initiate Strategic Partner NDAs
- [ ] Draft mutual NDA template (legal review)
- [ ] Identify 3-5 priority targets from `STRATEGIC-PARTNER-OUTREACH.md`
- [ ] Send initial outreach (cold + warm)

## Week 4 (Days 22-30)

### 10. File Tier 3 Provisionals
- [ ] Attorney files 11 Tier 3 provisional patents
- **Spend:** $3,300 (micro-entity)
- **Cumulative patent spend:** $6,900 USPTO + ~$10-20K attorney fees

### 11. Grant Application Planning
- [ ] Review NIA SBIR next deadline (Sep 5, Jan 5, or Apr 5)
- [ ] Identify academic PI collaborator
- [ ] Begin Specific Aims drafting (3-4 weeks lead time)
- [ ] Schedule letter of support conversations with clinical advisors

### 12. Data Room Setup
- [ ] Google Drive or Docsend data room
- [ ] Upload (access-controlled):
  - Incorporation docs
  - Cap table
  - Financial model
  - IP portfolio summary (public-safe)
  - Pitch deck
  - Technical architecture overview
  - FDA regulatory status (redacted)
  - Clinical validation protocol

### 13. First Investor Meetings
- [ ] Schedule 5-10 initial calls for weeks 5-8
- [ ] Prepare for due diligence questions
- [ ] Track conversations in CRM

## Total Budget for 30 Days

| Item | Budget |
|------|-------:|
| USPTO provisional filings (23) | $6,900 |
| Patent attorney (engagement + review + filing support) | $10,000-$20,000 |
| Domain registration | $50 |
| Vercel hosting | $0 |
| Analytics | $0-$20 |
| Legal (NDA, corporate) | $1,500-$3,000 |
| Data room (Docsend) | $150 |
| **Total** | **$18,600-$30,120** |

## Expected Outcomes After 30 Days

- ✅ 23 USPTO provisional patent applications filed (priority dates secured)
- ✅ Pitch site live at gentle-reminder.health
- ✅ 5-10 investor conversations in flight
- ✅ 3-5 strategic partner NDAs executed
- ✅ Grant collaboration with academic PI initiated
- ✅ Clinical advisory board recruiting active
- ✅ Data room established

## After Day 30 — What Follows

**Months 2-3:** Convert investor conversations to term sheets; close seed round.

**Months 3-6:** With seed capital in hand:
- Engage FDA 510(k) consultant
- Begin clinical validation study
- Expand engineering team
- Launch first 3 pilot deployments

**Months 6-12:** Prosecute non-provisional conversions; close pilot customers; prepare Series A.

**Month 12 (HARD DEADLINE):** Convert 5-10 highest-value provisionals to non-provisionals. Remaining provisionals either get PCT-filed or lapse (strategic decision).
