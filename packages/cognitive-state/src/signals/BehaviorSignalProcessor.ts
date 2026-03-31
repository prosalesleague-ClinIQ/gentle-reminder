import { CognitiveState, BehaviorFeatures, StateScores } from '../types';

/**
 * Processes behavioral signals from activity monitoring to produce
 * cognitive state scores.
 *
 * Key mappings:
 * - Wandering flag => DISORIENTED
 * - Low activity + low social interaction => SAD
 * - High irregular activity => AGITATED
 * - Good routine adherence + normal activity => CALM / ENGAGED
 */

function normalizeScore(value: number, low: number, high: number): number {
  if (high === low) return value >= high ? 1.0 : 0.0;
  return Math.max(0, Math.min(1, (value - low) / (high - low)));
}

export function processBehaviorSignals(features: BehaviorFeatures): StateScores {
  const scores: StateScores = {
    [CognitiveState.CALM]: 0,
    [CognitiveState.CONFUSED]: 0,
    [CognitiveState.ANXIOUS]: 0,
    [CognitiveState.DISORIENTED]: 0,
    [CognitiveState.AGITATED]: 0,
    [CognitiveState.SAD]: 0,
    [CognitiveState.ENGAGED]: 0,
  };

  const { activityLevel, routineAdherence, socialInteraction, wanderingFlag } =
    features;

  // --- DISORIENTED ---
  // Wandering is the strongest indicator of disorientation
  const wanderingScore = wanderingFlag ? 0.8 : 0.0;
  const lowRoutineScore = normalizeScore(1.0 - routineAdherence, 0.3, 0.8);
  scores[CognitiveState.DISORIENTED] =
    wanderingScore * 0.7 + lowRoutineScore * 0.3;

  // --- SAD ---
  // Low activity combined with low social interaction
  const lowActivityScore = normalizeScore(100 - activityLevel, 50, 90);
  const lowSocialScore = normalizeScore(100 - socialInteraction, 50, 90);
  scores[CognitiveState.SAD] = lowActivityScore * 0.5 + lowSocialScore * 0.5;

  // --- AGITATED ---
  // High activity with low routine adherence (restless, erratic behavior)
  const highActivityScore = normalizeScore(activityLevel, 70, 95);
  const routineBreakScore = normalizeScore(1.0 - routineAdherence, 0.4, 0.8);
  scores[CognitiveState.AGITATED] =
    highActivityScore * 0.5 + routineBreakScore * 0.5;

  // --- ANXIOUS ---
  // Moderate-high activity with reduced social interaction
  const moderateHighActivity = normalizeScore(activityLevel, 55, 80);
  scores[CognitiveState.ANXIOUS] =
    moderateHighActivity * 0.4 + lowSocialScore * 0.3 + routineBreakScore * 0.3;

  // --- CONFUSED ---
  // Routine deviation without wandering, moderate activity changes
  const routineDeviation = normalizeScore(1.0 - routineAdherence, 0.2, 0.6);
  scores[CognitiveState.CONFUSED] =
    routineDeviation * 0.6 + (wanderingFlag ? 0.2 : 0.0) * 0.4;

  // --- ENGAGED ---
  // Good social interaction with moderate activity
  const goodSocialScore = normalizeScore(socialInteraction, 40, 80);
  const moderateActivity =
    1.0 - Math.abs(activityLevel - 50) / 50; // peak at 50
  scores[CognitiveState.ENGAGED] =
    goodSocialScore * 0.5 + Math.max(0, moderateActivity) * 0.3 + routineAdherence * 0.2;

  // --- CALM ---
  // Good routine adherence, moderate activity, no wandering
  const noWandering = wanderingFlag ? 0.0 : 1.0;
  scores[CognitiveState.CALM] =
    routineAdherence * 0.4 +
    Math.max(0, moderateActivity) * 0.3 +
    noWandering * 0.3;

  return scores;
}
