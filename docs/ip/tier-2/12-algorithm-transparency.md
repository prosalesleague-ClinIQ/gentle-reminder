# Provisional Patent Application: Algorithm Transparency Module for FDA SaMD

**Docket No.:** GR-12-PROV | **Tier:** 2

## 1. TITLE
Integrated Algorithm Transparency Module for Software-as-a-Medical-Device Compliance

## 4. FIELD
Regulatory compliance systems for Software as a Medical Device (SaMD), specifically FDA 510(k) algorithm transparency requirements.

## 5. BACKGROUND
FDA's 2019 Proposed Framework for Modification of AI/ML-based SaMD requires algorithm transparency. Prior art includes general explainability libraries (LIME, SHAP) and IBM AI Explainability 360 — none are integrated for SaMD compliance.

## 6. SUMMARY
Integrated transparency module generating human-readable explanations for (a) scoring decisions per cognitive domain with 5 severity thresholds, (b) difficulty adaptation decisions with rationale, (c) component-level algorithm version tracking for FDA audit.

## 8. DETAILED DESCRIPTION

### 8.1 Score Explanation
```
interface ScoreExplanation {
  overallScore: number;
  domainBreakdown: DomainExplanation[];
  methodology: string;       // "equally-weighted arithmetic mean..."
  limitations: string[];     // confounding factors, validation population
  algorithmVersion: string;
}

interpretations:
  score >= 0.85: "Strong performance in this domain"
  score >= 0.70: "Good performance"
  score >= 0.50: "Moderate performance — continued monitoring advised"
  score >= 0.30: "Below expected range — clinical attention recommended"
  score <  0.30: "Significantly below expected — clinical review warranted"
```

### 8.2 Difficulty Explanation
Returns current level, level label, rationale, and adaptation rules.

### 8.3 Version Tracking
```
ALGORITHM_VERSION = {
  scoringModel: "gentle-scorer@1.2.0",
  difficultyEngine: "adaptive-difficulty@1.1.0",
  spacedRepetition: "dementia-sm2@1.0.0",
  emotionDetector: "dementia-emotion@2.0.0",
}
```

### 8.4 Reference Implementation
`packages/cognitive-engine/src/transparency.ts`

## 9. CLAIMS

**Claim 1:** A method for providing algorithm transparency in a Software as a Medical Device (SaMD) for dementia assessment, comprising:
(a) receiving a cognitive score output from an assessment algorithm;
(b) generating a score explanation including overall score, per-domain breakdown, domain-specific interpretations selected from five severity tiers based on numeric thresholds, a methodology statement, and limitations disclosure;
(c) generating a difficulty explanation including current level, rationale, and adaptation rules;
(d) producing component-level algorithm version identifiers for FDA audit trail purposes; and
(e) exposing the explanations via an API accessible to clinicians and regulatory reviewers.

**Claim 2:** The method of Claim 1, wherein the five severity tiers use thresholds of 0.85, 0.70, 0.50, 0.30 for boundaries.

**Claim 3-5:** Standard dependent, system, CRM claims.

## 10. ABSTRACT

An integrated algorithm transparency module for FDA SaMD-compliant dementia assessment software generates human-readable explanations of scoring decisions with five severity tiers (≥0.85 strong, ≥0.70 good, ≥0.50 moderate, ≥0.30 below, <0.30 significantly below), difficulty adaptation decisions with rationale, and component-level algorithm version tracking. The module produces structured explanations suitable for clinician review and regulatory audit without requiring separate explainability infrastructure.

Codebase: `packages/cognitive-engine/src/transparency.ts`
