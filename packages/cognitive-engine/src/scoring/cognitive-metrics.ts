import { SessionScores } from './types';

export interface DeclineTrend {
  domain: string;
  percentageChange: number;
  isDecline: boolean;
  severity: 'none' | 'mild' | 'moderate' | 'significant';
}

export interface DeclineAnalysis {
  trends: DeclineTrend[];
  overallDecline: boolean;
  alertRequired: boolean;
  summary: string;
}

/**
 * Compares recent scores against baseline to detect decline.
 * Used for caregiver/clinician alerts, NEVER shown to patient.
 */
export function analyzeDeclineTrend(
  recentScores: SessionScores[],
  baselineScores: SessionScores[],
): DeclineAnalysis {
  if (recentScores.length === 0 || baselineScores.length === 0) {
    return {
      trends: [],
      overallDecline: false,
      alertRequired: false,
      summary: 'Insufficient data for trend analysis.',
    };
  }

  const recentAvg = averageScores(recentScores);
  const baselineAvg = averageScores(baselineScores);

  const trends: DeclineTrend[] = [
    analyzeDomain('orientation', recentAvg.orientationScore, baselineAvg.orientationScore),
    analyzeDomain('identity', recentAvg.identityScore, baselineAvg.identityScore),
    analyzeDomain('memory', recentAvg.memoryScore, baselineAvg.memoryScore),
    analyzeDomain('overall', recentAvg.overallScore, baselineAvg.overallScore),
  ];

  const significantDeclines = trends.filter(
    (t) => t.severity === 'moderate' || t.severity === 'significant',
  );
  const overallDecline = trends.find((t) => t.domain === 'overall')?.isDecline ?? false;
  const alertRequired = significantDeclines.length > 0;

  let summary: string;
  if (!alertRequired) {
    summary = 'Cognitive scores are stable.';
  } else if (significantDeclines.length === 1) {
    summary = `Decline detected in ${significantDeclines[0].domain} domain.`;
  } else {
    summary = `Decline detected in ${significantDeclines.map((d) => d.domain).join(', ')} domains.`;
  }

  return { trends, overallDecline, alertRequired, summary };
}

function analyzeDomain(domain: string, recent: number, baseline: number): DeclineTrend {
  if (baseline === 0) {
    return { domain, percentageChange: 0, isDecline: false, severity: 'none' };
  }

  const percentageChange = ((recent - baseline) / baseline) * 100;
  const isDecline = percentageChange < -5; // 5% threshold

  let severity: DeclineTrend['severity'] = 'none';
  if (percentageChange <= -30) severity = 'significant';
  else if (percentageChange <= -15) severity = 'moderate';
  else if (percentageChange <= -5) severity = 'mild';

  return {
    domain,
    percentageChange: Math.round(percentageChange * 10) / 10,
    isDecline,
    severity,
  };
}

function averageScores(scores: SessionScores[]): SessionScores {
  const count = scores.length;
  return {
    overallScore: scores.reduce((s, sc) => s + sc.overallScore, 0) / count,
    orientationScore: scores.reduce((s, sc) => s + sc.orientationScore, 0) / count,
    identityScore: scores.reduce((s, sc) => s + sc.identityScore, 0) / count,
    memoryScore: scores.reduce((s, sc) => s + sc.memoryScore, 0) / count,
    languageScore: scores.reduce((s, sc) => s + sc.languageScore, 0) / count,
    executiveFunctionScore: scores.reduce((s, sc) => s + sc.executiveFunctionScore, 0) / count,
    attentionScore: scores.reduce((s, sc) => s + sc.attentionScore, 0) / count,
  };
}
