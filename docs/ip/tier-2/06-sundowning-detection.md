# Provisional Patent Application: Sundowning Detection Algorithm

**Docket No.:** GR-06-PROV | **Tier:** 2 | **Applicant:** [Gentle Reminder, Inc.] | **Inventors:** [TBD]

## 1. TITLE
Time-Window Digital Biomarker for Detecting Sundowning Risk in Dementia Patients

## 4. FIELD
Digital biomarkers for circadian-linked cognitive decline episodes, specifically "sundowning" in dementia patients (4 PM - 8 PM afternoon-to-evening cognitive deterioration).

## 5. BACKGROUND
### 5.1 Problem
Sundowning affects up to 66% of dementia patients. Clinical literature (Bachman & Rabins 2006; Khachiyants et al. 2011) documents increased confusion, agitation, and wandering in the 4-8 PM window. No commercially available digital detection system exists.

### 5.2 Prior Art
- General wandering detection (GPS-based) — multiple patents, not sundowning-specific
- Bachman, D.L., Rabins, P.V. (2006). "Sundowning" and other temporally associated agitation states in dementia patients. *Annual Review of Medicine*, 57, 499-511.
- No dedicated prior art patent for digital sundowning detection.

## 6. SUMMARY
A composite risk score combining (1) time-of-day factor (0-0.3 contribution, peaking 16:00-20:00), (2) sleep quality factor (0-0.2), (3) light exposure factor (0-0.1), (4) agitation signal (0-0.25), (5) confusion signal (0-0.25), (6) restlessness signal (0-0.2). Total score normalized to 0-1 range; scores above configurable thresholds trigger interventions.

## 8. DETAILED DESCRIPTION

### 8.1 Composite Risk Formula
```
function detectSundowningRisk(context):
  timeFactor = isInSundowningWindow(context.hour) ? 0.3 : 0
  sleepFactor = (1 - context.recentSleepQuality) * 0.2
  lightFactor = (1 - context.lightExposure) * 0.1
  agitationFactor = context.agitationScore * 0.25
  confusionFactor = context.confusionScore * 0.25
  restlessnessFactor = context.restlessnessScore * 0.2

  rawScore = timeFactor + sleepFactor + lightFactor +
             agitationFactor + confusionFactor + restlessnessFactor
  return min(rawScore, 1.0)
```

### 8.2 Risk Severity Tiers
- Low: < 0.35
- Moderate: 0.35 - 0.60
- High: 0.60 - 0.80
- Critical: > 0.80

### 8.3 Time-Sequenced Intervention Protocol
Based on time and risk level, the system recommends interventions:
- 15:30-16:00, moderate risk: "Begin evening wind-down routine"
- 16:00-17:00, high risk: "Reduce environmental stimulation, increase soft lighting"
- 17:00-18:00, critical risk: "Notify caregiver, consider clinical intervention"
- 18:00-20:00, any risk: "Initiate calming music therapy"
- 20:00+, elevated: "Prepare for bedtime routine"

### 8.4 Reference Implementation
`packages/cognitive-state/src/SundowningDetector.ts`
Function: `detectSundowningRisk()`, `getEveningRoutineSteps()`

## 9. CLAIMS

**Claim 1:** A method for detecting sundowning risk in a dementia patient, comprising:
(a) receiving a current time of day;
(b) receiving context signals including at least: recent sleep quality score, light exposure score, agitation score, confusion score, and restlessness score;
(c) computing a time-of-day factor that contributes a non-zero value only when the current time falls within a predefined sundowning window between 16:00 and 20:00 local time;
(d) computing a composite risk score as a weighted sum of the time factor, (1 − sleep quality) × 0.2, (1 − light exposure) × 0.1, agitation × 0.25, confusion × 0.25, and restlessness × 0.2;
(e) classifying the risk as one of low, moderate, high, or critical based on threshold ranges; and
(f) selecting and outputting an intervention recommendation based on the current time and risk classification.

**Claim 2:** The method of Claim 1, wherein the time factor contributes 0.3 within the sundowning window and 0 outside of it.

**Claim 3:** The method of Claim 1, wherein the risk thresholds are: low < 0.35, moderate 0.35-0.60, high 0.60-0.80, critical > 0.80.

**Claim 4:** The method of Claim 1, further comprising transmitting a notification to a caregiver when risk is classified as high or critical.

**Claim 5:** System claim.  **Claim 6:** CRM claim.

## 10. ABSTRACT

A digital biomarker method for detecting sundowning (late-afternoon cognitive deterioration) in dementia patients computes a composite risk score from time-of-day, sleep quality, light exposure, agitation, confusion, and restlessness signals. The time-of-day factor contributes only during a 4 PM - 8 PM window. The composite score is classified into four severity tiers, each triggering time-sequenced interventions including environmental adjustments, music therapy initiation, and caregiver notifications.

## REFERENCES
- Bachman & Rabins (2006). Annual Review of Medicine 57:499-511.
- Khachiyants et al. (2011). Sundowning syndrome. *Psychiatry Investigation* 8:275-287.
- Codebase: `packages/cognitive-state/src/SundowningDetector.ts`
