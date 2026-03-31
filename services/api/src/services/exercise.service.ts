import { getDatabase } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { ExerciseType as PrismaExerciseType, CognitiveDomain as PrismaCognitiveDomain, FeedbackType } from '@prisma/client';
import { ExerciseType, CognitiveDomain } from '@gentle-reminder/shared-types';

export async function recordExerciseResult(data: {
  sessionId: string;
  exerciseType: string;
  domain: string;
  prompt: string;
  expectedAnswer: string;
  givenAnswer: string;
  isCorrect: boolean;
  responseTimeMs: number;
  feedbackType: string;
  score: number;
  attemptNumber?: number;
}) {
  const db = getDatabase();

  const session = await db.session.findUnique({ where: { id: data.sessionId } });
  if (!session) {
    throw AppError.notFound('Session');
  }

  if (session.status === 'completed' || session.status === 'abandoned') {
    throw AppError.conflict('Cannot add results to a completed or abandoned session');
  }

  // Update session status to in_progress if it was just started
  if (session.status === 'started') {
    await db.session.update({
      where: { id: data.sessionId },
      data: { status: 'in_progress' },
    });
  }

  const result = await db.exerciseResult.create({
    data: {
      sessionId: data.sessionId,
      exerciseType: data.exerciseType as PrismaExerciseType,
      domain: data.domain as PrismaCognitiveDomain,
      prompt: data.prompt,
      expectedAnswer: data.expectedAnswer,
      givenAnswer: data.givenAnswer,
      isCorrect: data.isCorrect,
      responseTimeMs: data.responseTimeMs,
      feedbackType: data.feedbackType as FeedbackType,
      score: data.score,
      attemptNumber: data.attemptNumber || 1,
    },
  });

  // Increment exercise count on the session
  await db.session.update({
    where: { id: data.sessionId },
    data: { exerciseCount: { increment: 1 } },
  });

  return result;
}

export function getExerciseTypes() {
  return {
    exerciseTypes: Object.values(ExerciseType).map((type) => ({
      type,
      domain: getExerciseDomain(type),
      label: formatExerciseLabel(type),
    })),
    cognitiveDomains: Object.values(CognitiveDomain).map((domain) => ({
      domain,
      label: formatDomainLabel(domain),
    })),
  };
}

function getExerciseDomain(type: ExerciseType): CognitiveDomain {
  switch (type) {
    case ExerciseType.ORIENTATION_DATE:
    case ExerciseType.ORIENTATION_NAME:
    case ExerciseType.ORIENTATION_LOCATION:
      return CognitiveDomain.ORIENTATION;
    case ExerciseType.IDENTITY_RECOGNITION:
      return CognitiveDomain.IDENTITY;
    case ExerciseType.MEMORY_SEQUENCE:
    case ExerciseType.MEMORY_OBJECT:
    case ExerciseType.MEMORY_CATEGORY:
      return CognitiveDomain.MEMORY;
    default:
      return CognitiveDomain.MEMORY;
  }
}

function formatExerciseLabel(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function formatDomainLabel(domain: string): string {
  return domain
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
