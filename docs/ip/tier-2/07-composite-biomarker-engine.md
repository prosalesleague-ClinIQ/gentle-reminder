# Provisional Patent Application: Composite Biomarker Engine with Weight Redistribution

**Docket No.:** GR-07-PROV | **Tier:** 2 | **Applicant:** [Gentle Reminder, Inc.]

## 1. TITLE
Multi-Source Composite Digital Biomarker Engine with Automatic Weight Redistribution and Medication Adherence Inversion

## 4. FIELD
Digital biomarker composite scoring for cognitive decline detection in dementia populations.

## 5. BACKGROUND
### 5.1 Problem
Individual digital biomarkers (sleep, speech, response time) provide partial signals. Combining them into a composite requires weighting, but fixed weights fail when data is missing. Prior composites do not handle missing analyzers gracefully.

### 5.2 Prior Art
- US 10,943,696 (Evidation Health) — Digital biomarkers from wearables
- Biogen BioPrint (patents pending)
- Academic composite biomarker scores

## 6. SUMMARY
A composite biomarker engine combining 5 analyzers (routine, sleep, cognitive delay, medication adherence, speech hesitation) with default weights. When any analyzer has insufficient data, its weight is automatically redistributed proportionally across remaining analyzers. Medication adherence score is inverted (high adherence → low concern). Trend aggregation uses a voting system across analyzers.

## 8. DETAILED DESCRIPTION

### 8.1 Default Weights
```
DEFAULT_WEIGHTS = {
  routine_disruption: 0.15,
  sleep_irregularity: 0.15,
  cognitive_delay: 0.25,
  medication_adherence: 0.15,  // INVERTED: high adherence → low concern
  speech_hesitation: 0.30,
}
```

### 8.2 Weight Redistribution
```
function computeComposite(analyzerResults):
  available = filter(analyzerResults, has_data=True)
  totalAvailableWeight = sum(DEFAULT_WEIGHTS[a.type] for a in available)

  composite = 0
  for a in available:
    weight = DEFAULT_WEIGHTS[a.type] / totalAvailableWeight
    score = a.score
    if a.type == 'medication_adherence':
      score = 1 - score  // invert
    composite += score * weight
  return composite
```

### 8.3 Trend Voting
```
function aggregateTrend(analyzerResults):
  votes = {improving: 0, stable: 0, declining: 0}
  for a in analyzerResults:
    votes[a.trend] += 1
  return argmax(votes)
```

### 8.4 Reference Implementation
`packages/biomarker-engine/src/scoring/BiomarkerEngine.ts`

## 9. CLAIMS

**Claim 1:** A method for computing a composite digital biomarker score for a patient, comprising:
(a) receiving a plurality of analyzer results, each comprising a score value, a data-sufficiency indicator, and an analyzer-type identifier selected from routine disruption, sleep irregularity, cognitive delay, medication adherence, and speech hesitation;
(b) maintaining a default weight mapping, where default weights for the analyzer types are 0.15, 0.15, 0.25, 0.15, and 0.30 respectively;
(c) identifying analyzer results having sufficient data;
(d) computing redistributed weights by dividing each default weight by the sum of default weights over analyzer results with sufficient data;
(e) for the medication adherence analyzer, inverting its score by subtracting from 1 before inclusion in the composite;
(f) computing the composite score as a weighted sum of analyzer scores with the redistributed weights; and
(g) computing an aggregated trend by voting across analyzer trend classifications.

**Claim 2:** The method of Claim 1, wherein the default weights are 0.15, 0.15, 0.25, 0.15, 0.30 for the listed analyzer types.

**Claim 3:** The method of Claim 1, wherein each analyzer further produces a trend classification of improving, stable, or declining, and the composite trend is determined by majority voting.

**Claim 4-6:** System and CRM claims.

## 10. ABSTRACT

A composite digital biomarker engine for dementia patients combines five analyzer outputs (routine disruption, sleep irregularity, cognitive delay, medication adherence, speech hesitation) with default weights (0.15, 0.15, 0.25, 0.15, 0.30) that are automatically redistributed proportionally when analyzers lack sufficient data. The medication adherence score is inverted so that high adherence contributes minimally to concern. Trend aggregation across analyzers uses majority voting to produce a composite trend of improving, stable, or declining.

Codebase: `packages/biomarker-engine/src/scoring/BiomarkerEngine.ts`
