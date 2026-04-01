import { detectSundowningRisk, getEveningRoutineSteps, SundowningSignals } from '../src/SundowningDetector';

describe('SundowningDetector', () => {
  const baseSignals: SundowningSignals = {
    timeOfDay: 12,
    agitationLevel: 0.2,
    confusionScore: 0.2,
    restlessness: 0.2,
    recentSleepQuality: 0.8,
    lightExposure: 0.8,
  };

  describe('detectSundowningRisk', () => {
    it('should detect high risk during sundowning window (4-8 PM) with high agitation', () => {
      const signals: SundowningSignals = {
        timeOfDay: 17, // 5 PM
        agitationLevel: 0.9,
        confusionScore: 0.8,
        restlessness: 0.7,
        recentSleepQuality: 0.3,
        lightExposure: 0.2,
      };
      const result = detectSundowningRisk(signals);
      expect(result.isHighRisk).toBe(true);
      expect(result.riskScore).toBeGreaterThanOrEqual(0.5);
      expect(result.recommendation).toContain('Sundowning risk is elevated');
      expect(result.suggestedActions).toContain('Play calming music');
    });

    it('should detect low risk in morning hours with calm signals', () => {
      const signals: SundowningSignals = {
        timeOfDay: 9, // 9 AM
        agitationLevel: 0.1,
        confusionScore: 0.1,
        restlessness: 0.1,
        recentSleepQuality: 0.9,
        lightExposure: 0.9,
      };
      const result = detectSundowningRisk(signals);
      expect(result.isHighRisk).toBe(false);
      expect(result.riskScore).toBeLessThan(0.5);
      expect(result.recommendation).toContain('comfortable');
    });

    it('should increase risk when sleep quality is poor', () => {
      const goodSleep = detectSundowningRisk({ ...baseSignals, recentSleepQuality: 1.0 });
      const poorSleep = detectSundowningRisk({ ...baseSignals, recentSleepQuality: 0.0 });
      expect(poorSleep.riskScore).toBeGreaterThan(goodSleep.riskScore);
    });

    it('should increase risk when light exposure is low', () => {
      const brightLight = detectSundowningRisk({ ...baseSignals, lightExposure: 1.0 });
      const dimLight = detectSundowningRisk({ ...baseSignals, lightExposure: 0.0 });
      expect(dimLight.riskScore).toBeGreaterThan(brightLight.riskScore);
    });

    it('should bound risk score between 0 and 1', () => {
      // All maximum risk factors
      const maxRisk = detectSundowningRisk({
        timeOfDay: 18,
        agitationLevel: 1.0,
        confusionScore: 1.0,
        restlessness: 1.0,
        recentSleepQuality: 0.0,
        lightExposure: 0.0,
      });
      expect(maxRisk.riskScore).toBeLessThanOrEqual(1.0);
      expect(maxRisk.riskScore).toBeGreaterThanOrEqual(0.0);

      // All minimum risk factors
      const minRisk = detectSundowningRisk({
        timeOfDay: 10,
        agitationLevel: 0.0,
        confusionScore: 0.0,
        restlessness: 0.0,
        recentSleepQuality: 1.0,
        lightExposure: 1.0,
      });
      expect(minRisk.riskScore).toBeLessThanOrEqual(1.0);
      expect(minRisk.riskScore).toBeGreaterThanOrEqual(0.0);
    });

    it('should apply time factor during late evening (after 8 PM)', () => {
      const afternoon = detectSundowningRisk({ ...baseSignals, timeOfDay: 14 });
      const lateEvening = detectSundowningRisk({ ...baseSignals, timeOfDay: 21 });
      expect(lateEvening.riskScore).toBeGreaterThan(afternoon.riskScore);
    });

    it('should suggest sundowning-specific actions when high risk in window', () => {
      const signals: SundowningSignals = {
        timeOfDay: 18,
        agitationLevel: 0.9,
        confusionScore: 0.9,
        restlessness: 0.8,
        recentSleepQuality: 0.2,
        lightExposure: 0.1,
      };
      const result = detectSundowningRisk(signals);
      expect(result.suggestedActions).toContain('Increase room lighting');
      expect(result.suggestedActions).toContain('Offer a warm drink');
      expect(result.suggestedActions).toContain('Reduce noise and stimulation');
      expect(result.suggestedActions.length).toBeGreaterThanOrEqual(4);
    });

    it('should suggest monitoring actions for high risk outside sundowning window', () => {
      const signals: SundowningSignals = {
        timeOfDay: 22, // 10 PM, outside window but late
        agitationLevel: 0.9,
        confusionScore: 0.9,
        restlessness: 0.9,
        recentSleepQuality: 0.0,
        lightExposure: 0.0,
      };
      const result = detectSundowningRisk(signals);
      expect(result.isHighRisk).toBe(true);
      expect(result.recommendation).toContain('agitation');
      expect(result.suggestedActions).toContain('Offer reassurance');
    });
  });

  describe('getEveningRoutineSteps', () => {
    it('should return evening routine steps in chronological order', () => {
      const steps = getEveningRoutineSteps();
      expect(steps.length).toBeGreaterThanOrEqual(5);
      expect(steps[0].time).toBe('4:00 PM');
      expect(steps[steps.length - 1].time).toBe('8:00 PM');
    });

    it('should include activity and purpose for each step', () => {
      const steps = getEveningRoutineSteps();
      steps.forEach((step) => {
        expect(step.time).toBeTruthy();
        expect(step.activity).toBeTruthy();
        expect(step.purpose).toBeTruthy();
      });
    });
  });
});
