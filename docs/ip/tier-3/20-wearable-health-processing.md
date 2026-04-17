# Provisional Patent Application: Wearable Health Signal Processing for Dementia Monitoring

**Docket No.:** GR-20-PROV | **Tier:** 3

## 1. TITLE
Wearable Signal Processing Pipeline with HRV Analysis, Sleep Cycle Detection, and Sigma-Based Anomaly Detection for Dementia Monitoring

## 6. SUMMARY
Integrated pipeline processing wearable data with:
- HRV: time-domain (SDNN, RMSSD, PNN50), frequency-domain (VLF, LF, HF, LF/HF), non-linear (Poincare SD1/SD2, sample entropy)
- Sleep: stage analysis (inBed, awake, light, deep, REM), cycle detection, 0-100 quality score
- Anomaly: patient-specific baselines with sigma deviation thresholds for 5 anomaly types (heartRateHigh, hrvDrop, sleepDisturbance, fallDetected, gaitDegradation)

## 8. DETAILED DESCRIPTION

### 8.1 HRV Computation
Standard HRV algorithms adapted for continuous monitoring in dementia populations with quality assessment (good/fair/poor based on beat detection confidence).

### 8.2 Sleep Quality Score
Weighted combination of: sleep efficiency %, onset latency, wake after sleep onset (WASO), REM/deep ratio, cycle completeness.

### 8.3 Anomaly Detection
```
function detectAnomaly(signal, baseline):
  deviation = abs(signal.value - baseline.mean) / baseline.stdDev
  if deviation > 3.0: severity = 'critical'
  elif deviation > 2.0: severity = 'warning'
  else: severity = 'info'
```

### 8.4 Reference Implementation
`apps/mobile/src/services/wearables/WearableDataProcessor.ts`

## 9. CLAIMS

**Claim 1:** A method for processing wearable signals for dementia patient monitoring, comprising:
(a) computing heart rate variability metrics including time-domain (SDNN, RMSSD, PNN50), frequency-domain (LF/HF ratio), and non-linear (Poincare SD1/SD2);
(b) analyzing sleep into stages (in-bed, awake, light, deep, REM) with cycle detection and a 0-100 quality score;
(c) maintaining a patient-specific baseline for each monitored signal;
(d) computing sigma deviations of current signals against patient baselines;
(e) classifying anomalies as critical (>3σ), warning (>2σ), or info; and
(f) surfacing anomalies from at least: heart rate elevation, HRV drop, sleep disturbance, fall detection, gait degradation.

**Claims 2-5:** Standard.

## 10. ABSTRACT

A wearable signal processing pipeline for dementia patient monitoring computes heart rate variability in time-domain (SDNN, RMSSD, PNN50), frequency-domain (LF/HF), and non-linear (Poincare SD1/SD2) metrics; performs sleep stage analysis with cycle detection and a 0-100 quality score; and applies sigma-based anomaly detection (critical >3σ, warning >2σ) against patient-specific baselines across heart rate, HRV, sleep, falls, and gait.

Codebase: `apps/mobile/src/services/wearables/WearableDataProcessor.ts`
