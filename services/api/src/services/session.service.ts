import { getDatabase } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { calculateSessionScores } from '@gentle-reminder/cognitive-engine';
import type { PaginationMeta, SessionStatus } from '@gentle-reminder/shared-types';

export async function startSession(patientId: string) {
  const db = getDatabase();

  const patient = await db.patient.findUnique({ where: { id: patientId } });
  if (!patient) {
    throw AppError.notFound('Patient');
  }

  // Check for already active sessions
  const activeSession = await db.session.findFirst({
    where: {
      patientId,
      status: { in: ['started', 'in_progress'] },
    },
  });

  if (activeSession) {
    throw AppError.conflict('Patient already has an active session');
  }

  const session = await db.session.create({
    data: {
      patientId,
      status: 'started',
      startedAt: new Date(),
      exerciseCount: 0,
    },
  });

  return session;
}

export async function completeSession(sessionId: string, notes?: string) {
  const db = getDatabase();

  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: {
      exerciseResults: true,
    },
  });

  if (!session) {
    throw AppError.notFound('Session');
  }

  if (session.status === 'completed') {
    throw AppError.conflict('Session is already completed');
  }

  const now = new Date();
  const durationSeconds = Math.round((now.getTime() - session.startedAt.getTime()) / 1000);

  // Calculate scores from exercise results
  let overallScore: number | undefined;
  if (session.exerciseResults.length > 0) {
    const resultInputs = session.exerciseResults.map((r) => ({
      domain: r.domain as any,
      score: r.score,
      isCorrect: r.isCorrect,
      responseTimeMs: r.responseTimeMs,
      feedbackType: r.feedbackType as any,
    }));

    const scores = calculateSessionScores(resultInputs);
    overallScore = scores.overallScore;

    // Store cognitive scores
    await db.cognitiveScore.create({
      data: {
        patientId: session.patientId,
        sessionId: session.id,
        overallScore: scores.overallScore,
        orientationScore: scores.orientationScore ?? 0,
        identityScore: scores.identityScore ?? 0,
        memoryScore: scores.memoryScore ?? 0,
        languageScore: scores.languageScore ?? 0,
        executiveFunctionScore: scores.executiveFunctionScore ?? 0,
        attentionScore: scores.attentionScore ?? 0,
        recordedAt: now,
      },
    });
  }

  const updatedSession = await db.session.update({
    where: { id: sessionId },
    data: {
      status: 'completed',
      completedAt: now,
      durationSeconds,
      exerciseCount: session.exerciseResults.length,
      overallScore,
      notes,
    },
    include: {
      exerciseResults: {
        select: {
          exerciseType: true,
          score: true,
          responseTimeMs: true,
          feedbackType: true,
        },
      },
    },
  });

  return updatedSession;
}

export async function getSessionById(id: string) {
  const db = getDatabase();

  const session = await db.session.findUnique({
    where: { id },
    include: {
      exerciseResults: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!session) {
    throw AppError.notFound('Session');
  }

  return session;
}

export async function getSessionHistory(
  patientId: string,
  page: number,
  pageSize: number,
  startDate?: string,
  endDate?: string,
): Promise<{ sessions: any[]; meta: PaginationMeta }> {
  const db = getDatabase();

  const where: any = { patientId };

  if (startDate || endDate) {
    where.startedAt = {};
    if (startDate) where.startedAt.gte = new Date(startDate);
    if (endDate) where.startedAt.lte = new Date(endDate);
  }

  const [sessions, totalCount] = await Promise.all([
    db.session.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        exerciseResults: {
          select: {
            exerciseType: true,
            score: true,
            responseTimeMs: true,
            feedbackType: true,
          },
        },
      },
      orderBy: { startedAt: 'desc' },
    }),
    db.session.count({ where }),
  ]);

  return {
    sessions,
    meta: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
}
