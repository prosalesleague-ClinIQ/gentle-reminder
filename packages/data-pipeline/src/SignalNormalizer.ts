import { RawSignal, NormalizedSignal } from './types';

interface UnitRange {
  min: number;
  max: number;
}

const UNIT_RANGES: Record<string, UnitRange> = {
  bpm: { min: 40, max: 200 },
  steps: { min: 0, max: 50000 },
  ms: { min: 0, max: 30000 },
  percentage: { min: 0, max: 100 },
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getRange(signal: RawSignal): UnitRange | null {
  if (signal.unit && UNIT_RANGES[signal.unit]) {
    return UNIT_RANGES[signal.unit];
  }

  // Infer range from signal type
  const typeRangeMap: Record<string, string> = {
    heart_rate: 'bpm',
    heartRate: 'bpm',
    steps: 'steps',
    response_time: 'ms',
    responseTime: 'ms',
    score: 'percentage',
    sleep_quality: 'percentage',
    sleepQuality: 'percentage',
    battery: 'percentage',
  };

  const unitKey = typeRangeMap[signal.type];
  if (unitKey) {
    return UNIT_RANGES[unitKey];
  }

  return null;
}

function computeQuality(signal: RawSignal, range: UnitRange | null): number {
  let quality = 1.0;

  // Reduce quality if no unit provided
  if (!signal.unit) {
    quality -= 0.1;
  }

  // Reduce quality if no metadata
  if (!signal.metadata) {
    quality -= 0.05;
  }

  // Reduce quality if value is at or beyond the edge of the valid range
  if (range) {
    const rangeSpan = range.max - range.min;
    const distFromMin = signal.value - range.min;
    const distFromMax = range.max - signal.value;
    const edgeThreshold = rangeSpan * 0.05;

    if (distFromMin < 0 || distFromMax < 0) {
      // Value is out of range entirely
      quality -= 0.3;
    } else if (distFromMin < edgeThreshold || distFromMax < edgeThreshold) {
      quality -= 0.1;
    }
  }

  // Reduce quality if timestamp looks stale (more than 1 hour old relative to now-ish)
  // We use a simple heuristic: if no source, reduce quality slightly
  if (!signal.source) {
    quality -= 0.1;
  }

  return clamp(quality, 0, 1);
}

export function normalizeSignal(raw: RawSignal): NormalizedSignal {
  const range = getRange(raw);

  let normalizedValue: number;

  if (range) {
    const clamped = clamp(raw.value, range.min, range.max);
    normalizedValue = (clamped - range.min) / (range.max - range.min);
  } else {
    // Without a known range, we can only clamp to 0-1 if it looks like a ratio
    normalizedValue = clamp(raw.value, 0, 1);
  }

  const quality = computeQuality(raw, range);

  return {
    ...raw,
    normalizedValue,
    quality,
  };
}

export function normalizeBatch(signals: RawSignal[]): NormalizedSignal[] {
  return signals.map(normalizeSignal);
}
