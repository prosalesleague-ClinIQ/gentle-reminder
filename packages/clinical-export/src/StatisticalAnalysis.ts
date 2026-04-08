/**
 * Pure TypeScript statistical functions for clinical trial analysis.
 * No external dependencies — includes t-distribution approximation for p-values.
 */

import {
  TTestResult,
  WilcoxonResult,
  ConfidenceIntervalResult,
} from './types';

// ── Descriptive Statistics ──

/**
 * Arithmetic mean of an array of numbers.
 */
export function mean(values: number[]): number {
  if (values.length === 0) return NaN;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Median value. For even-length arrays, returns the average of the two middle values.
 */
export function median(values: number[]): number {
  if (values.length === 0) return NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Sample standard deviation (Bessel-corrected, n-1 denominator).
 */
export function standardDeviation(values: number[]): number {
  if (values.length < 2) return NaN;
  const m = mean(values);
  const sumSqDiff = values.reduce((sum, v) => sum + (v - m) ** 2, 0);
  return Math.sqrt(sumSqDiff / (values.length - 1));
}

// ── Inferential Statistics ──

/**
 * Paired two-tailed t-test.
 * Tests whether the mean difference between paired observations differs from zero.
 */
export function pairedTTest(before: number[], after: number[]): TTestResult {
  if (before.length !== after.length) {
    throw new Error('Paired t-test requires equal-length arrays');
  }
  const n = before.length;
  if (n < 2) {
    throw new Error('Paired t-test requires at least 2 observations');
  }

  const diffs = before.map((b, i) => after[i] - b);
  const meanDiff = mean(diffs);
  const sdDiff = standardDeviation(diffs);
  const se = sdDiff / Math.sqrt(n);

  const t = meanDiff / se;
  const df = n - 1;
  const p = tDistributionPValue(Math.abs(t), df) * 2; // two-tailed

  return {
    t: round6(t),
    p: round6(Math.min(p, 1)),
    df,
    significant: p < 0.05,
  };
}

/**
 * Wilcoxon signed-rank test (normal approximation for n >= 10).
 * Non-parametric alternative to paired t-test.
 */
export function wilcoxonSignedRank(before: number[], after: number[]): WilcoxonResult {
  if (before.length !== after.length) {
    throw new Error('Wilcoxon test requires equal-length arrays');
  }

  const diffs = before.map((b, i) => after[i] - b).filter((d) => d !== 0);
  const n = diffs.length;

  if (n === 0) {
    return { W: 0, p: 1, significant: false };
  }

  // Rank the absolute differences
  const ranked = diffs
    .map((d, i) => ({ index: i, diff: d, abs: Math.abs(d) }))
    .sort((a, b) => a.abs - b.abs);

  // Assign ranks with tie correction
  let i = 0;
  while (i < ranked.length) {
    let j = i;
    while (j < ranked.length && ranked[j].abs === ranked[i].abs) {
      j++;
    }
    const avgRank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) {
      (ranked[k] as unknown as { rank: number }).rank = avgRank;
    }
    i = j;
  }

  // W+ = sum of ranks for positive differences
  const W = ranked.reduce((sum, r) => {
    const rank = (r as unknown as { rank: number }).rank;
    return sum + (r.diff > 0 ? rank : 0);
  }, 0);

  // Normal approximation for p-value (valid for n >= 10)
  const expectedW = (n * (n + 1)) / 4;
  const varW = (n * (n + 1) * (2 * n + 1)) / 24;
  const z = (W - expectedW) / Math.sqrt(varW);
  const p = 2 * (1 - normalCDF(Math.abs(z))); // two-tailed

  return {
    W: round6(W),
    p: round6(Math.min(p, 1)),
    significant: p < 0.05,
  };
}

/**
 * Cohen's d effect size for paired samples.
 * Positive d means the 'after' group has higher values.
 */
export function cohensD(before: number[], after: number[]): number {
  if (before.length !== after.length) {
    throw new Error("Cohen's d requires equal-length arrays");
  }
  const diffs = before.map((b, i) => after[i] - b);
  const d = mean(diffs) / standardDeviation(diffs);
  return round6(d);
}

/**
 * Confidence interval for the mean of a sample.
 * Uses t-distribution critical values.
 */
export function confidenceInterval(
  values: number[],
  confidence: number = 0.95
): ConfidenceIntervalResult {
  if (values.length < 2) {
    throw new Error('Confidence interval requires at least 2 observations');
  }

  const n = values.length;
  const m = mean(values);
  const se = standardDeviation(values) / Math.sqrt(n);
  const df = n - 1;
  const alpha = 1 - confidence;
  const tCritical = tDistributionQuantile(1 - alpha / 2, df);
  const margin = tCritical * se;

  return {
    lower: round6(m - margin),
    upper: round6(m + margin),
    mean: round6(m),
  };
}

// ── Internal: Distribution Approximations ──

/**
 * Approximate the upper-tail p-value P(T > |t|) for a t-distribution.
 * Uses the regularized incomplete beta function relationship:
 *   P(T > t) = 0.5 * I(df/(df+t^2), df/2, 1/2)
 */
function tDistributionPValue(t: number, df: number): number {
  const x = df / (df + t * t);
  return 0.5 * regularizedBeta(x, df / 2, 0.5);
}

/**
 * Approximate the quantile (inverse CDF) of the t-distribution
 * using the Abramowitz & Stegun rational approximation via normal quantile.
 */
function tDistributionQuantile(p: number, df: number): number {
  // Start with normal quantile approximation
  const zp = normalQuantile(p);

  // Cornish-Fisher expansion: refine normal quantile to t quantile
  const g1 = (zp ** 3 + zp) / 4;
  const g2 = (5 * zp ** 5 + 16 * zp ** 3 + 3 * zp) / 96;
  const g3 = (3 * zp ** 7 + 19 * zp ** 5 + 17 * zp ** 3 - 15 * zp) / 384;

  return zp + g1 / df + g2 / df ** 2 + g3 / df ** 3;
}

/**
 * Standard normal CDF using Horner-form rational approximation.
 */
function normalCDF(x: number): number {
  if (x < -8) return 0;
  if (x > 8) return 1;

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX / 2);

  return 0.5 * (1.0 + sign * y);
}

/**
 * Approximate normal quantile (inverse CDF) using rational approximation.
 * Accurate to about 4.5e-4 in absolute error.
 */
function normalQuantile(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p === 0.5) return 0;

  // Rational approximation (Abramowitz & Stegun 26.2.23)
  const pLow = p < 0.5 ? p : 1 - p;
  const t = Math.sqrt(-2 * Math.log(pLow));

  const c0 = 2.515517;
  const c1 = 0.802853;
  const c2 = 0.010328;
  const d1 = 1.432788;
  const d2 = 0.189269;
  const d3 = 0.001308;

  let z = t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t);

  if (p < 0.5) z = -z;
  return z;
}

/**
 * Regularized incomplete beta function I_x(a, b).
 * Continued fraction approximation (Lentz's method).
 */
function regularizedBeta(x: number, a: number, b: number): number {
  if (x === 0) return 0;
  if (x === 1) return 1;

  const lnBeta = logGamma(a) + logGamma(b) - logGamma(a + b);
  const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lnBeta);

  // Use continued fraction (Lentz method)
  let f = 1;
  let c = 1;
  let d = 1 - ((a + b) * x) / (a + 1);
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  f = d;

  for (let m = 1; m <= 200; m++) {
    // Even step
    let numerator =
      (m * (b - m) * x) / ((a + 2 * m - 1) * (a + 2 * m));
    d = 1 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    f *= c * d;

    // Odd step
    numerator =
      -((a + m) * (a + b + m) * x) / ((a + 2 * m) * (a + 2 * m + 1));
    d = 1 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    const delta = c * d;
    f *= delta;

    if (Math.abs(delta - 1) < 1e-10) break;
  }

  return (front / a) * f;
}

/**
 * Log-gamma function using Lanczos approximation.
 */
function logGamma(z: number): number {
  const g = 7;
  const coefficients = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];

  if (z < 0.5) {
    return (
      Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z)
    );
  }

  z -= 1;
  let x = coefficients[0];
  for (let i = 1; i < g + 2; i++) {
    x += coefficients[i] / (z + i);
  }

  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

/** Round to 6 decimal places for clean output. */
function round6(v: number): number {
  return Math.round(v * 1e6) / 1e6;
}
