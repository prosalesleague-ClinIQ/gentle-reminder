# Gentle Reminder Financial Model — 5-Year Projection

**Last updated:** 2026-04-18
**Model version:** 1.0 (illustrative pre-seed)
**Currency:** USD

## Files

| File | Description |
|------|-------------|
| [5-year-projection.csv](5-year-projection.csv) | Revenue, costs, headcount, burn, ARR by year |
| [unit-economics.csv](unit-economics.csv) | CAC, LTV, payback, gross margin by customer segment |
| [use-of-funds.csv](use-of-funds.csv) | $5M seed allocation detail |
| [assumptions.md](assumptions.md) | Underlying assumptions + sensitivity notes |

## Executive Summary

**Ask:** $5M seed at $25M post-money (20% dilution)
**Runway:** 12 months to Series A readiness
**Y5 ARR target:** $85M (excludes potential $10M-$50M pharma licensing)
**LTV/CAC:** 60× (healthcare SaaS top quartile benchmark)
**Gross margin:** 82% (cloud-native software + support)
**Path to profitability:** EBITDA-positive in Y4 at ~$38M ARR

## Model Framework

### Revenue Streams

1. **Facility SaaS (B2B):** $6,000/bed/year per memory care bed
2. **DTx Prescription (B2B2C, post-510k):** $180/patient/month reimbursable through CPT codes
3. **Pharma Licensing:** $500K-$5M per trial deployment + 5-10% outcomes fees
4. **Clinical Trial Services:** Digital endpoint licensing to Biogen/Eisai/Lilly/etc.

### Cost Structure

1. **Personnel (65% of opex):** Engineering (8-12 FTE), clinical (2-3 FTE), commercial (3-6 FTE), G&A
2. **Clinical & Regulatory (15%):** FDA 510(k) submission, clinical validation studies
3. **Infrastructure (8%):** Cloud, security, compliance tooling
4. **Sales & Marketing (10%):** Content, conferences, pilot deployments
5. **G&A / Legal / IP (2%):** Non-provisional conversions, trademark, corporate

### Key Milestones Driving Projections

| Year | Milestone | Revenue Impact |
|-----:|-----------|----------------|
| Y1 | Seed close; FDA 510(k) submitted; 3 facility pilots | $500K (pilots) |
| Y2 | 510(k) clearance; first pharma licensing deal | $3.8M |
| Y3 | Commercial launch; Series A close; 3 pharma deals | $14M |
| Y4 | EBITDA positive; scale to 280 facilities | $38M |
| Y5 | Strategic M&A or Series B | $85M |

## How to Use These Files

1. **CSV files** can be opened directly in Excel, Google Sheets, or Numbers
2. **Import** into your own financial model tool (Causal, Mosaic, Pry, or raw Excel)
3. **Customize** the assumptions in `assumptions.md` with your actual numbers
4. **Sensitivity analysis**: vary churn (8% → 15%), ARPU ($6K → $4K or $8K), pipeline velocity

## For Investor Diligence

These files are suitable for sharing in a data room as "illustrative model v1". Before any investor meeting:
1. Update the date to current
2. Mark as DRAFT and include "Subject to refinement" notation
3. Include sensitivity tables for downside (-20% revenue) and upside (+30%) scenarios
4. Reconcile with your actual bookings / pipeline data

## Benchmarks & Comparable Companies

| Company | Stage | Valuation | Revenue Multiple |
|---------|-------|-----------|------------------|
| Linus Health | Series B (2024) | ~$250-400M | ~15-25× revenue |
| Cognoa | Series C (2021) | $100-150M | ~10× revenue |
| Pear Therapeutics | Post-IPO (collapsed 2023) | $0 | — |
| Akili Interactive | Post-IPO (collapsed) | ~$25M | — |
| Biofourmis | Series D (2022) | $1.3B | ~10× revenue |

**Cautionary note:** DTx IPOs (Pear, Akili) collapsed after failing to achieve commercial traction. Our projections deliberately assume lower growth than peak DTx cycles.

## Model Limitations

- No stochastic / Monte Carlo simulation
- No cohort-based retention analysis (uses blended churn)
- Pharma deals modeled as binary (close/not close) — in reality they have longer timelines and partial outcomes
- FDA clearance timeline is mean estimate (actual: 12-18 months, P50 ~15 months)
- International markets not included in Y1-Y5 projections (could add $10-30M upside)

## Contact

Questions on the model: mack@matrixadvancedsolutions.com
