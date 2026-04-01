import { CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';
import {
  calculateSessionScores,
  calculateCognitiveMetrics,
  getSessionCompletionMessage,
  detectFatigueSignals,
} from '../src/scoring/gentle-scorer';
import { analyzeDeclineTrend } from '../src/scoring/cognitive-metrics';

describe('Cognitive Metrics', () => {
  describe('analyzeDeclineTrend', () => {
    it('detects significant decline', () => {
      const recent = [
        { overallScore: 0.55, orientationScore: 0.5, identityScore: 0.6, memoryScore: 0.5, languageScore: 0, executiveFunctionScore: 0, attentionScore: 0 },
      ];
      const baseline = [
        { overallScore: 0.85, orientationScore: 0.9, identityScore: 0.8, memoryScore: 0.8, languageScore: 0, executiveFunctionScore: 0, attentionScore: 0 },
      ];
      const result = analyzeDeclineTrend(recent, baseline);
      expect(result.overallDecline).toBe(true);
      expect(result.alertRequired).toBe(true);
    });

    it('detects stable performance', () => {
      const recent = [
        { overallScore: 0.80, orientationScore: 0.82, identityScore: 0.78, memoryScore: 0.80, languageScore: 0, executiveFunctionScore: 0, attentionScore: 0 },
      ];
      const baseline = [
        { overallScore: 0.82, orientationScore: 0.84, identityScore: 0.80, memoryScore: 0.82, languageScore: 0, executiveFunctionScore: 0, attentionScore: 0 },
      ];
      const result = analyzeDeclineTrend(recent, baseline);
      expect(result.overallDecline).toBe(false);
      expect(result.alertRequired).toBe(false);
      expect(result.summary).toContain('stable');
    });

    it('handles empty inputs', () => {
      const result = analyzeDeclineTrend([], []);
      expect(result.trends).toEqual([]);
      expect(result.alertRequired).toBe(false);
    });

    it('identifies declining domains', () => {
      const recent = [
        { overallScore: 0.60, orientationScore: 0.80, identityScore: 0.70, memoryScore: 0.30, languageScore: 0, executiveFunctionScore: 0, attentionScore: 0 },
      ];
      const baseline = [
        { overallScore: 0.80, orientationScore: 0.82, identityScore: 0.78, memoryScore: 0.80, languageScore: 0, executiveFunctionScore: 0, attentionScore: 0 },
      ];
      const result = analyzeDeclineTrend(recent, baseline);
      const memoryTrend = result.trends.find(t => t.domain === 'memory');
      expect(memoryTrend?.isDecline).toBe(true);
      expect(memoryTrend?.severity).toBe('significant');
    });
  });

  describe('getSessionCompletionMessage', () => {
    it('always returns a positive message', () => {
      const testCases = [0, 0.25, 0.5, 0.75, 1.0];
      for (const rate of testCases) {
        const msg = getSessionCompletionMessage({
          averageScore: rate, averageResponseTimeMs: 3000, completionRate: rate,
          celebratedCount: 0, guidedCount: 0, supportedCount: 0, totalExercises: 5,
        });
        expect(msg).not.toMatch(/wrong|fail|bad|poor/i);
        expect(msg.length).toBeGreaterThan(0);
      }
    });
  });

  describe('detectFatigueSignals', () => {
    it('detects fatigue from increasing response times', () => {
      const results = Array.from({ length: 6 }, (_, i) => ({
        domain: 'orientation' as any,
        score: 0.8,
        responseTimeMs: 2000 + i * 1500,
        feedbackType: 'celebrated' as any,
        isCorrect: true,
      }));
      expect(detectFatigueSignals(results)).toBe(true);
    });

    it('does not flag consistent response times', () => {
      const results = Array.from({ length: 6 }, () => ({
        domain: 'orientation' as any,
        score: 0.8,
        responseTimeMs: 3000,
        feedbackType: 'celebrated' as any,
        isCorrect: true,
      }));
      expect(detectFatigueSignals(results)).toBe(false);
    });
  });
});
