import { BiomarkerResult, DeclineAlert, BiomarkerConfig } from '../types';

/**
 * Configuration for decline detection thresholds.
 */
export interface DeclineDetectorConfig {
  /** Score thresholds for severity levels. */
  thresholds: {
    low: number;       // e.g., 0.3
    moderate: number;  // e.g., 0.5
    high: number;      // e.g., 0.7
    critical: number;  // e.g., 0.85
  };
  /** Minimum percentage change to trigger an alert. */
  minPercentageChange: number;
  /** Time windows to analyze (in days). */
  windows: number[];
}

export const DEFAULT_DECLINE_CONFIG: DeclineDetectorConfig = {
  thresholds: {
    low: 0.3,
    moderate: 0.5,
    high: 0.7,
    critical: 0.85,
  },
  minPercentageChange: 10,
  windows: [7, 14, 30],
};

/**
 * A timestamped biomarker score for trend analysis.
 */
export interface TimestampedScore {
  date: Date;
  type: string;
  score: number;
}

/**
 * Determine severity based on score thresholds.
 */
function getSeverity(
  score: number,
  thresholds: DeclineDetectorConfig['thresholds']
): DeclineAlert['severity'] {
  if (score >= thresholds.critical) return 'critical';
  if (score >= thresholds.high) return 'high';
  if (score >= thresholds.moderate) return 'moderate';
  return 'low';
}

/**
 * Filter scores within a time window ending at the reference date.
 */
function scoresInWindow(
  scores: TimestampedScore[],
  windowDays: number,
  referenceDate: Date
): TimestampedScore[] {
  const cutoff = new Date(referenceDate.getTime() - windowDays * 24 * 60 * 60 * 1000);
  return scores.filter(s => s.date >= cutoff && s.date <= referenceDate);
}

/**
 * Detect cognitive decline by analyzing biomarker score trends over time.
 *
 * Compares recent scores against earlier scores within configurable
 * time windows and triggers alerts when deterioration crosses thresholds.
 *
 * @param scores - Array of timestamped biomarker scores, sorted by date.
 * @param config - Detection configuration with thresholds and windows.
 * @returns Array of decline alerts, one per detected issue.
 */
export function detectDecline(
  scores: TimestampedScore[],
  config: Partial<DeclineDetectorConfig> = {}
): DeclineAlert[] {
  const cfg: DeclineDetectorConfig = {
    thresholds: config.thresholds ?? DEFAULT_DECLINE_CONFIG.thresholds,
    minPercentageChange: config.minPercentageChange ?? DEFAULT_DECLINE_CONFIG.minPercentageChange,
    windows: config.windows ?? DEFAULT_DECLINE_CONFIG.windows,
  };

  if (scores.length < 2) return [];

  const alerts: DeclineAlert[] = [];
  const sorted = [...scores].sort((a, b) => a.date.getTime() - b.date.getTime());
  const latestDate = sorted[sorted.length - 1].date;

  // Group scores by biomarker type
  const byType = new Map<string, TimestampedScore[]>();
  for (const s of sorted) {
    const arr = byType.get(s.type) ?? [];
    arr.push(s);
    byType.set(s.type, arr);
  }

  for (const [type, typeScores] of byType) {
    if (typeScores.length < 2) continue;

    const latestScore = typeScores[typeScores.length - 1].score;

    for (const windowDays of cfg.windows) {
      const windowScores = scoresInWindow(typeScores, windowDays, latestDate);
      if (windowScores.length < 2) continue;

      // Compare latest score to the average of earlier scores in this window
      const earlierScores = windowScores.slice(0, -1);
      const earlierAvg = earlierScores.reduce((sum, s) => sum + s.score, 0) / earlierScores.length;

      if (earlierAvg === 0) continue;

      // Percentage increase (higher score = worse)
      const percentageChange = ((latestScore - earlierAvg) / earlierAvg) * 100;

      if (percentageChange >= cfg.minPercentageChange) {
        const severity = getSeverity(latestScore, cfg.thresholds);

        alerts.push({
          biomarkerType: type,
          severity,
          percentageChange: Math.round(percentageChange * 10) / 10,
          message: `${type} score increased by ${Math.round(percentageChange)}% over ${windowDays} days (${earlierAvg.toFixed(2)} -> ${latestScore.toFixed(2)}). Severity: ${severity}.`,
        });
      }
    }
  }

  // Deduplicate: keep highest severity alert per biomarker type
  const severityOrder: Record<string, number> = { low: 0, moderate: 1, high: 2, critical: 3 };
  const bestByType = new Map<string, DeclineAlert>();
  for (const alert of alerts) {
    const existing = bestByType.get(alert.biomarkerType);
    if (!existing || severityOrder[alert.severity] > severityOrder[existing.severity]) {
      bestByType.set(alert.biomarkerType, alert);
    }
  }

  return [...bestByType.values()];
}
