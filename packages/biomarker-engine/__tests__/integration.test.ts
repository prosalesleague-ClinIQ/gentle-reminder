import {
  analyzeRoutineDisruption,
  analyzeSleepIrregularity,
  analyzeResponseDelay,
  analyzeMedicationAdherence,
  analyzeSpeechHesitation,
  computeCompositeBiomarkerScore,
  detectDecline,
} from '../src';
import type { BehavioralSignal } from '../src/types';
import type { TimestampedScore } from '../src/scoring/DeclineDetector';

describe('Biomarker Pipeline Integration', () => {
  const makeSignal = (type: string, value: number, hoursAgo: number): BehavioralSignal => ({
    patientId: 'test-patient',
    source: 'test',
    signalType: type,
    value,
    recordedAt: new Date(Date.now() - hoursAgo * 3600000),
  });

  describe('Individual Analyzers', () => {
    it('analyzeRoutineDisruption handles empty input', () => {
      const result = analyzeRoutineDisruption([]);
      expect(result.trend).toBe('insufficient_data');
    });

    it('analyzeSleepIrregularity handles empty input', () => {
      const result = analyzeSleepIrregularity([]);
      expect(result.trend).toBe('insufficient_data');
    });

    it('analyzeResponseDelay handles empty input', () => {
      const result = analyzeResponseDelay([]);
      expect(result.trend).toBe('insufficient_data');
    });

    it('analyzeMedicationAdherence handles empty input', () => {
      const result = analyzeMedicationAdherence([]);
      expect(result.trend).toBe('insufficient_data');
    });

    it('analyzeSpeechHesitation handles empty input', () => {
      const result = analyzeSpeechHesitation([]);
      expect(result.trend).toBe('insufficient_data');
    });
  });

  describe('computeCompositeBiomarkerScore', () => {
    it('computes a full composite score from mixed signals', () => {
      const signals = [
        makeSignal('wake', 7, 24),
        makeSignal('wake', 7.5, 48),
        makeSignal('wake', 6.8, 72),
        makeSignal('sleep_start', 22, 24),
        makeSignal('sleep_end', 6.5, 24),
        makeSignal('sleep_start', 23, 48),
        makeSignal('sleep_end', 7, 48),
        makeSignal('response_time', 3500, 24),
        makeSignal('response_time', 3200, 48),
        makeSignal('medication_taken', 1, 24),
        makeSignal('medication_taken', 1, 48),
        makeSignal('medication_taken', 0, 72),
        makeSignal('hesitation_count', 3, 24),
        makeSignal('hesitation_count', 4, 48),
      ];

      const result = computeCompositeBiomarkerScore(signals);
      expect(result.overall).toBeGreaterThanOrEqual(0);
      expect(result.overall).toBeLessThanOrEqual(1);
      expect(result.individual.length).toBeGreaterThan(0);
    });

    it('returns insufficient_data when no signals provided', () => {
      const result = computeCompositeBiomarkerScore([]);
      expect(result.trend).toBe('insufficient_data');
      expect(result.confidence).toBe(0);
    });

    it('returns confidence between 0 and 1', () => {
      const signals = [
        makeSignal('response_time', 3000, 24),
        makeSignal('response_time', 3200, 48),
        makeSignal('response_time', 2800, 72),
      ];
      const result = computeCompositeBiomarkerScore(signals);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('includes all five individual biomarker results', () => {
      const signals = [
        makeSignal('wake', 7, 24),
        makeSignal('sleep_start', 22, 24),
        makeSignal('response_time', 3000, 24),
        makeSignal('medication_taken', 1, 24),
        makeSignal('hesitation_count', 3, 24),
      ];
      const result = computeCompositeBiomarkerScore(signals);
      expect(result.individual.length).toBe(5);
    });
  });

  describe('detectDecline', () => {
    it('detects decline when scores increase significantly', () => {
      const now = new Date();
      const scores: TimestampedScore[] = [
        { type: 'cognitive_delay', score: 0.3, date: new Date(now.getTime() - 25 * 86400000) },
        { type: 'cognitive_delay', score: 0.35, date: new Date(now.getTime() - 14 * 86400000) },
        { type: 'cognitive_delay', score: 0.5, date: now },
      ];

      const alerts = detectDecline(scores, { minPercentageChange: 15 });
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0].biomarkerType).toBe('cognitive_delay');
    });

    it('returns no alerts when scores are stable', () => {
      const now = new Date();
      const scores: TimestampedScore[] = [
        { type: 'routine_disruption', score: 0.3, date: new Date(now.getTime() - 20 * 86400000) },
        { type: 'routine_disruption', score: 0.31, date: new Date(now.getTime() - 10 * 86400000) },
        { type: 'routine_disruption', score: 0.32, date: now },
      ];

      const alerts = detectDecline(scores, { minPercentageChange: 15 });
      expect(alerts.length).toBe(0);
    });

    it('returns no alerts with fewer than 2 scores', () => {
      const scores: TimestampedScore[] = [
        { type: 'routine_disruption', score: 0.5, date: new Date() },
      ];

      const alerts = detectDecline(scores);
      expect(alerts.length).toBe(0);
    });

    it('deduplicates alerts per biomarker type keeping highest severity', () => {
      const now = new Date();
      // Create scores across multiple windows that all show increase
      const scores: TimestampedScore[] = [
        { type: 'speech_hesitation', score: 0.2, date: new Date(now.getTime() - 28 * 86400000) },
        { type: 'speech_hesitation', score: 0.25, date: new Date(now.getTime() - 14 * 86400000) },
        { type: 'speech_hesitation', score: 0.3, date: new Date(now.getTime() - 5 * 86400000) },
        { type: 'speech_hesitation', score: 0.7, date: now },
      ];

      const alerts = detectDecline(scores, { minPercentageChange: 10 });
      // Should only have one alert for speech_hesitation (deduplicated)
      const speechAlerts = alerts.filter(a => a.biomarkerType === 'speech_hesitation');
      expect(speechAlerts.length).toBe(1);
    });
  });
});
