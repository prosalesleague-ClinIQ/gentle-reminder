import { normalizeSignal, normalizeBatch } from '../src/SignalNormalizer';
import { buildFeatures } from '../src/FeatureBuilder';
import { EventStreamProcessor } from '../src/EventStreamProcessor';
import { buildDailySummary } from '../src/DailySummaryBuilder';
import { RawSignal, NormalizedSignal } from '../src/types';

// ─── Helpers ───────────────────────────────────────────────────────

function makeRaw(overrides: Partial<RawSignal> = {}): RawSignal {
  return {
    source: 'watch',
    type: 'heart_rate',
    value: 72,
    unit: 'bpm',
    timestamp: Date.now(),
    patientId: 'patient-1',
    ...overrides,
  };
}

function makeNormalized(overrides: Partial<NormalizedSignal> = {}): NormalizedSignal {
  const raw = makeRaw(overrides);
  return {
    ...raw,
    normalizedValue: 0.2,
    quality: 0.85,
    ...overrides,
  };
}

// ─── Signal Normalization ──────────────────────────────────────────

describe('SignalNormalizer', () => {
  test('normalizes heart rate (bpm) to 0-1 range', () => {
    const signal = makeRaw({ value: 120, unit: 'bpm' });
    const result = normalizeSignal(signal);
    // (120 - 40) / (200 - 40) = 80/160 = 0.5
    expect(result.normalizedValue).toBeCloseTo(0.5, 2);
  });

  test('normalizes steps to 0-1 range', () => {
    const signal = makeRaw({ type: 'steps', value: 10000, unit: 'steps' });
    const result = normalizeSignal(signal);
    // 10000 / 50000 = 0.2
    expect(result.normalizedValue).toBeCloseTo(0.2, 2);
  });

  test('normalizes response time (ms) to 0-1 range', () => {
    const signal = makeRaw({ type: 'response_time', value: 1500, unit: 'ms' });
    const result = normalizeSignal(signal);
    // 1500 / 30000 = 0.05
    expect(result.normalizedValue).toBeCloseTo(0.05, 2);
  });

  test('normalizes percentage to 0-1 range', () => {
    const signal = makeRaw({ type: 'score', value: 75, unit: 'percentage' });
    const result = normalizeSignal(signal);
    expect(result.normalizedValue).toBeCloseTo(0.75, 2);
  });

  test('clamps values that exceed valid range', () => {
    const signal = makeRaw({ value: 250, unit: 'bpm' });
    const result = normalizeSignal(signal);
    // Clamped to 200, so (200-40)/(200-40) = 1.0
    expect(result.normalizedValue).toBeCloseTo(1.0, 2);
  });

  test('clamps values below valid range', () => {
    const signal = makeRaw({ value: 10, unit: 'bpm' });
    const result = normalizeSignal(signal);
    // Clamped to 40, so (40-40)/(200-40) = 0.0
    expect(result.normalizedValue).toBeCloseTo(0.0, 2);
  });

  test('assigns higher quality when all fields present', () => {
    const signal = makeRaw({ metadata: { device: 'fitbit' } });
    const result = normalizeSignal(signal);
    expect(result.quality).toBeGreaterThanOrEqual(0.85);
  });

  test('assigns lower quality when unit is missing', () => {
    const withUnit = normalizeSignal(makeRaw({ unit: 'bpm' }));
    const withoutUnit = normalizeSignal(makeRaw({ unit: undefined }));
    expect(withoutUnit.quality).toBeLessThan(withUnit.quality);
  });

  test('normalizeBatch processes multiple signals', () => {
    const signals = [
      makeRaw({ value: 80, unit: 'bpm' }),
      makeRaw({ type: 'steps', value: 5000, unit: 'steps' }),
    ];
    const results = normalizeBatch(signals);
    expect(results).toHaveLength(2);
    expect(results[0].normalizedValue).toBeCloseTo(0.25, 2); // (80-40)/160
    expect(results[1].normalizedValue).toBeCloseTo(0.1, 2); // 5000/50000
  });
});

// ─── Feature Building ──────────────────────────────────────────────

describe('FeatureBuilder', () => {
  test('computes mean, stddev, min, max, trend, count per signal type', () => {
    const now = Date.now();
    const signals: NormalizedSignal[] = [
      makeNormalized({ type: 'heart_rate', normalizedValue: 0.3, value: 88, timestamp: now - 60000 }),
      makeNormalized({ type: 'heart_rate', normalizedValue: 0.5, value: 120, timestamp: now - 30000 }),
      makeNormalized({ type: 'heart_rate', normalizedValue: 0.4, value: 104, timestamp: now }),
    ];

    const features = buildFeatures(signals, 10);
    expect(features.features['heart_rate_mean']).toBeCloseTo(0.4, 1);
    expect(features.features['heart_rate_min']).toBeCloseTo(0.3, 2);
    expect(features.features['heart_rate_max']).toBeCloseTo(0.5, 2);
    expect(features.features['heart_rate_count']).toBe(3);
    expect(features.features['heart_rate_stddev']).toBeGreaterThan(0);
    expect(features.features['heart_rate_trend']).toBeDefined();
  });

  test('returns empty features for empty input', () => {
    const features = buildFeatures([], 10);
    expect(features.features).toEqual({});
  });

  test('handles multiple signal types', () => {
    const now = Date.now();
    const signals: NormalizedSignal[] = [
      makeNormalized({ type: 'heart_rate', normalizedValue: 0.5, value: 120, timestamp: now }),
      makeNormalized({ type: 'steps', normalizedValue: 0.2, value: 10000, timestamp: now }),
    ];

    const features = buildFeatures(signals, 10);
    expect(features.features['heart_rate_count']).toBe(1);
    expect(features.features['steps_count']).toBe(1);
    expect(features.features['signal_type_count']).toBe(2);
    expect(features.features['total_signal_count']).toBe(2);
  });
});

// ─── Event Stream Processing ───────────────────────────────────────

describe('EventStreamProcessor', () => {
  test('returns normalized signal with no alerts for normal values', () => {
    const processor = new EventStreamProcessor();

    // Feed a baseline with slight variation so stddev is non-zero
    for (let i = 0; i < 20; i++) {
      processor.processEvent(makeRaw({ value: 68 + (i % 5) }));
    }

    // Value of 70 is well within the range 68-72
    const result = processor.processEvent(makeRaw({ value: 70 }));
    expect(result.normalized).toBeDefined();
    expect(result.alerts).toHaveLength(0);
  });

  test('detects anomalous values outside 2 standard deviations', () => {
    const processor = new EventStreamProcessor();

    // Build baseline with slight variation (stddev ~1.4)
    for (let i = 0; i < 20; i++) {
      processor.processEvent(makeRaw({ value: 68 + (i % 5) }));
    }

    // Inject anomaly well beyond 2 stddevs from mean (~70)
    const result = processor.processEvent(makeRaw({ value: 180 }));
    expect(result.alerts.length).toBeGreaterThan(0);
    expect(result.alerts[0].reason).toContain('standard deviations');
  });

  test('generateAlert assigns severity based on deviation', () => {
    const processor = new EventStreamProcessor();

    // Build baseline
    for (let i = 0; i < 20; i++) {
      processor.processEvent(makeRaw({ value: 70 }));
    }

    const signal = makeRaw({ value: 200 });
    const alert = processor.generateAlert(signal, 'test');
    expect(['low', 'medium', 'high']).toContain(alert.severity);
    expect(alert.patientId).toBe('patient-1');
  });

  test('reset clears the sliding window', () => {
    const processor = new EventStreamProcessor();

    for (let i = 0; i < 20; i++) {
      processor.processEvent(makeRaw({ value: 70 }));
    }

    processor.reset();

    // After reset, no baseline means no anomaly detection
    const result = processor.processEvent(makeRaw({ value: 200 }));
    expect(result.alerts).toHaveLength(0);
  });
});

// ─── Daily Summary ─────────────────────────────────────────────────

describe('DailySummaryBuilder', () => {
  test('builds heart rate stats from signals', () => {
    const signals: NormalizedSignal[] = [
      makeNormalized({ type: 'heart_rate', value: 60, normalizedValue: 0.125, timestamp: Date.UTC(2026, 0, 1, 3) }),
      makeNormalized({ type: 'heart_rate', value: 80, normalizedValue: 0.25, timestamp: Date.UTC(2026, 0, 1, 12) }),
      makeNormalized({ type: 'heart_rate', value: 100, normalizedValue: 0.375, timestamp: Date.UTC(2026, 0, 1, 18) }),
    ];

    const summary = buildDailySummary(signals, '2026-01-01');
    expect(summary.heartRate.avg).toBe(80);
    expect(summary.heartRate.min).toBe(60);
    expect(summary.heartRate.max).toBe(100);
    expect(summary.heartRate.resting).toBe(60);
  });

  test('builds steps stats with hourly breakdown', () => {
    const signals: NormalizedSignal[] = [
      makeNormalized({ type: 'steps', value: 500, timestamp: Date.UTC(2026, 0, 1, 8) }),
      makeNormalized({ type: 'steps', value: 1200, timestamp: Date.UTC(2026, 0, 1, 12) }),
      makeNormalized({ type: 'steps', value: 300, timestamp: Date.UTC(2026, 0, 1, 20) }),
    ];

    const summary = buildDailySummary(signals, '2026-01-01');
    expect(summary.steps.total).toBe(2000);
    expect(summary.steps.hourly[8]).toBe(500);
    expect(summary.steps.hourly[12]).toBe(1200);
    expect(summary.steps.hourly[20]).toBe(300);
  });

  test('returns zero values when no signals exist', () => {
    const summary = buildDailySummary([], '2026-01-01');
    expect(summary.heartRate.avg).toBe(0);
    expect(summary.steps.total).toBe(0);
    expect(summary.sleep.duration).toBe(0);
    expect(summary.cognitiveActivity.sessions).toBe(0);
  });
});
