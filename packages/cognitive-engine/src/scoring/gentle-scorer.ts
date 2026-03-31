import { CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';
import { ExerciseResultInput, SessionScores, CognitiveMetrics } from './types';

/**
 * Gentle Scorer: The core clinical scoring engine.
 *
 * CRITICAL DESIGN PRINCIPLE: This scorer NEVER produces negative feedback.
 * Every code path results in one of three gentle states:
 * - CELEBRATED: Patient got it right
 * - GUIDED: Patient was close, gently corrected
 * - SUPPORTED: Patient couldn't answer, answer provided warmly
 *
 * Scores are normalized 0.0 - 1.0 per domain.
 */

export function calculateSessionScores(results: ExerciseResultInput[]): SessionScores {
  const byDomain = groupByDomain(results);

  const orientationScore = calculateDomainScore(byDomain[CognitiveDomain.ORIENTATION] ?? []);
  const identityScore = calculateDomainScore(byDomain[CognitiveDomain.IDENTITY] ?? []);
  const memoryScore = calculateDomainScore(byDomain[CognitiveDomain.MEMORY] ?? []);
  const languageScore = calculateDomainScore(byDomain[CognitiveDomain.LANGUAGE] ?? []);
  const executiveFunctionScore = calculateDomainScore(
    byDomain[CognitiveDomain.EXECUTIVE_FUNCTION] ?? [],
  );
  const attentionScore = calculateDomainScore(byDomain[CognitiveDomain.ATTENTION] ?? []);

  const activeDomains = [
    orientationScore,
    identityScore,
    memoryScore,
    languageScore,
    executiveFunctionScore,
    attentionScore,
  ].filter((s) => s > 0);

  const overallScore =
    activeDomains.length > 0
      ? activeDomains.reduce((sum, s) => sum + s, 0) / activeDomains.length
      : 0;

  return {
    overallScore: roundScore(overallScore),
    orientationScore: roundScore(orientationScore),
    identityScore: roundScore(identityScore),
    memoryScore: roundScore(memoryScore),
    languageScore: roundScore(languageScore),
    executiveFunctionScore: roundScore(executiveFunctionScore),
    attentionScore: roundScore(attentionScore),
  };
}

export function calculateDomainScore(results: ExerciseResultInput[]): number {
  if (results.length === 0) return 0;
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  return totalScore / results.length;
}

export function calculateCognitiveMetrics(results: ExerciseResultInput[]): CognitiveMetrics {
  if (results.length === 0) {
    return {
      averageScore: 0,
      averageResponseTimeMs: 0,
      completionRate: 0,
      celebratedCount: 0,
      guidedCount: 0,
      supportedCount: 0,
      totalExercises: 0,
    };
  }

  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const totalResponseTime = results.reduce((sum, r) => sum + r.responseTimeMs, 0);
  const correctCount = results.filter((r) => r.isCorrect).length;

  return {
    averageScore: roundScore(totalScore / results.length),
    averageResponseTimeMs: Math.round(totalResponseTime / results.length),
    completionRate: roundScore(correctCount / results.length),
    celebratedCount: results.filter((r) => r.feedbackType === FeedbackType.CELEBRATED).length,
    guidedCount: results.filter((r) => r.feedbackType === FeedbackType.GUIDED).length,
    supportedCount: results.filter((r) => r.feedbackType === FeedbackType.SUPPORTED).length,
    totalExercises: results.length,
  };
}

/**
 * Determines the appropriate gentle feedback message based on session performance.
 * NEVER returns discouraging language.
 */
export function getSessionCompletionMessage(metrics: CognitiveMetrics): string {
  if (metrics.totalExercises === 0) {
    return "Thank you for starting a session today. Every moment counts!";
  }

  if (metrics.completionRate >= 0.8) {
    return "What a wonderful session! You did a fantastic job today!";
  }

  if (metrics.completionRate >= 0.5) {
    return "Great work today! You showed real effort and that matters!";
  }

  return "Thank you for spending time exercising your mind today. You're doing great!";
}

/**
 * Detects if response times indicate fatigue.
 * Does NOT communicate fatigue to patient - only used for caregiver metrics.
 */
export function detectFatigueSignals(results: ExerciseResultInput[]): boolean {
  if (results.length < 3) return false;

  const lastThree = results.slice(-3);
  const firstThree = results.slice(0, 3);

  const avgLast = lastThree.reduce((s, r) => s + r.responseTimeMs, 0) / lastThree.length;
  const avgFirst = firstThree.reduce((s, r) => s + r.responseTimeMs, 0) / firstThree.length;

  // Response time increased by 50% or more
  return avgLast > avgFirst * 1.5;
}

function groupByDomain(
  results: ExerciseResultInput[],
): Partial<Record<CognitiveDomain, ExerciseResultInput[]>> {
  return results.reduce(
    (acc, result) => {
      if (!acc[result.domain]) acc[result.domain] = [];
      acc[result.domain]!.push(result);
      return acc;
    },
    {} as Partial<Record<CognitiveDomain, ExerciseResultInput[]>>,
  );
}

function roundScore(score: number): number {
  return Math.round(score * 100) / 100;
}
