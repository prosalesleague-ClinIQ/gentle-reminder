import { getDatabase } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import type { CognitiveTrends, AnalyticsTrend } from '@gentle-reminder/shared-types';

const PERIOD_DAYS: Record<string, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '6m': 180,
  '1y': 365,
};

export async function getCognitiveTrends(
  patientId: string,
  period: string,
): Promise<CognitiveTrends> {
  const db = getDatabase();

  const patient = await db.patient.findUnique({ where: { id: patientId } });
  if (!patient) {
    throw AppError.notFound('Patient');
  }

  const days = PERIOD_DAYS[period] || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const scores = await db.cognitiveScore.findMany({
    where: {
      patientId,
      recordedAt: { gte: startDate },
    },
    orderBy: { recordedAt: 'asc' },
  });

  const overallTrend: AnalyticsTrend[] = scores.map((s) => ({
    date: s.recordedAt.toISOString().split('T')[0],
    value: s.overallScore,
  }));

  const orientationTrend: AnalyticsTrend[] = scores.map((s) => ({
    date: s.recordedAt.toISOString().split('T')[0],
    value: s.orientationScore,
  }));

  const identityTrend: AnalyticsTrend[] = scores.map((s) => ({
    date: s.recordedAt.toISOString().split('T')[0],
    value: s.identityScore,
  }));

  const memoryTrend: AnalyticsTrend[] = scores.map((s) => ({
    date: s.recordedAt.toISOString().split('T')[0],
    value: s.memoryScore,
  }));

  // Calculate session completion rate
  const sessions = await db.session.findMany({
    where: {
      patientId,
      startedAt: { gte: startDate },
    },
  });

  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const sessionCompletionRate =
    sessions.length > 0 ? (completedSessions.length / sessions.length) * 100 : 0;

  const averageSessionDuration =
    completedSessions.length > 0
      ? completedSessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0) /
        completedSessions.length
      : 0;

  return {
    patientId,
    period,
    overallTrend,
    orientationTrend,
    identityTrend,
    memoryTrend,
    sessionCompletionRate: Math.round(sessionCompletionRate * 100) / 100,
    averageSessionDuration: Math.round(averageSessionDuration),
  };
}

export async function getEngagement(patientId: string, period: string) {
  const db = getDatabase();

  const patient = await db.patient.findUnique({ where: { id: patientId } });
  if (!patient) {
    throw AppError.notFound('Patient');
  }

  const days = PERIOD_DAYS[period] || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const sessions = await db.session.findMany({
    where: {
      patientId,
      startedAt: { gte: startDate },
    },
    orderBy: { startedAt: 'asc' },
  });

  const exerciseResults = await db.exerciseResult.findMany({
    where: {
      session: {
        patientId,
        startedAt: { gte: startDate },
      },
    },
  });

  // Sessions per day trend
  const sessionsByDay = new Map<string, number>();
  for (const session of sessions) {
    const day = session.startedAt.toISOString().split('T')[0];
    sessionsByDay.set(day, (sessionsByDay.get(day) || 0) + 1);
  }

  const sessionsPerDay: AnalyticsTrend[] = Array.from(sessionsByDay.entries()).map(
    ([date, value]) => ({ date, value }),
  );

  // Average response time trend by day
  const responseTimeByDay = new Map<string, { total: number; count: number }>();
  for (const result of exerciseResults) {
    const day = result.createdAt.toISOString().split('T')[0];
    const existing = responseTimeByDay.get(day) || { total: 0, count: 0 };
    existing.total += result.responseTimeMs;
    existing.count += 1;
    responseTimeByDay.set(day, existing);
  }

  const avgResponseTimeTrend: AnalyticsTrend[] = Array.from(
    responseTimeByDay.entries(),
  ).map(([date, { total, count }]) => ({
    date,
    value: Math.round(total / count),
    label: 'ms',
  }));

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.status === 'completed').length;
  const abandonedSessions = sessions.filter((s) => s.status === 'abandoned').length;
  const totalExercises = exerciseResults.length;
  const correctAnswers = exerciseResults.filter((r) => r.isCorrect).length;
  const accuracyRate = totalExercises > 0 ? (correctAnswers / totalExercises) * 100 : 0;

  return {
    patientId,
    period,
    totalSessions,
    completedSessions,
    abandonedSessions,
    totalExercises,
    correctAnswers,
    accuracyRate: Math.round(accuracyRate * 100) / 100,
    sessionsPerDay,
    avgResponseTimeTrend,
  };
}
