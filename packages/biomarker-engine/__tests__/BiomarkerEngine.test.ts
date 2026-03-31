import { BehavioralSignal } from '../src/types';
import { analyzeRoutineDisruption } from '../src/analyzers/RoutineAnalyzer';
import { analyzeSleepIrregularity } from '../src/analyzers/SleepAnalyzer';
import { analyzeResponseDelay } from '../src/analyzers/ResponseTimeAnalyzer';
import { analyzeMedicationAdherence } from '../src/analyzers/MedicationAdherenceAnalyzer';
import { analyzeSpeechHesitation } from '../src/analyzers/SpeechBiomarker';
import {
  computeCompositeBiomarkerScore,
  computeTrend,
} from '../src/scoring/BiomarkerEngine';
import { detectDecline, TimestampedScore } from '../src/scoring/DeclineDetector';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeSignal(
  overrides: Partial<BehavioralSignal> & { signalType: string; value: number }
): BehavioralSignal {
  return {
    patientId: 'patient-1',
    source: 'test',
    recordedAt: new Date('2025-01-15T08:00:00Z'),
    ...overrides,
  };
}

function daysAgo(days: number, hour = 8): Date {
  const d = new Date('2025-01-30T00:00:00Z');
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

// ---------------------------------------------------------------------------
// RoutineAnalyzer
// ---------------------------------------------------------------------------

describe('RoutineAnalyzer', () => {
  it('returns insufficient_data for too few signals', () => {
    const result = analyzeRoutineDisruption([
      makeSignal({ signalType: 'wake', value: 1 }),
    ]);
    expect(result.trend).toBe('insufficient_data');
    expect(result.confidence).toBe(0);
  });

  it('scores low disruption for consistent wake times', () => {
    const signals: BehavioralSignal[] = [];
    for (let i = 0; i < 7; i++) {
      // Wake at 7:00 AM every day (+/- 0 variance)
      signals.push(makeSignal({
        signalType: 'wake',
        value: 1,
        recordedAt: daysAgo(i, 7),
      }));
      signals.push(makeSignal({
        signalType: 'meal',
        value: 1,
        recordedAt: daysAgo(i, 12),
      }));
    }
    const result = analyzeRoutineDisruption(signals);
    expect(result.type).toBe('routine_disruption');
    expect(result.score).toBeLessThan(0.1);
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('scores high disruption for erratic wake times', () => {
    const signals: BehavioralSignal[] = [];
    const hours = [5, 11, 6, 14, 3, 10, 7]; // wildly varying
    for (let i = 0; i < 7; i++) {
      signals.push(makeSignal({
        signalType: 'wake',
        value: 1,
        recordedAt: daysAgo(i, hours[i]),
      }));
    }
    const result = analyzeRoutineDisruption(signals);
    expect(result.score).toBeGreaterThan(0.2);
  });
});

// ---------------------------------------------------------------------------
// SleepAnalyzer
// ---------------------------------------------------------------------------

describe('SleepAnalyzer', () => {
  it('returns insufficient_data for too few signals', () => {
    const result = analyzeSleepIrregularity([
      makeSignal({ signalType: 'sleep_start', value: 22 }),
    ]);
    expect(result.trend).toBe('insufficient_data');
  });

  it('scores low irregularity for consistent sleep patterns', () => {
    const signals: BehavioralSignal[] = [];
    for (let i = 0; i < 10; i++) {
      signals.push(makeSignal({
        signalType: 'sleep_start',
        value: 22.5, // 10:30 PM every night
        recordedAt: daysAgo(i, 22),
      }));
      signals.push(makeSignal({
        signalType: 'sleep_end',
        value: 7.0, // 7:00 AM every morning
        recordedAt: daysAgo(i, 7),
      }));
      signals.push(makeSignal({
        signalType: 'wake_count',
        value: 0, // no wakes
        recordedAt: daysAgo(i, 3),
      }));
    }
    const result = analyzeSleepIrregularity(signals);
    expect(result.type).toBe('sleep_irregularity');
    expect(result.score).toBeLessThan(0.05);
  });

  it('scores higher for frequent night waking', () => {
    const signals: BehavioralSignal[] = [];
    for (let i = 0; i < 10; i++) {
      signals.push(makeSignal({
        signalType: 'sleep_start',
        value: 22,
        recordedAt: daysAgo(i, 22),
      }));
      signals.push(makeSignal({
        signalType: 'sleep_end',
        value: 7,
        recordedAt: daysAgo(i, 7),
      }));
      signals.push(makeSignal({
        signalType: 'wake_count',
        value: 4, // frequent waking
        recordedAt: daysAgo(i, 3),
      }));
    }
    const result = analyzeSleepIrregularity(signals);
    expect(result.score).toBeGreaterThan(0.2);
  });
});

// ---------------------------------------------------------------------------
// ResponseTimeAnalyzer
// ---------------------------------------------------------------------------

describe('ResponseTimeAnalyzer', () => {
  it('returns insufficient_data for too few signals', () => {
    const result = analyzeResponseDelay([
      makeSignal({ signalType: 'response_time', value: 1500 }),
    ]);
    expect(result.trend).toBe('insufficient_data');
  });

  it('scores low for fast, consistent response times', () => {
    const signals: BehavioralSignal[] = [];
    for (let i = 0; i < 10; i++) {
      signals.push(makeSignal({
        signalType: 'response_time',
        value: 800 + Math.random() * 200, // 800-1000ms
        recordedAt: daysAgo(i),
      }));
    }
    const result = analyzeResponseDelay(signals);
    expect(result.type).toBe('cognitive_delay');
    expect(result.score).toBeLessThan(0.4);
  });

  it('scores high for slow response times', () => {
    const signals: BehavioralSignal[] = [];
    for (let i = 0; i < 10; i++) {
      signals.push(makeSignal({
        signalType: 'response_time',
        value: 4500 + i * 100, // 4500ms+ and getting slower
        recordedAt: daysAgo(10 - i),
      }));
    }
    const result = analyzeResponseDelay(signals);
    expect(result.score).toBeGreaterThan(0.7);
  });

  it('detects declining trend when responses slow over time', () => {
    const signals: BehavioralSignal[] = [];
    for (let i = 0; i < 15; i++) {
      signals.push(makeSignal({
        signalType: 'response_time',
        value: 1000 + i * 300, // steadily increasing
        recordedAt: daysAgo(15 - i),
      }));
    }
    const result = analyzeResponseDelay(signals);
    expect(result.trend).toBe('declining');
  });
});

// ---------------------------------------------------------------------------
// MedicationAdherenceAnalyzer
// ---------------------------------------------------------------------------

describe('MedicationAdherenceAnalyzer', () => {
  it('returns insufficient_data for too few signals', () => {
    const result = analyzeMedicationAdherence([
      makeSignal({ signalType: 'medication_taken', value: 1 }),
    ]);
    expect(result.trend).toBe('insufficient_data');
  });

  it('scores high (near 1) for perfect adherence', () => {
    const signals: BehavioralSignal[] = [];
    for (let i = 0; i < 14; i++) {
      signals.push(makeSignal({
        signalType: 'medication_taken',
        value: 1,
        recordedAt: daysAgo(i, 9),
      }));
    }
    const result = analyzeMedicationAdherence(signals);
    expect(result.type).toBe('medication_adherence');
    expect(result.score).toBeGreaterThanOrEqual(0.9);
  });

  it('scores low for poor adherence with many misses', () => {
    const signals: BehavioralSignal[] = [];
    for (let i = 0; i < 14; i++) {
      if (i % 3 === 0) {
        signals.push(makeSignal({
          signalType: 'medication_taken',
          value: 1,
          recordedAt: daysAgo(i, 9),
        }));
      } else {
        signals.push(makeSignal({
          signalType: 'medication_missed',
          value: 1,
          recordedAt: daysAgo(i, 9),
        }));
      }
    }
    const result = analyzeMedicationAdherence(signals);
    expect(result.score).toBeLessThan(0.5);
  });
});

// ---------------------------------------------------------------------------
// SpeechBiomarker
// ---------------------------------------------------------------------------

describe('SpeechBiomarker', () => {
  it('returns insufficient_data for too few signals', () => {
    const result = analyzeSpeechHesitation([
      makeSignal({ signalType: 'hesitation_count', value: 2 }),
    ]);
    expect(result.trend).toBe('insufficient_data');
  });

  it('scores low for fluent speech patterns', () => {
    const signals: BehavioralSignal[] = [];
    for (let i = 0; i < 5; i++) {
      signals.push(makeSignal({
        signalType: 'hesitation_count',
        value: 1,
        recordedAt: daysAgo(i),
      }));
      signals.push(makeSignal({
        signalType: 'pause_duration',
        value: 2, // 2 seconds total pause
        recordedAt: daysAgo(i),
      }));
      signals.push(makeSignal({
        signalType: 'speech_rate',
        value: 160, // normal wpm
        recordedAt: daysAgo(i),
      }));
    }
    const result = analyzeSpeechHesitation(signals);
    expect(result.type).toBe('speech_hesitation');
    expect(result.score).toBeLessThan(0.2);
  });

  it('scores high for impaired speech', () => {
    const signals: BehavioralSignal[] = [];
    for (let i = 0; i < 5; i++) {
      signals.push(makeSignal({
        signalType: 'hesitation_count',
        value: 8,
        recordedAt: daysAgo(i),
      }));
      signals.push(makeSignal({
        signalType: 'pause_duration',
        value: 25, // 25 seconds of pauses
        recordedAt: daysAgo(i),
      }));
      signals.push(makeSignal({
        signalType: 'speech_rate',
        value: 60, // very slow
        recordedAt: daysAgo(i),
      }));
    }
    const result = analyzeSpeechHesitation(signals);
    expect(result.score).toBeGreaterThan(0.6);
  });
});

// ---------------------------------------------------------------------------
// Composite BiomarkerEngine
// ---------------------------------------------------------------------------

describe('BiomarkerEngine - computeCompositeBiomarkerScore', () => {
  it('returns insufficient_data when no valid signals are provided', () => {
    const result = computeCompositeBiomarkerScore([]);
    expect(result.overall).toBe(0);
    expect(result.confidence).toBe(0);
    expect(result.trend).toBe('insufficient_data');
  });

  it('computes a composite score from mixed signals', () => {
    const signals: BehavioralSignal[] = [];

    // Add routine signals (consistent)
    for (let i = 0; i < 7; i++) {
      signals.push(makeSignal({ signalType: 'wake', value: 1, recordedAt: daysAgo(i, 7) }));
      signals.push(makeSignal({ signalType: 'meal', value: 1, recordedAt: daysAgo(i, 12) }));
    }

    // Add sleep signals (consistent)
    for (let i = 0; i < 7; i++) {
      signals.push(makeSignal({ signalType: 'sleep_start', value: 22, recordedAt: daysAgo(i, 22) }));
      signals.push(makeSignal({ signalType: 'sleep_end', value: 7, recordedAt: daysAgo(i, 7) }));
      signals.push(makeSignal({ signalType: 'wake_count', value: 1, recordedAt: daysAgo(i, 3) }));
    }

    // Add response time signals (moderate)
    for (let i = 0; i < 7; i++) {
      signals.push(makeSignal({ signalType: 'response_time', value: 2000, recordedAt: daysAgo(i) }));
    }

    // Add medication signals (good adherence)
    for (let i = 0; i < 7; i++) {
      signals.push(makeSignal({ signalType: 'medication_taken', value: 1, recordedAt: daysAgo(i, 9) }));
    }

    // Add speech signals (moderate)
    for (let i = 0; i < 5; i++) {
      signals.push(makeSignal({ signalType: 'hesitation_count', value: 3, recordedAt: daysAgo(i) }));
      signals.push(makeSignal({ signalType: 'speech_rate', value: 130, recordedAt: daysAgo(i) }));
    }

    const result = computeCompositeBiomarkerScore(signals);

    expect(result.overall).toBeGreaterThanOrEqual(0);
    expect(result.overall).toBeLessThanOrEqual(1);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.individual).toHaveLength(5);
    expect(['improving', 'stable', 'declining']).toContain(result.trend);
  });

  it('returns all 5 individual biomarker results', () => {
    const signals: BehavioralSignal[] = [];
    for (let i = 0; i < 10; i++) {
      signals.push(makeSignal({ signalType: 'wake', value: 1, recordedAt: daysAgo(i, 7) }));
      signals.push(makeSignal({ signalType: 'sleep_start', value: 22, recordedAt: daysAgo(i, 22) }));
      signals.push(makeSignal({ signalType: 'sleep_end', value: 7, recordedAt: daysAgo(i, 7) }));
      signals.push(makeSignal({ signalType: 'response_time', value: 1500, recordedAt: daysAgo(i) }));
      signals.push(makeSignal({ signalType: 'medication_taken', value: 1, recordedAt: daysAgo(i, 9) }));
      signals.push(makeSignal({ signalType: 'hesitation_count', value: 2, recordedAt: daysAgo(i) }));
      signals.push(makeSignal({ signalType: 'speech_rate', value: 140, recordedAt: daysAgo(i) }));
    }

    const result = computeCompositeBiomarkerScore(signals);
    const types = result.individual.map(r => r.type);
    expect(types).toContain('routine_disruption');
    expect(types).toContain('sleep_irregularity');
    expect(types).toContain('cognitive_delay');
    expect(types).toContain('medication_adherence');
    expect(types).toContain('speech_hesitation');
  });
});

// ---------------------------------------------------------------------------
// computeTrend
// ---------------------------------------------------------------------------

describe('BiomarkerEngine - computeTrend', () => {
  it('returns stable when no previous scores exist', () => {
    expect(computeTrend(0.5, [])).toBe('stable');
  });

  it('returns declining when score increases significantly', () => {
    expect(computeTrend(0.7, [0.4, 0.45, 0.5])).toBe('declining');
  });

  it('returns improving when score decreases significantly', () => {
    expect(computeTrend(0.3, [0.6, 0.55, 0.5])).toBe('improving');
  });

  it('returns stable when change is within threshold', () => {
    expect(computeTrend(0.52, [0.5, 0.5, 0.5])).toBe('stable');
  });
});

// ---------------------------------------------------------------------------
// DeclineDetector
// ---------------------------------------------------------------------------

describe('DeclineDetector', () => {
  it('returns no alerts for stable scores', () => {
    const scores: TimestampedScore[] = [];
    for (let i = 0; i < 10; i++) {
      scores.push({
        date: daysAgo(i),
        type: 'cognitive_delay',
        score: 0.3,
      });
    }
    const alerts = detectDecline(scores);
    expect(alerts).toHaveLength(0);
  });

  it('detects decline when score crosses threshold', () => {
    const scores: TimestampedScore[] = [
      { date: daysAgo(10), type: 'cognitive_delay', score: 0.3 },
      { date: daysAgo(8), type: 'cognitive_delay', score: 0.35 },
      { date: daysAgo(5), type: 'cognitive_delay', score: 0.4 },
      { date: daysAgo(2), type: 'cognitive_delay', score: 0.5 },
      { date: daysAgo(0), type: 'cognitive_delay', score: 0.7 },
    ];
    const alerts = detectDecline(scores);
    expect(alerts.length).toBeGreaterThanOrEqual(1);
    expect(alerts[0].biomarkerType).toBe('cognitive_delay');
    expect(alerts[0].percentageChange).toBeGreaterThan(0);
  });

  it('assigns correct severity levels', () => {
    const scores: TimestampedScore[] = [
      { date: daysAgo(5), type: 'speech_hesitation', score: 0.2 },
      { date: daysAgo(0), type: 'speech_hesitation', score: 0.9 },
    ];
    const alerts = detectDecline(scores);
    expect(alerts.length).toBeGreaterThanOrEqual(1);
    expect(alerts[0].severity).toBe('critical');
  });

  it('returns empty for too few scores', () => {
    const alerts = detectDecline([
      { date: daysAgo(0), type: 'cognitive_delay', score: 0.5 },
    ]);
    expect(alerts).toHaveLength(0);
  });

  it('handles multiple biomarker types independently', () => {
    const scores: TimestampedScore[] = [
      { date: daysAgo(10), type: 'cognitive_delay', score: 0.2 },
      { date: daysAgo(0), type: 'cognitive_delay', score: 0.6 },
      { date: daysAgo(10), type: 'speech_hesitation', score: 0.3 },
      { date: daysAgo(0), type: 'speech_hesitation', score: 0.8 },
    ];
    const alerts = detectDecline(scores);
    const types = alerts.map(a => a.biomarkerType);
    expect(types).toContain('cognitive_delay');
    expect(types).toContain('speech_hesitation');
  });
});
