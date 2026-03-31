import { NormalizedSignal, ProcessedFeatures } from './types';

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function stddev(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = mean(values);
  const squaredDiffs = values.map((v) => (v - avg) ** 2);
  return Math.sqrt(squaredDiffs.reduce((sum, v) => sum + v, 0) / (values.length - 1));
}

function trend(values: number[]): number {
  if (values.length < 2) return 0;

  // Simple linear regression slope
  const n = values.length;
  const xMean = (n - 1) / 2;
  const yMean = mean(values);

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (values[i] - yMean);
    denominator += (i - xMean) ** 2;
  }

  if (denominator === 0) return 0;
  return numerator / denominator;
}

function groupByType(signals: NormalizedSignal[]): Map<string, NormalizedSignal[]> {
  const groups = new Map<string, NormalizedSignal[]>();
  for (const signal of signals) {
    const existing = groups.get(signal.type) || [];
    existing.push(signal);
    groups.set(signal.type, existing);
  }
  return groups;
}

export function buildFeatures(
  signals: NormalizedSignal[],
  windowMinutes: number
): ProcessedFeatures {
  if (signals.length === 0) {
    return {
      patientId: '',
      features: {},
      computedAt: Date.now(),
    };
  }

  const patientId = signals[0].patientId;

  // Filter signals within the time window
  const now = Math.max(...signals.map((s) => s.timestamp));
  const windowStart = now - windowMinutes * 60 * 1000;
  const windowedSignals = signals.filter((s) => s.timestamp >= windowStart);

  const features: Record<string, number> = {};
  const grouped = groupByType(windowedSignals);

  for (const [type, typeSignals] of grouped) {
    const values = typeSignals.map((s) => s.normalizedValue);
    const rawValues = typeSignals.map((s) => s.value);

    features[`${type}_mean`] = mean(values);
    features[`${type}_stddev`] = stddev(values);
    features[`${type}_min`] = Math.min(...values);
    features[`${type}_max`] = Math.max(...values);
    features[`${type}_trend`] = trend(values);
    features[`${type}_count`] = typeSignals.length;
    features[`${type}_raw_mean`] = mean(rawValues);
    features[`${type}_raw_min`] = Math.min(...rawValues);
    features[`${type}_raw_max`] = Math.max(...rawValues);
  }

  // Cross-type features
  features['total_signal_count'] = windowedSignals.length;
  features['signal_type_count'] = grouped.size;
  features['avg_quality'] = mean(windowedSignals.map((s) => s.quality));

  return {
    patientId,
    features,
    computedAt: Date.now(),
  };
}
