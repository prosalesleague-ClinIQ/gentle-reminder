# Provisional Patent Application: Pure TypeScript Clinical Trial Statistical Engine

**Docket No.:** GR-22-PROV | **Tier:** 3

## 1. TITLE
Zero-Dependency Pure TypeScript Statistical Engine for Embedded Clinical Trial Analytics

## 6. SUMMARY
Integrated suite of clinical statistical tests (paired t-test, Wilcoxon signed-rank, Cohen's d effect size, confidence intervals) implemented in pure TypeScript with zero external dependencies, using classical numerical approximations (Cornish-Fisher expansion, Lanczos log-gamma).

## 8. DETAILED DESCRIPTION

### 8.1 Implemented Tests
- Paired t-test with regularized incomplete beta function for p-value
- Wilcoxon signed-rank with normal approximation + continuity correction
- Cohen's d effect size
- Confidence intervals using t-distribution quantiles (Cornish-Fisher)
- Lanczos approximation for log-gamma

### 8.2 Architecture
All functions are pure; no I/O; no external libraries. Designed for runtime use in clinical trial export pipelines and mobile apps.

### 8.3 Reference Implementation
`packages/clinical-export/src/StatisticalAnalysis.ts`

## 9. CLAIMS

**Claim 1:** A clinical trial statistical analysis system comprising a pure-code implementation of paired t-test, Wilcoxon signed-rank test, Cohen's d effect size calculation, and confidence interval computation, wherein the implementation:
(a) requires zero external library dependencies at runtime;
(b) computes the regularized incomplete beta function via continued fractions;
(c) computes the log-gamma function via Lanczos approximation;
(d) computes t-distribution quantiles via Cornish-Fisher expansion;
(e) operates deterministically for reproducible clinical trial outcomes.

**Claims 2-4:** Dependent, system, CRM.

## 10. ABSTRACT

An embedded clinical trial statistical engine implements paired t-test, Wilcoxon signed-rank, Cohen's d, and confidence interval computations in pure TypeScript with zero external library dependencies. Numerical implementations use classical approximations: Cornish-Fisher expansion for t-distribution quantiles, Lanczos approximation for log-gamma, and continued-fraction evaluation for regularized incomplete beta. Deterministic and reproducible for regulatory audit.

Codebase: `packages/clinical-export/src/StatisticalAnalysis.ts`
