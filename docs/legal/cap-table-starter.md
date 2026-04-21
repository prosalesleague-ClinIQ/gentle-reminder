# Cap Table — Starter Structure

**Document ID:** CT-001
**Version:** 1.0
**Effective Date target:** Day the Delaware C-Corp is filed
**Status:** STARTER — execute within 7 days of entity formation. This is the pre-seed cap table the first investor sees.

---

## Why this matters

"Cap table exists and is clean" is a Day-1 investor-diligence question. A messy, unclear, or missing cap table kills deals. Carta / Pulley solve it at $0–$99/month; a clean spreadsheet also works at pre-seed.

**Minimum acceptable state before first Tier 2 investor conversation:**
- Pre-money / post-money capitalization clear
- Founder ownership and vesting clear
- Option pool sized appropriately
- Any SAFEs / convertible notes documented
- 83(b) election filed (or scheduled) for founder stock

---

## Recommended tool

- **Carta** — industry standard; investors expect it; $39/month Starter, free for very small cap tables
- **Pulley** — cleaner UX; $99/month Seed plan
- **Spreadsheet (Google Sheets / Excel)** — acceptable at pre-seed, migrate to Carta at seed close

## Initial cap structure — pre-seed, pre-money

Below is a recommended starting structure the day the entity forms. Numbers are illustrative — finalize with counsel and your CFO.

| Holder | Shares | % (fully diluted) | Notes |
|--------|--------|-------------------|-------|
| Christo Mac (Founder, CEO/COO) | 5,000,000 | 50.0% | 4-year vesting, 1-year cliff from entity formation date |
| Leo Kinsman (CTO) | 2,000,000 | 20.0% | 4-year vesting, 1-year cliff |
| Chris Hamel (CFO) | 800,000 | 8.0% | 4-year vesting, 1-year cliff |
| Jayla Patzer (Nat. Director) | 700,000 | 7.0% | 4-year vesting, 1-year cliff |
| **Option Pool (unallocated)** | **1,500,000** | **15.0%** | For advisors + future employees — sized for 18-month runway |
| **Total (fully diluted, pre-seed)** | **10,000,000** | **100.0%** | — |

**Total authorized shares:** typically **10,000,000** at incorporation, with a provision to authorize more at seed close.

**Founder stock purchase price:** typically **$0.0001/share** (par value) at incorporation. Total founder purchase price = 8,500,000 × $0.0001 = $850.

## 83(b) election — CRITICAL

Every founder receiving restricted stock must file an **83(b) election** with the IRS within **30 days** of stock issuance.

Without 83(b):
- Tax is owed on the difference between fair market value and purchase price at EACH vesting event
- By Series A, fair market value may be 100–1000× what it was at incorporation
- Founders can end up owing tax on hundreds of thousands of dollars of paper value

With 83(b):
- Tax is paid once, at issuance, on the tiny difference between purchase price and fair market value at day-0 (typically ~$0)
- All future appreciation is treated as capital gains, not ordinary income
- Founder can hold shares through Series A / exit without vesting-triggered tax surprises

**Mechanics:**
1. Founder purchases restricted stock for par value on entity-formation day
2. Within 30 days, founder files IRS Form 83(b) with the IRS (by certified mail, return receipt)
3. Founder provides a copy to the Company
4. Founder keeps a copy with personal tax records

**Carta handles this automatically**; if using a spreadsheet, file manually and save the certified-mail receipt.

## Option pool

- **Pre-seed target:** 15% of fully diluted shares
- **Seed close adjustment:** many lead investors request the pool be expanded to 20% pre-money (dilutes founders, not the incoming investor)
- **Allocation policy:** reserve in 1% increments; avoid over-promising early (under-commit, then expand the pool at seed if needed)

### Preliminary option pool allocation plan (indicative)

| Role | Typical grant | Vesting |
|------|---------------|---------|
| Clinical Advisory Board member | 0.25%–0.5% | 2-year vest, monthly |
| Tech/AI Advisory Board member | 0.25%–0.5% | 2-year vest, monthly |
| First engineering hire | 0.5%–1.5% | 4-year vest, 1-year cliff |
| First clinical/regulatory hire | 0.5%–1.0% | 4-year vest, 1-year cliff |
| First commercial hire | 0.3%–0.75% | 4-year vest, 1-year cliff |

## Pre-seed SAFE allocation (if any pre-seed capital has been raised personally)

If Founder has taken any pre-seed capital (angel check, friends & family, grant pre-payments) prior to entity formation:
- Each investor receives a SAFE (Simple Agreement for Future Equity) recorded on the cap table with:
  - Investment amount
  - Cap (e.g., $5M pre-money valuation cap)
  - Discount (typically 15–20%) or Most-Favored-Nation clause
  - Date of investment

**If no pre-seed capital has been taken:** this section is empty. That's fine.

## Investor-facing cap table exports

For Tier 2 data room, export:

1. **Fully diluted cap table** — every holder, every share class, option pool, SAFEs
2. **Basic shares outstanding** — excludes unexercised options and unfunded SAFEs
3. **Waterfall scenarios** — "what does $5M at $25M post-money do to everyone's ownership"
4. **Founder ownership by trigger** — founder ownership at 0%, 25%, 50%, 75%, 100% vested

Carta and Pulley auto-generate these. For spreadsheet, keep all four tabs.

## Post-seed projected cap table (illustrative — $5M at $25M post-money)

| Holder | Shares (pre-seed) | % pre-seed | Shares (post-seed) | % post-seed |
|--------|-------------------|------------|---------------------|-------------|
| Founder (Christo Mac) | 5,000,000 | 50.0% | 5,000,000 | 40.0% |
| Co-founders (Leo, Chris, Jayla) | 3,500,000 | 35.0% | 3,500,000 | 28.0% |
| Option pool | 1,500,000 | 15.0% | 1,500,000 | 12.0% |
| Seed investor(s) | — | — | 2,500,000 | 20.0% |
| **Total** | **10,000,000** | **100.0%** | **12,500,000** | **100.0%** |

**Founder dilution at seed:** 50.0% → 40.0% = 20% proportional dilution. On target.
**Collective founding team at seed:** 85% → 68%. Healthy.

## Day-of-formation checklist

- [ ] Certificate of Incorporation filed (Delaware)
- [ ] EIN obtained (IRS, usually same-day online)
- [ ] Bylaws adopted
- [ ] First board resolution adopted (authorizing founder stock issuance, Option Pool, officer appointments)
- [ ] Founder stock purchase agreements signed (one per founder)
- [ ] Founder Invention Assignment Agreement signed (see `docs/legal/ip-assignment-agreement-template.md`)
- [ ] 83(b) election prepared (file within 30 days; certified mail)
- [ ] Carta or Pulley account created; cap table imported
- [ ] First cap table snapshot saved to `docs/data-room/` (Tier 2 access only)
- [ ] Business bank account opened (Mercury / Brex / SVB)
- [ ] First set of investor-facing cap table exports generated

## Related documents

| Document | Location |
|----------|----------|
| Founder IP Assignment Template | `docs/legal/ip-assignment-agreement-template.md` |
| Pre-Entity Outreach Safety | `docs/legal/pre-entity-outreach-safety.md` |
| Trademark Filing Checklist | `docs/legal/trademark-filing-checklist.md` |
| Financial Model | `docs/financial-model/` |
| Data Room Access Policy | `docs/data-room/access-policy.md` |

---

*This is a starter structure, not legal or tax advice. Final cap table requires counsel review (corporate formation counsel + tax counsel for 83(b)). Carta's cap table management features handle most of this automatically; if you DIY in a spreadsheet, budget counsel review before showing any investor.*
