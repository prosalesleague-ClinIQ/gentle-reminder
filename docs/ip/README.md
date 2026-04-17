# Gentle Reminder IP Portfolio — Patent Filing Package

**CONFIDENTIAL — Internal and Attorney-Client Privileged**

This directory contains 23 USPTO provisional patent application drafts covering the novel algorithms, systems, and methods of the Gentle Reminder dementia care platform.

## Filing Strategy at a Glance

| Tier | Count | Filing Fee (Micro) | Filing Fee (Small) | Priority |
|------|-------|-------------------:|-------------------:|----------|
| Tier 1 — Highest priority | 5 | $1,500 | $3,000 | File first (Week 2) |
| Tier 2 — Strong claims | 7 | $2,100 | $4,200 | File second (Week 3-4) |
| Tier 3 — Portfolio | 11 | $3,300 | $6,600 | File third (Week 5-6) |
| **TOTAL** | **23** | **$6,900** | **$13,800** | **6 weeks** |

Filing fee is per USPTO Fee Schedule (FY2026). Micro-entity status requires: (a) inventor has not been named on more than 4 previously-filed applications, (b) gross income below $223,740, (c) no assignment to ineligible entity. Small-entity status applies to entities with fewer than 500 employees.

## Tier 1 — Highest Patentability (File First)

| # | Title | File | Core Function |
|---|-------|------|---------------|
| 01 | Gentle Feedback Scoring System | [tier-1/01-gentle-feedback-scoring.md](tier-1/01-gentle-feedback-scoring.md) | `calculateSessionScores()` |
| 02 | Adaptive Difficulty Engine (Asymmetric Comfort Zone) | [tier-1/02-adaptive-difficulty-engine.md](tier-1/02-adaptive-difficulty-engine.md) | `calculateDifficulty()` |
| 03 | Dementia-Adapted Spaced Repetition | [tier-1/03-dementia-spaced-repetition.md](tier-1/03-dementia-spaced-repetition.md) | `processReview()` |
| 04 | Multimodal Cognitive State Classifier | [tier-1/04-multimodal-cognitive-state.md](tier-1/04-multimodal-cognitive-state.md) | `classifyState()` |
| 05 | Dementia-Specific Speech Emotion Detection | [tier-1/05-dementia-speech-emotion.md](tier-1/05-dementia-speech-emotion.md) | `detect_emotion()` |

## Tier 2 — Medium-High Patentability

| # | Title | File |
|---|-------|------|
| 06 | Sundowning Detection Algorithm | [tier-2/06-sundowning-detection.md](tier-2/06-sundowning-detection.md) |
| 07 | Composite Biomarker Engine with Weight Redistribution | [tier-2/07-composite-biomarker-engine.md](tier-2/07-composite-biomarker-engine.md) |
| 08 | Multi-Window Longitudinal Decline Detection | [tier-2/08-multi-window-decline-detection.md](tier-2/08-multi-window-decline-detection.md) |
| 09 | Trimodal Speech Hesitation Biomarker | [tier-2/09-speech-hesitation-biomarker.md](tier-2/09-speech-hesitation-biomarker.md) |
| 10 | Response Time Biomarker with Variance + Trend Penalty | [tier-2/10-response-time-biomarker.md](tier-2/10-response-time-biomarker.md) |
| 11 | 8-Feature Cognitive Decline Predictor | [tier-2/11-decline-predictor-ml.md](tier-2/11-decline-predictor-ml.md) |
| 12 | Algorithm Transparency for FDA SaMD | [tier-2/12-algorithm-transparency.md](tier-2/12-algorithm-transparency.md) |

## Tier 3 — System-Level Innovations

| # | Title | File |
|---|-------|------|
| 13 | Automated Post-Market Surveillance with Drift Detection | [tier-3/13-post-market-surveillance.md](tier-3/13-post-market-surveillance.md) |
| 14 | Voice Companion System for Dementia Care | [tier-3/14-voice-companion-system.md](tier-3/14-voice-companion-system.md) |
| 15 | Music Therapy Engine with Circadian Fade-Out | [tier-3/15-music-therapy-engine.md](tier-3/15-music-therapy-engine.md) |
| 16 | Hard-Enforced Dementia-Safe UX Framework | [tier-3/16-enforced-dementia-ux.md](tier-3/16-enforced-dementia-ux.md) |
| 17 | Multi-Tenant Clinical Data Isolation | [tier-3/17-multi-tenant-clinical-isolation.md](tier-3/17-multi-tenant-clinical-isolation.md) |
| 18 | 21 CFR Part 11 Hash-Chain Audit Trail | [tier-3/18-cfr11-hash-chain-audit.md](tier-3/18-cfr11-hash-chain-audit.md) |
| 19 | Cognitive State → Response Policy Mapping | [tier-3/19-adaptive-response-policies.md](tier-3/19-adaptive-response-policies.md) |
| 20 | Wearable Health Signal Processing (HRV + Sleep) | [tier-3/20-wearable-health-processing.md](tier-3/20-wearable-health-processing.md) |
| 21 | FHIR R4 Extensions for Dementia Monitoring | [tier-3/21-fhir-dementia-extensions.md](tier-3/21-fhir-dementia-extensions.md) |
| 22 | Pure TypeScript Statistical Engine | [tier-3/22-pure-ts-statistical-engine.md](tier-3/22-pure-ts-statistical-engine.md) |
| 23 | Circadian Biomarkers (Sleep + Routine Disruption) | [tier-3/23-circadian-biomarkers.md](tier-3/23-circadian-biomarkers.md) |

## Supporting Documents

- [TEMPLATE-provisional-patent.md](TEMPLATE-provisional-patent.md) — USPTO 35 USC §111(b) compliant template
- [FILING-CHECKLIST.md](FILING-CHECKLIST.md) — Step-by-step USPTO EFS-Web filing guide
- [PRIOR-ART-SEARCH.md](PRIOR-ART-SEARCH.md) — Prior art references per IP
- [INVENTOR-DISCLOSURE.md](INVENTOR-DISCLOSURE.md) — Inventor naming + assignment template

## Strategic Notes

### Why Provisional First
Provisionals secure a 12-month priority date at low cost ($300 per micro-entity filing). During that window:
1. Raise seed capital using the pitch site
2. Complete clinical validation studies
3. Refine claims based on prior art searches
4. Convert the highest-value provisionals to non-provisionals (before 12-month deadline — missing this destroys priority)

### Trade Secrets — NOT Patented
The following are deliberately **kept as trade secrets** (not disclosed in public-facing pitch materials):
- Specific numerical thresholds (70-85% comfort zone boundaries, 5000ms response ceiling)
- Keyword dictionaries for emotion detection
- Weight distributions across biomarkers (0.30, 0.25, 0.15, 0.15, 0.15)
- Audio feature thresholds (170 wpm, 80 wpm, 50 Hz pitch variance, 1200ms pause)

These values appear in the provisional drafts (to support enabling disclosure) but are redacted from the public pitch site. This provides defensive publication protection via the patent filing while limiting competitor access during the 18-month pre-publication window.

### Conversion Priority (Non-Provisional Timeline)
By month 12 post-filing, convert in this order based on commercial value:
1. Tier 1 IPs #1, #2, #3 — Core platform defensibility
2. Tier 1 IPs #4, #5 — AI/ML differentiation
3. Tier 2 IPs — Selectively based on market traction

Non-provisional conversion costs $80-$150K per application (attorney fees + USPTO examination fees).

## International Strategy (PCT)

Within 12 months, file a Patent Cooperation Treaty (PCT) application claiming priority to the provisionals. PCT gives 30-month window to enter national phase in 150+ countries. Recommended national-phase jurisdictions:
- United States (USPTO — already filed via provisional → non-provisional)
- European Union (EPO)
- China (CNIPA)
- Japan (JPO)
- Canada (CIPO)
- Australia (IP Australia)

Estimated PCT + 6-jurisdiction national phase cost: $250K-$500K spread over 30 months.

## Budget Summary

| Phase | Item | Cost |
|-------|------|------|
| Immediate | USPTO provisional filings (23) | $6,900 |
| Immediate | Patent attorney review | $5,000-$15,000 |
| Year 1 | PCT filing | $4,000-$6,000 |
| Year 2-3 | Non-provisional conversions (select) | $80K-$500K |
| Year 2-3 | National phase (6 jurisdictions) | $250K-$500K |
| **Total portfolio build-out (3 years)** | | **$350K-$1M** |

This budget assumes selective conversion (not all 23 → non-provisional). Most comparable healthtech startups convert 5-10 provisionals to non-provisionals and maintain trade-secret protection on the remainder.
