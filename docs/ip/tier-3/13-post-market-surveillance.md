# Provisional Patent Application: Automated Post-Market Surveillance with Algorithm Drift Detection

**Docket No.:** GR-13-PROV | **Tier:** 3

## 1. TITLE
Automated FDA SaMD Post-Market Surveillance System with Algorithm Drift Detection

## 4. FIELD
Regulatory compliance automation for FDA-regulated Software as a Medical Device.

## 5. BACKGROUND
FDA requires post-market surveillance for SaMD. Manual surveillance is labor-intensive and inconsistent. No integrated automated systems combine algorithm drift detection with complaint categorization.

## 6. SUMMARY
Automated system tracking: (1) algorithm accuracy via Pearson correlation of predicted vs clinician-assessed scores; (2) drift severity in 4 tiers (none/mild/moderate/significant); (3) complaint categorization from 5 sources (patient/caregiver/clinician/app store/support) across 6 categories (scoring/alerts/usability/privacy/safety/other); (4) alert response time metrics including p95 delivery.

## 8. DETAILED DESCRIPTION

### 8.1 Drift Detection
```
function detectDrift(predictions, clinicianAssessments):
  pearsonR = computePearson(predictions, clinicianAssessments)
  bias = mean(predictions - clinicianAssessments)
  if abs(bias) < 0.1: return 'none'
  elif abs(bias) < 0.2: return 'mild'
  elif abs(bias) < 0.4: return 'moderate'
  else: return 'significant'
```

### 8.2 Complaint Categorization
Source × Category matrix with severity escalation.

### 8.3 Reference: `services/api/src/services/postMarketSurveillance.ts`

## 9. CLAIMS

**Claim 1:** A post-market surveillance method for FDA-regulated SaMD comprising algorithm accuracy monitoring, drift classification in four tiers based on bias thresholds of 0.1, 0.2, 0.4, complaint intake from five configured source channels across six categories, and alert response time tracking including 95th percentile delivery latency.

## 10. ABSTRACT

An automated post-market surveillance system for FDA SaMD monitors algorithm accuracy via Pearson correlation, classifies drift severity (none/mild/moderate/significant) based on bias thresholds (0.1, 0.2, 0.4), categorizes complaints across 5 sources and 6 categories, and tracks alert delivery latency including p95 percentile.

Codebase: `services/api/src/services/postMarketSurveillance.ts`
