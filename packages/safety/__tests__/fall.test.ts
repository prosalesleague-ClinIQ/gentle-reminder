import { detectFallRisk, getFallRiskScore } from '../src/FallDetector';

describe('Fall Detection', () => {
  it('detects a fall pattern (spike + stillness)', () => {
    const data = [
      // Normal walking
      ...Array.from({ length: 10 }, (_, i) => ({ x: Math.sin(i * 0.5) * 2, y: 9.8, z: Math.cos(i * 0.5) * 2, timestamp: Date.now() - (20 - i) * 100 })),
      // Impact spike
      { x: 15, y: 25, z: 18, timestamp: Date.now() - 1000 },
      { x: -12, y: -20, z: -15, timestamp: Date.now() - 900 },
      // Stillness after impact
      ...Array.from({ length: 10 }, (_, i) => ({ x: 0.1, y: 9.8, z: 0.1, timestamp: Date.now() - 800 + i * 100 })),
    ];
    const result = detectFallRisk(data);
    expect(result.isFall).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('does not flag normal walking', () => {
    const data = Array.from({ length: 30 }, (_, i) => ({
      x: Math.sin(i * 0.3) * 2,
      y: 9.8 + Math.sin(i * 0.6) * 0.5,
      z: Math.cos(i * 0.3) * 2,
      timestamp: Date.now() - (30 - i) * 100,
    }));
    const result = detectFallRisk(data);
    expect(result.isFall).toBe(false);
  });

  it('returns low risk for empty data', () => {
    const result = detectFallRisk([]);
    expect(result.isFall).toBe(false);
    expect(result.confidence).toBe(0);
  });

  it('calculates fall risk score', () => {
    const recentActivity = [
      { steps: 500, falls: 0, unsteadyEvents: 2 },
      { steps: 300, falls: 0, unsteadyEvents: 1 },
    ];
    const score = getFallRiskScore(recentActivity);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });
});
