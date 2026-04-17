# Provisional Patent Application: Trimodal Speech Hesitation Biomarker

**Docket No.:** GR-09-PROV | **Tier:** 2

## 1. TITLE
Trimodal Speech Hesitation Biomarker with Dynamic Trend Threshold

## 4. FIELD
Speech-based digital biomarkers for cognitive decline detection.

## 5. BACKGROUND
### 5.1 Problem
Single-feature speech biomarkers (just pause count, or just pause duration) fail to capture the multidimensional nature of dementia-related speech changes.

### 5.2 Prior Art
- US 10,672,396 (Sonde Health) — Voice biomarkers
- US 8,708,702 (Cogstate) — Computerized cognitive testing with speech
- US 10,796,805 (Linus Health) — Digital speech analysis

## 6. SUMMARY
A trimodal biomarker combining three speech features — hesitation count, pause duration, speech rate — with specific normalization constants and a dynamic threshold for trend detection.

## 8. DETAILED DESCRIPTION

### 8.1 Feature Normalization
```
hesitationScore = min(avgHesitations / 10.0, 1.0)   // normalize 0-10 range
pauseScore = min(avgPauseDurationSeconds / 30.0, 1.0)  // normalize 0-30s
// Speech rate inverse: slower = higher concern
rateScore = computeRateScore(wpm)
  where: wpm >= 150 → 0.0
         wpm <= 80  → 1.0
         otherwise  → interpolate linearly
```

### 8.2 Composite Score
```
hesitationIndex = (hesitationScore * 0.4) + (pauseScore * 0.3) + (rateScore * 0.3)
```

### 8.3 Dynamic Trend Threshold
```
function detectTrend(history):
  slope = linearSlope(history)
  avgValue = mean(history)
  threshold = max(avgValue * 0.1, 0.5)
  if slope > threshold: return 'worsening'
  elif slope < -threshold: return 'improving'
  else: return 'stable'
```

### 8.4 Reference Implementation
`packages/biomarker-engine/src/analyzers/SpeechBiomarker.ts`

## 9. CLAIMS

**Claim 1:** A method for computing a speech hesitation biomarker, comprising:
(a) receiving speech samples with associated hesitation counts, pause durations, and speech rates;
(b) normalizing hesitation count to [0,1] by dividing by 10;
(c) normalizing pause duration to [0,1] by dividing by 30 seconds;
(d) computing a speech rate score that is 0 for rates at or above 150 words per minute, 1 for rates at or below 80 words per minute, and linearly interpolated between;
(e) computing a composite hesitation index as: 0.4 × hesitation score + 0.3 × pause score + 0.3 × rate score;
(f) detecting a trend over a time series of hesitation indices using a dynamic threshold computed as max(0.1 × mean, 0.5).

**Claim 2:** The method of Claim 1, wherein the normalization constants are 10 hesitations, 30 seconds, and speech rates of 80-150 wpm.

**Claim 3:** System and CRM claims.

## 10. ABSTRACT

A method for computing a speech hesitation biomarker for cognitive decline combines three features — hesitation count (normalized by 10), pause duration (normalized by 30 seconds), and speech rate (inverse, normal ≥150 wpm, concerning ≤80 wpm) — into a composite index using weights 0.4, 0.3, 0.3. Trend detection over the biomarker time series uses a dynamic threshold of max(10% of mean, 0.5) to distinguish worsening, improving, and stable trajectories.

Codebase: `packages/biomarker-engine/src/analyzers/SpeechBiomarker.ts`
