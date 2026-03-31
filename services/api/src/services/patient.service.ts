import { getDatabase } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import type { PaginationMeta } from '@gentle-reminder/shared-types';
import { CognitiveStage } from '@prisma/client';

export async function createPatient(data: {
  userId: string;
  dateOfBirth: string;
  diagnosisDate?: string;
  cognitiveStage?: string;
  preferredName: string;
  city: string;
  timezone?: string;
  primaryLanguage?: string;
  notes?: string;
}) {
  const db = getDatabase();

  const existingPatient = await db.patient.findUnique({
    where: { userId: data.userId },
  });

  if (existingPatient) {
    throw AppError.conflict('A patient profile already exists for this user');
  }

  const patient = await db.patient.create({
    data: {
      userId: data.userId,
      dateOfBirth: new Date(data.dateOfBirth),
      diagnosisDate: data.diagnosisDate ? new Date(data.diagnosisDate) : undefined,
      cognitiveStage: (data.cognitiveStage || 'unknown') as CognitiveStage,
      preferredName: data.preferredName,
      city: data.city,
      timezone: data.timezone || 'UTC',
      primaryLanguage: data.primaryLanguage || 'en',
      notes: data.notes,
    },
  });

  return patient;
}

export async function getPatientById(id: string) {
  const db = getDatabase();

  const patient = await db.patient.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          profilePhotoUrl: true,
        },
      },
    },
  });

  if (!patient) {
    throw AppError.notFound('Patient');
  }

  return patient;
}

export async function getPatientProfile(id: string) {
  const db = getDatabase();

  const patient = await db.patient.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          profilePhotoUrl: true,
        },
      },
      familyMembers: {
        where: { isActive: true },
        select: {
          id: true,
          displayName: true,
          relationship: true,
          photoUrl: true,
        },
      },
      cognitiveScores: {
        orderBy: { recordedAt: 'desc' },
        take: 1,
        select: {
          overallScore: true,
          orientationScore: true,
          identityScore: true,
          memoryScore: true,
          recordedAt: true,
        },
      },
    },
  });

  if (!patient) {
    throw AppError.notFound('Patient');
  }

  const recentScore = patient.cognitiveScores[0] || null;

  return {
    ...patient,
    recentCognitiveScore: recentScore
      ? {
          overallScore: recentScore.overallScore,
          orientationScore: recentScore.orientationScore,
          identityScore: recentScore.identityScore,
          memoryScore: recentScore.memoryScore,
          recordedAt: recentScore.recordedAt,
        }
      : undefined,
    cognitiveScores: undefined,
  };
}

export async function updatePatient(
  id: string,
  data: {
    cognitiveStage?: string;
    preferredName?: string;
    city?: string;
    timezone?: string;
    primaryLanguage?: string;
    notes?: string;
  },
) {
  const db = getDatabase();

  const existing = await db.patient.findUnique({ where: { id } });
  if (!existing) {
    throw AppError.notFound('Patient');
  }

  const patient = await db.patient.update({
    where: { id },
    data: {
      ...data,
      cognitiveStage: data.cognitiveStage
        ? (data.cognitiveStage as CognitiveStage)
        : undefined,
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          profilePhotoUrl: true,
        },
      },
    },
  });

  return patient;
}

export async function deletePatient(id: string) {
  const db = getDatabase();

  const existing = await db.patient.findUnique({ where: { id } });
  if (!existing) {
    throw AppError.notFound('Patient');
  }

  await db.patient.delete({ where: { id } });
}

export async function listPatients(
  page: number,
  pageSize: number,
): Promise<{ patients: any[]; meta: PaginationMeta }> {
  const db = getDatabase();

  const [patients, totalCount] = await Promise.all([
    db.patient.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            profilePhotoUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    db.patient.count(),
  ]);

  return {
    patients,
    meta: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
}
