/**
 * Sundowning Detection
 * Detects late-afternoon/evening cognitive decline patterns.
 * Sundowning typically occurs between 4 PM and 8 PM.
 */

export interface SundowningSignals {
  timeOfDay: number; // 0-23 hour
  agitationLevel: number; // 0-1
  confusionScore: number; // 0-1
  restlessness: number; // 0-1
  recentSleepQuality: number; // 0-1 (1 = good)
  lightExposure: number; // 0-1 (1 = bright)
}

export interface SundowningRisk {
  isHighRisk: boolean;
  riskScore: number; // 0-1
  recommendation: string;
  suggestedActions: string[];
}

export function detectSundowningRisk(signals: SundowningSignals): SundowningRisk {
  const { timeOfDay, agitationLevel, confusionScore, restlessness, recentSleepQuality, lightExposure } = signals;

  // Sundowning window: 4 PM to 8 PM (hours 16-20)
  const inSundowningWindow = timeOfDay >= 16 && timeOfDay <= 20;
  const lateEvening = timeOfDay >= 20;

  // Time factor: higher during sundowning window
  let timeFactor = 0;
  if (inSundowningWindow) timeFactor = 0.3;
  else if (lateEvening) timeFactor = 0.15;

  // Poor sleep increases risk
  const sleepFactor = (1 - recentSleepQuality) * 0.2;

  // Low light exposure increases risk
  const lightFactor = (1 - lightExposure) * 0.1;

  // Behavioral signals
  const behaviorScore = (agitationLevel * 0.25 + confusionScore * 0.25 + restlessness * 0.2);

  const riskScore = Math.min(timeFactor + sleepFactor + lightFactor + behaviorScore, 1.0);
  const isHighRisk = riskScore >= 0.5;

  let recommendation: string;
  const suggestedActions: string[] = [];

  if (isHighRisk && inSundowningWindow) {
    recommendation = 'Sundowning risk is elevated. Begin calming evening routine.';
    suggestedActions.push('Increase room lighting');
    suggestedActions.push('Play calming music');
    suggestedActions.push('Offer a warm drink');
    suggestedActions.push('Reduce noise and stimulation');
    suggestedActions.push('Start gentle conversation about familiar topics');
  } else if (isHighRisk) {
    recommendation = 'Patient showing signs of agitation. Monitor closely.';
    suggestedActions.push('Check comfort level');
    suggestedActions.push('Offer reassurance');
    suggestedActions.push('Ensure adequate lighting');
  } else {
    recommendation = 'Patient appears comfortable. Continue normal routine.';
    suggestedActions.push('Maintain regular schedule');
  }

  return { isHighRisk, riskScore: Math.round(riskScore * 100) / 100, recommendation, suggestedActions };
}

export function getEveningRoutineSteps(): { time: string; activity: string; purpose: string }[] {
  return [
    { time: '4:00 PM', activity: 'Increase room lighting', purpose: 'Reduce disorientation from dimming light' },
    { time: '4:30 PM', activity: 'Light snack and warm drink', purpose: 'Comfort and blood sugar stability' },
    { time: '5:00 PM', activity: 'Calm music or familiar show', purpose: 'Reduce anxiety with familiar stimuli' },
    { time: '5:30 PM', activity: 'Gentle conversation or photo review', purpose: 'Emotional grounding' },
    { time: '6:00 PM', activity: 'Evening medication', purpose: 'Maintain schedule' },
    { time: '7:00 PM', activity: 'Wind down - dim lights slowly', purpose: 'Signal bedtime approaching' },
    { time: '8:00 PM', activity: 'Bedtime routine', purpose: 'Consistent sleep onset' },
  ];
}
