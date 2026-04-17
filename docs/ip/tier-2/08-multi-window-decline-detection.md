# Provisional Patent Application: Multi-Window Longitudinal Decline Detection

**Docket No.:** GR-08-PROV | **Tier:** 2

## 1. TITLE
Multi-Window Longitudinal Cognitive Decline Detection with Per-Biomarker Severity-Based Deduplication

## 4. FIELD
Longitudinal analysis of biomarker time series for detecting cognitive decline events.

## 5. BACKGROUND
### 5.1 Problem
Single-window decline detection produces false positives (short-term variance) or false negatives (missing gradual decline). Per-biomarker analysis without deduplication creates alert fatigue.

### 5.2 Prior Art
- Generic trend detection algorithms
- US 10,278,630 (Apple) — ECG anomaly detection
- Statistical process control (SPC) in healthcare

## 6. SUMMARY
The invention analyzes biomarker time series across three windows (7, 14, 30 days), computes percentage change from window baseline to latest, applies a 10% threshold for alert generation, classifies severity in 4 tiers (low 0.3, moderate 0.5, high 0.7, critical 0.85), and deduplicates by keeping only the highest-severity alert per biomarker type.

## 8. DETAILED DESCRIPTION

### 8.1 Core Algorithm
```
function detectDecline(biomarkerHistory):
  alerts = []
  for bType in biomarkerTypes:
    seriesForType = filter(biomarkerHistory, type=bType)
    for window in [7, 14, 30]:  // days
      if len(seriesForType) < window + 1: continue
      baselineWindow = seriesForType[-(window+1):-1]
      latest = seriesForType[-1]
      baselineMean = mean(baselineWindow.map(s => s.score))
      pctChange = (latest.score - baselineMean) / baselineMean
      if abs(pctChange) >= 0.10:
        severity = classifySeverity(abs(pctChange))
        alerts.append(Alert(bType, window, pctChange, severity))

  // Deduplicate: keep highest-severity alert per biomarker type
  dedup = {}
  for a in alerts:
    if a.bType not in dedup or a.severity > dedup[a.bType].severity:
      dedup[a.bType] = a
  return list(dedup.values())
```

### 8.2 Severity Classification
```
function classifySeverity(absPctChange):
  if absPctChange >= 0.85: return 'critical'
  elif absPctChange >= 0.70: return 'high'
  elif absPctChange >= 0.50: return 'moderate'
  elif absPctChange >= 0.30: return 'low'
  else: return None  // below threshold
```

### 8.3 Reference Implementation
`packages/biomarker-engine/src/scoring/DeclineDetector.ts`

## 9. CLAIMS

**Claim 1:** A method for detecting cognitive decline in a patient from biomarker time series, comprising:
(a) receiving a time series of biomarker scores for each of a plurality of biomarker types;
(b) for each biomarker type and for each of a plurality of time windows comprising 7, 14, and 30 days, computing a baseline mean over the earlier portion of the window and a latest score;
(c) computing a percentage change between the latest score and the baseline mean;
(d) generating an alert when the absolute percentage change is at least 10%;
(e) classifying the alert severity based on the magnitude of the change, wherein severity tiers are: low (≥0.30), moderate (≥0.50), high (≥0.70), critical (≥0.85);
(f) deduplicating alerts by retaining only the highest-severity alert per biomarker type across all time windows.

**Claim 2:** The method of Claim 1, wherein the plurality of time windows is exactly 7, 14, and 30 days.

**Claim 3:** The method of Claim 1, wherein alert deduplication prevents alert fatigue.

**Claim 4-6:** System and CRM claims.

## 10. ABSTRACT

A longitudinal decline detection method for cognitive biomarkers analyzes time series across three windows (7, 14, 30 days), computes percentage change from window baseline to latest score, triggers alerts when change magnitude exceeds 10%, classifies severity in four tiers (low ≥30%, moderate ≥50%, high ≥70%, critical ≥85%), and deduplicates by retaining only the highest-severity alert per biomarker type to reduce alert fatigue for caregivers.

Codebase: `packages/biomarker-engine/src/scoring/DeclineDetector.ts`
