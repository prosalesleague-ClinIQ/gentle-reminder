/**
 * Data pipeline integration tests.
 *
 * End-to-end tests for signal normalization, feature building,
 * daily summary construction, and anomaly detection using
 * realistic wearable/cognitive data.
 */
import { normalizeSignal, normalizeBatch } from '../src/SignalNormalizer';
import { buildFeatures } from '../src/FeatureBuilder';
import { buildDailySummary } from '../src/DailySummaryBuilder';
import type { RawSignal, NormalizedSignal } from '../src/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const PATIENT_ID = 'patient-001';
const BASE_TIME = new Date('2025-03-15T08:00:00Z').getTime();

function makeSignal(overrides: Partial<RawSignal>): RawSignal {
  return {
    source: 'apple_watch',
    type: 'heart_rate',
    value: 72,
    unit: 'bpm',
    timestamp: BASE_TIME,
    patientId: PATIENT_ID,
    ...overrides,
  };
}

function makeNormalized(overrides: Partial<NormalizedSignal>): NormalizedSignal {
  const raw = makeSignal(overrides);
  return {
    ...raw,
    normalizedValue: 0.2,
    quality: 0.85,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// 1. Signal Normalization
// ---------------------------------------------------------------------------
describe('Signal Normalization', () => {
  it('normalizes heart rate to 0-1 range (bpm)', () => {
    const result = normalizeSignal(makeSignal({ type: 'heart_rate', value: 72, unit: 'bpm' }));
    expect(result.normalizedValue).toBeGreaterThanOrEqual(0);
    expect(result.normalizedValue).toBeLessThanOrEqual(1);
    // 72 bpm -> (72-40)/(200-40) = 32/160 = 0.2
    expect(result.normalizedValue).toBeCloseTo(0.2, 2);
  });

  it('normalizes steps to 0-1 range', () => {
    const result = normalizeSignal(makeSignal({ type: 'steps', value: 5000, unit: 'steps' }));
    // 5000 steps -> 5000/50000 = 0.1
    expect(result.normalizedValue).toBeCloseTo(0.1, 2);
  });

  it('normalizes percentage values', () => {
    const result = normalizeSignal(makeSignal({ type: 'score', value: 75, unit: 'percentage' }));
    // 75% -> 75/100 = 0.75
    expect(result.normalizedValue).toBeCloseTo(0.75, 2);
  });

  it('normalizes response time in ms', () => {
    const result = normalizeSignal(makeSignal({ type: 'response_time', value: 3000, unit: 'ms' }));
    // 3000ms -> 3000/30000 = 0.1
    expect(result.normalizedValue).toBeCloseTo(0.1, 2);
  });

  it('clamps values to the valid range', () => {
    const tooHigh = normalizeSignal(makeSignal({ type: 'heart_rate', value: 300, unit: 'bpm' }));
    expect(tooHigh.normalizedValue).toBeLessThanOrEqual(1);

    const tooLow = normalizeSignal(makeSignal({ type: 'heart_rate', value: 10, unit: 'bpm' }));
    expect(tooLow.normalizedValue).toBeGreaterThanOrEqual(0);
  });

  it('assigns quality score based on data completeness', () => {
    const full = normalizeSignal(makeSignal({
      source: 'apple_watch',
      unit: 'bpm',
      metadata: { device: 'Series 8' },
    }));
    expect(full.quality).toBeGreaterThan(0.8);

    const partial = normalizeSignal(makeSignal({
      source: '',
      unit: undefined,
      metadata: undefined,
    }));
    // Missing source, unit, metadata should reduce quality
    expect(partial.quality).toBeLessThan(full.quality);
  });

  it('reduces quality for out-of-range values', () => {
    const normal = normalizeSignal(makeSignal({ value: 72, unit: 'bpm' }));
    const extreme = normalizeSignal(makeSignal({ value: 199, unit: 'bpm' }));
    expect(extreme.quality).toBeLessThan(normal.quality);
  });

  it('normalizes a batch of signals', () => {
    const batch = [
      makeSignal({ type: 'heart_rate', value: 72, unit: 'bpm' }),
      makeSignal({ type: 'steps', value: 3000, unit: 'steps' }),
      makeSignal({ type: 'score', value: 80, unit: 'percentage' }),
    ];
    const results = normalizeBatch(batch);
    expect(results).toHaveLength(3);
    results.forEach((r) => {
      expect(r.normalizedValue).toBeGreaterThanOrEqual(0);
      expect(r.normalizedValue).toBeLessThanOrEqual(1);
      expect(r.quality).toBeGreaterThanOrEqual(0);
      expect(r.quality).toBeLessThanOrEqual(1);
    });
  });

  it('infers unit range from signal type when unit is missing', () => {
    const result = normalizeSignal(makeSignal({ type: 'heart_rate', value: 100, unit: undefined }));
    // Should still normalize using the bpm range inferred from type
    expect(result.normalizedValue).toBeCloseTo((100 - 40) / (200 - 40), 1);
  });
});

// ---------------------------------------------------------------------------
// 2. Feature Building from time-windowed data
// ---------------------------------------------------------------------------
describe('Feature Building', () => {
  it('builds features from heart rate signals', () => {
    const signals: NormalizedSignal[] = [];
    for (let i = 0; i < 10; i++) {
      signals.push(makeNormalized({
        type: 'heart_rate',
        value: 70 + i,
        normalizedValue: (30 + i) / 160,
        timestamp: BASE_TIME + i * 60000,
      }));
    }

    const features = buildFeatures(signals, 30);

    expect(features.patientId).toBe(PATIENT_ID);
    expect(features.features['heart_rate_mean']).toBeDefined();
    expect(features.features['heart_rate_stddev']).toBeDefined();
    expect(features.features['heart_rate_min']).toBeDefined();
    expect(features.features['heart_rate_max']).toBeDefined();
    expect(features.features['heart_rate_trend']).toBeDefined();
    expect(features.features['heart_rate_count']).toBe(10);
  });

  it('builds cross-type features', () => {
    const signals: NormalizedSignal[] = [
      makeNormalized({ type: 'heart_rate', value: 72, timestamp: BASE_TIME }),
      makeNormalized({ type: 'steps', value: 100, timestamp: BASE_TIME + 1000 }),
    ];

    const features = buildFeatures(signals, 60);

    expect(features.features['total_signal_count']).toBe(2);
    expect(features.features['signal_type_count']).toBe(2);
    expect(features.features['avg_quality']).toBeDefined();
  });

  it('filters signals by time window', () => {
    const signals: NormalizedSignal[] = [
      makeNormalized({ type: 'heart_rate', value: 70, timestamp: BASE_TIME - 3600000 * 2 }),
      makeNormalized({ type: 'heart_rate', value: 75, timestamp: BASE_TIME }),
    ];

    const features = buildFeatures(signals, 30); // 30 minute window
    // Only the second signal should be within the window
    expect(features.features['heart_rate_count']).toBe(1);
  });

  it('returns empty features for empty input', () => {
    const features = buildFeatures([], 30);
    expect(features.patientId).toBe('');
    expect(Object.keys(features.features)).toHaveLength(0);
  });

  it('computes correct trend (positive slope)', () => {
    const signals: NormalizedSignal[] = [];
    for (let i = 0; i < 5; i++) {
      signals.push(makeNormalized({
        type: 'score',
        value: 60 + i * 5,
        normalizedValue: (60 + i * 5) / 100,
        timestamp: BASE_TIME + i * 60000,
      }));
    }

    const features = buildFeatures(signals, 30);
    expect(features.features['score_trend']).toBeGreaterThan(0);
  });

  it('computes raw value statistics', () => {
    const signals: NormalizedSignal[] = [
      makeNormalized({ type: 'heart_rate', value: 60, timestamp: BASE_TIME }),
      makeNormalized({ type: 'heart_rate', value: 80, timestamp: BASE_TIME + 1000 }),
    ];

    const features = buildFeatures(signals, 30);
    expect(features.features['heart_rate_raw_mean']).toBe(70);
    expect(features.features['heart_rate_raw_min']).toBe(60);
    expect(features.features['heart_rate_raw_max']).toBe(80);
  });
});

// ---------------------------------------------------------------------------
// 3. Daily Summary with real demo data
// ---------------------------------------------------------------------------
describe('Daily Summary Builder', () => {
  it('builds a complete daily summary', () => {
    const signals: NormalizedSignal[] = [
      // Heart rate readings throughout the day
      ...Array.from({ length: 24 }, (_, i) => makeNormalized({
        type: 'heart_rate',
        value: 65 + Math.floor(Math.random() * 20),
        timestamp: new Date('2025-03-15T00:00:00Z').getTime() + i * 3600000,
      })),
      // Step counts
      ...Array.from({ length: 12 }, (_, i) => makeNormalized({
        type: 'steps',
        value: 200 + Math.floor(Math.random() * 500),
        timestamp: new Date('2025-03-15T08:00:00Z').getTime() + i * 3600000,
      })),
      // Cognitive scores
      makeNormalized({ type: 'score', value: 78, timestamp: new Date('2025-03-15T10:00:00Z').getTime() }),
      makeNormalized({ type: 'score', value: 82, timestamp: new Date('2025-03-15T10:30:00Z').getTime() }),
    ];

    const summary = buildDailySummary(signals, '2025-03-15');

    expect(summary.patientId).toBe(PATIENT_ID);
    expect(summary.date).toBe('2025-03-15');
    expect(summary.heartRate.avg).toBeGreaterThan(0);
    expect(summary.heartRate.min).toBeLessThanOrEqual(summary.heartRate.avg);
    expect(summary.heartRate.max).toBeGreaterThanOrEqual(summary.heartRate.avg);
    expect(summary.steps.total).toBeGreaterThan(0);
    expect(summary.steps.hourly).toHaveLength(24);
    expect(summary.cognitiveActivity.sessions).toBeGreaterThanOrEqual(1);
    expect(summary.cognitiveActivity.avgScore).toBeGreaterThan(0);
  });

  it('handles empty signals gracefully', () => {
    const summary = buildDailySummary([], '2025-03-15');
    expect(summary.patientId).toBe('');
    expect(summary.heartRate.avg).toBe(0);
    expect(summary.steps.total).toBe(0);
    expect(summary.cognitiveActivity.sessions).toBe(0);
  });

  it('computes resting heart rate from 10th percentile', () => {
    const signals: NormalizedSignal[] = [];
    const values = [60, 62, 64, 65, 68, 70, 72, 75, 80, 90];
    values.forEach((v, i) => {
      signals.push(makeNormalized({
        type: 'heart_rate',
        value: v,
        timestamp: BASE_TIME + i * 60000,
      }));
    });

    const summary = buildDailySummary(signals, '2025-03-15');
    expect(summary.heartRate.resting).toBeLessThanOrEqual(65);
  });

  it('counts steps per hour correctly', () => {
    const signals: NormalizedSignal[] = [
      makeNormalized({
        type: 'steps',
        value: 500,
        timestamp: new Date('2025-03-15T10:00:00Z').getTime(),
      }),
      makeNormalized({
        type: 'steps',
        value: 300,
        timestamp: new Date('2025-03-15T10:30:00Z').getTime(),
      }),
      makeNormalized({
        type: 'steps',
        value: 200,
        timestamp: new Date('2025-03-15T14:00:00Z').getTime(),
      }),
    ];

    const summary = buildDailySummary(signals, '2025-03-15');
    expect(summary.steps.total).toBe(1000);
    expect(summary.steps.hourly[10]).toBe(800); // 500 + 300 at hour 10
    expect(summary.steps.hourly[14]).toBe(200);
  });

  it('detects sleep wake events from quality transitions', () => {
    const baseSleepTime = new Date('2025-03-15T01:00:00Z').getTime();
    const signals: NormalizedSignal[] = [
      makeNormalized({ type: 'sleep_quality', value: 80, normalizedValue: 0.8, timestamp: baseSleepTime }),
      makeNormalized({ type: 'sleep_quality', value: 85, normalizedValue: 0.85, timestamp: baseSleepTime + 1800000 }),
      makeNormalized({ type: 'sleep_quality', value: 15, normalizedValue: 0.15, timestamp: baseSleepTime + 3600000 }), // wake
      makeNormalized({ type: 'sleep_quality', value: 75, normalizedValue: 0.75, timestamp: baseSleepTime + 5400000 }),
    ];

    const summary = buildDailySummary(signals, '2025-03-15');
    expect(summary.sleep.wakeCount).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// 4. Anomaly Detection
// ---------------------------------------------------------------------------
describe('Anomaly Detection via Features', () => {
  it('detects high heart rate as anomalous via feature stddev', () => {
    const signals: NormalizedSignal[] = [];
    // Normal readings
    for (let i = 0; i < 8; i++) {
      signals.push(makeNormalized({
        type: 'heart_rate',
        value: 72,
        normalizedValue: 0.2,
        timestamp: BASE_TIME + i * 60000,
      }));
    }
    // Anomalous spike
    signals.push(makeNormalized({
      type: 'heart_rate',
      value: 150,
      normalizedValue: 0.6875,
      timestamp: BASE_TIME + 8 * 60000,
    }));

    const features = buildFeatures(signals, 30);
    // Standard deviation should be elevated due to the spike
    expect(features.features['heart_rate_stddev']).toBeGreaterThan(0.05);
  });

  it('normal data produces low stddev', () => {
    const signals: NormalizedSignal[] = [];
    for (let i = 0; i < 10; i++) {
      signals.push(makeNormalized({
        type: 'heart_rate',
        value: 72,
        normalizedValue: 0.2,
        timestamp: BASE_TIME + i * 60000,
      }));
    }

    const features = buildFeatures(signals, 30);
    expect(features.features['heart_rate_stddev']).toBeLessThan(0.01);
  });
});
