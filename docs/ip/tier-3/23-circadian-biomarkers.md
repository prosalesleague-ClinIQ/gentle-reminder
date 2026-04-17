# Provisional Patent Application: Circadian Biomarkers (Sleep + Routine)

**Docket No.:** GR-23-PROV | **Tier:** 3

## 1. TITLE
Circadian Rhythm Biomarkers for Dementia Decline Including Midnight-Discontinuity-Aware Bedtime Normalization

## 6. SUMMARY
Two integrated circadian biomarkers: (1) Sleep irregularity from bedtime variability, wake time variability, and wake frequency — using novel midnight-discontinuity normalization; (2) Routine disruption from first-activity and meal-time variability.

## 8. DETAILED DESCRIPTION

### 8.1 Midnight Discontinuity Normalization
A patient retiring at 23:30 one night and 00:30 the next has only a 1-hour shift, but naive arithmetic would treat it as 23 hours. Novel approach:
```
function normalizeBedtime(time):
  hours = time.hour + time.minute/60
  // Shift times after midnight by 24 to keep continuous
  if hours < 12: return hours + 24
  return hours
```

### 8.2 Sleep Irregularity Score
```
score = 0.35 * bedtimeStdDev_capped_at_4h +
        0.35 * wakeStdDev_capped_at_4h +
        0.30 * (avgNightlyAwakenings / 5.0)
```

### 8.3 Routine Disruption Score
```
score = 0.60 * firstActivityStdDev_capped_at_6h +
        0.40 * mealTimeStdDev_capped_at_6h
```

### 8.4 Reference Implementation
`packages/biomarker-engine/src/analyzers/SleepAnalyzer.ts`, `RoutineAnalyzer.ts`

## 9. CLAIMS

**Claim 1:** A method for computing sleep irregularity as a cognitive decline biomarker, comprising:
(a) collecting bedtime and wake-time timestamps over a time period;
(b) applying a midnight-discontinuity-aware normalization wherein times between 00:00 and 12:00 are shifted by 24 hours to preserve continuity across the midnight boundary;
(c) computing standard deviations of normalized bedtimes and wake times, each capped at 4 hours;
(d) computing average nightly awakenings normalized by 5;
(e) producing a composite sleep irregularity score as 0.35 × bedtime_std + 0.35 × wake_std + 0.30 × awakenings.

**Claim 2:** A method for computing routine disruption, comprising computing standard deviation of first-activity times and meal times (each capped at 6 hours) and combining with weights 0.6 and 0.4.

**Claims 3-5:** Standard.

## 10. ABSTRACT

Two circadian biomarkers for dementia decline detection: (1) sleep irregularity combining bedtime and wake-time standard deviations (each capped at 4 hours, 0.35 weight each) plus nightly awakenings (0.30 weight), with a novel midnight-discontinuity normalization that shifts early-morning times by 24 hours to preserve continuity; and (2) routine disruption combining first-activity and meal-time standard deviations capped at 6 hours, with weights 0.6 and 0.4 respectively.

Codebase: `packages/biomarker-engine/src/analyzers/SleepAnalyzer.ts`, `RoutineAnalyzer.ts`
