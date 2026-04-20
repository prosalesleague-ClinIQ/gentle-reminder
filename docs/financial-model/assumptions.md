# Financial Model — Assumptions & Sensitivity

## Revenue Assumptions

### Facility SaaS
- **ARPU:** $6,000/bed/year — validated against comparable facility technology adoption (PointClickCare, MatrixCare); facility operators pay $3-8K per bed per year for clinical IT
- **Facility expansion:** Y1 = 8 pilot facilities → Y5 = 580 facilities. Y2-Y3 growth driven by pilot-to-scaled-deployment conversion + sales team; Y3-Y5 growth driven by 510(k) clearance enabling marketing claims
- **Beds per facility:** 80 (industry average for memory care facility)
- **Gross margin:** 82% — cloud-native SaaS with low incremental cost per user; assumes 18% for cloud infrastructure + customer success + platform support
- **Churn:** 8% annual logo churn — healthcare SaaS benchmarks 10-15%; we project lower due to deep clinical integration

### DTx Prescription (Post-510(k))
- **Pricing:** $180/patient/month reimbursable via CPT codes (post-clearance)
- **Assumes 20% prescription penetration** of Medicare-eligible dementia patients in networks with provider partnerships
- **Payer coverage:** Medicare, Medicare Advantage (top 5 plans), selected commercial plans
- **Retention:** 70% annual — consistent with chronic care DTx benchmarks
- **Clinical reimbursement:** Assumes Q3 of year post-510(k) for Medicare coverage decision

### Pharma Licensing
- **Deal structure:** Upfront ($500K-$2M) + milestones ($1-3M over trial) + royalties (5-10% of drug efficacy outcomes)
- **Sales cycle:** 9 months from first meeting to signed term sheet (pre-FDA); 4-6 months post-FDA
- **Close rate:** 25% of qualified opportunities
- **Initial targets:** Biogen (Leqembi companion app), Eisai (Leqembi co-marketer), Eli Lilly (Kisunla)

## Cost Assumptions

### Personnel (Fully Loaded)
- Engineering: $180K avg (Senior) — reflects market rate + benefits
- Clinical/Medical Affairs: $220K (Physician/MSN) — includes clinical leadership premium
- Sales: $150K base + commission (50/50 OTE for AE)
- G&A: $130K avg
- Fringe benefits: 25% load on base
- Founders: Below-market Y1-Y2 ($120-140K); market Y3+

### Clinical & Regulatory
- FDA 510(k) pathway: $1.2M total over 18 months (included in seed Y1-Y2)
- ISO 13485 QMS audit + maintenance: $80K Y1, $150K ongoing
- Clinical validation study (300 patients): $750K (partial recovery via SBIR Phase I/II)
- Post-market surveillance: $200K Y3 onwards

### Infrastructure
- Cloud (AWS/GCP): $500-3K/month per 100 active users
- HIPAA compliance tooling (Aptible, Nitor, Datica): $30-100K/year
- Observability (Datadog/New Relic): $20-80K/year
- Security (Snyk, Dependabot, SOC 2 audit): $50K year 1, $150K year 2+

## Financial Model Limitations

### What's Included
- Recurring revenue (SaaS + DTx + pharma)
- OpEx with cost categories
- Gross margin and EBITDA
- Headcount growth
- Cash position

### What's NOT Modeled
- Monte Carlo / stochastic simulation
- Cohort-based retention (uses blended churn)
- International expansion (potential $10-30M upside Y4-Y5)
- Multi-currency / FX
- Detailed accounts receivable / working capital
- Tax implications
- R&D tax credits (could reduce burn 15-25%)

### Sensitivity Ranges

**Downside scenario (-20% to -30%):**
- Slower facility adoption (60% of plan)
- 510(k) delay of 6 months
- No pharma deals Y1-Y3
- Result: Y5 ARR ~$35-45M, Series B delayed

**Upside scenario (+30% to +50%):**
- Faster facility uptake (post-Leqembi adoption tailwinds)
- Medicare coverage decision earlier
- 3+ pharma deals closed Y1-Y3
- Result: Y5 ARR ~$120-150M, strategic M&A at premium valuation

## Comparable Companies

| Company | Stage at Similar Point | Revenue Multiple | Notes |
|---------|----------------------|-------------------|-------|
| Linus Health (Series B) | ~$3M ARR | 15-25× | Comparable digital cognitive assessment |
| Cognoa (Series C) | ~$5M ARR | 20-30× | DTx for autism diagnosis |
| Biofourmis (Series D) | $50M+ ARR | 10-15× | Digital biomarkers |
| Pear Therapeutics (pre-IPO) | $5M ARR | 60× (overvalued) | Collapsed post-IPO (cautionary) |
| Akili Interactive (IPO) | $6M ARR | 40× (overvalued) | Collapsed post-IPO (cautionary) |

## Valuation Framework

**At $5M seed, $25M post-money:**
- 10× revenue (illustrative): Would require $2.5M ARR → achievable in Y2
- Valuation based on IP portfolio ($22-57M sum-of-parts) + FDA pathway readiness + team

**At Series A (18 months post-seed):**
- Target: $15-25M raise at $75-100M post-money
- Drivers: 510(k) clearance or filed, $5-10M ARR, 3+ pilot deployments, pharma term sheet

**At Series B (3 years post-seed):**
- Target: $30-50M at $150-250M post-money
- Drivers: $30M+ ARR, 3+ issued US patents, proven unit economics

## Cash Flow Assumptions

### Seed Round Timing
- Close: Month 0
- Burn: $45-80K/month → $1.0M-$1.5M/year OpEx ramp
- Runway: 12-15 months to Series A readiness

### Series A Timing
- Target close: Month 12-18 post-seed
- Contingent on: 510(k) submission accepted (not necessarily cleared), 3+ pilot deployments live, $2-3M ARR run rate

### Cash Conservation Levers
- SBIR Phase I ($275K non-dilutive) — already planned
- SBIR Phase II ($1.5M non-dilutive) — 6-12 months post-Phase I
- Foundation grants (BrightFocus $300K, Alzheimer's Association $150-500K) — Y1-Y2
- Pharma milestone payments — Y2-Y3
- Customer prepayments on 12-month facility contracts — Y2+

## Important Caveats for Investor Use

1. **These are pre-revenue projections** — actual results will differ materially
2. **FDA clearance is not guaranteed** — 12-18 months is median, not certain; De Novo pathway available as backup
3. **Pharma deals have long sales cycles** — conservative Y1-Y2 assumptions
4. **Not a GAAP financial statement** — illustrative operating model only
5. **Customize with actual numbers before sharing** — this is a starting framework

## Who to Review With

- Your fractional CFO (Burkland, Kruze, airCFO)
- Your lead investor's analyst (post-term sheet)
- Independent accounting firm for audit readiness (Y2+)

## Version Control

- v1.0 (2026-04-18): Initial model
- v1.1 [pending]: Post-customization with your actual financial data
