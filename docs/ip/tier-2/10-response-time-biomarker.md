# Provisional Patent Application: Response Time Biomarker with Variance and Trend Penalties

**Docket No.:** GR-10-PROV | **Tier:** 2

## 1. TITLE
Multi-Component Response Time Biomarker with Coefficient of Variation Penalty and Longitudinal Trend Penalty

## 4. FIELD
Response time analysis as a cognitive decline biomarker.

## 5. BACKGROUND
Prior response time analyses rely on mean only. They miss (a) inconsistency as a separate signal of cognitive stress, and (b) gradual slowdown over time.

## 5.2 Prior Art
- Cogstate reaction time measures
- Standard psychometric chronometric analysis

## 6. SUMMARY
Score = baseScore + variancePenalty + trendPenalty, each component capped.

## 8. DETAILED DESCRIPTION

### 8.1 Score Formula
```
baseScore = min(meanTime / 5000.0, 1.0)              // 5000ms ceiling
cv = stdDev / meanTime                                 // coefficient of variation
variancePenalty = min(cv / 2.0, 0.3)                  // max 0.3
slope = linearSlope(responseTimeHistory)
trendPenalty = min((slope / meanTime) * 2.0, 0.2)     // max 0.2
score = min(baseScore + variancePenalty + trendPenalty, 1.0)
```

### 8.2 Reference Implementation
`packages/biomarker-engine/src/analyzers/ResponseTimeAnalyzer.ts`

## 9. CLAIMS

**Claim 1:** A method for computing a cognitive response time biomarker, comprising:
(a) receiving a time series of response time measurements;
(b) computing a mean response time and a standard deviation;
(c) computing a base score as min(mean / 5000 ms, 1);
(d) computing a coefficient of variation penalty as min(stdDev / mean / 2, 0.3);
(e) computing a linear slope of response times over the series;
(f) computing a trend penalty as min((slope / mean) × 2, 0.2); and
(g) computing a biomarker score as the sum of base score, variance penalty, and trend penalty, capped at 1.

**Claim 2:** Numeric constant claims.  **Claim 3-5:** System / CRM.

## 10. ABSTRACT

A response time biomarker for cognitive decline detection combines three components: (1) a base score normalized against a 5000 ms ceiling; (2) a variance penalty computed from the coefficient of variation (stdDev/mean) capped at 0.3; and (3) a trend penalty computed from the linear slope divided by mean, scaled by 2, capped at 0.2. The three components sum to produce a biomarker in [0, 1] that captures absolute slowness, inconsistency, and longitudinal slowdown simultaneously.

Codebase: `packages/biomarker-engine/src/analyzers/ResponseTimeAnalyzer.ts`
