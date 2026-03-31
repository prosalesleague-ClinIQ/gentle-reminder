import { getDatabase } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import type { PaginationMeta } from '@gentle-reminder/shared-types';

export async function getCaregiverById(id: string) {
  const db = getDatabase();

  const caregiver = await db.caregiver.findUnique({
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
      assignments: {
        where: { removedAt: null },
        include: {
          patient: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!caregiver) {
    throw AppError.notFound('Caregiver');
  }

  return caregiver;
}

export async function listCaregivers(
  page: number,
  pageSize: number,
): Promise<{ caregivers: any[]; meta: PaginationMeta }> {
  const db = getDatabase();

  const [caregivers, totalCount] = await Promise.all([
    db.caregiver.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: { assignments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    db.caregiver.count(),
  ]);

  return {
    caregivers,
    meta: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
}

export async function assignCaregiver(caregiverId: string, patientId: string) {
  const db = getDatabase();

  const caregiver = await db.caregiver.findUnique({ where: { id: caregiverId } });
  if (!caregiver) {
    throw AppError.notFound('Caregiver');
  }

  const patient = await db.patient.findUnique({ where: { id: patientId } });
  if (!patient) {
    throw AppError.notFound('Patient');
  }

  const existingAssignment = await db.caregiverAssignment.findFirst({
    where: {
      caregiverId,
      patientId,
      removedAt: null,
    },
  });

  if (existingAssignment) {
    throw AppError.conflict('Caregiver is already assigned to this patient');
  }

  const assignment = await db.caregiverAssignment.create({
    data: {
      caregiverId,
      patientId,
    },
    include: {
      caregiver: {
        include: {
          user: {
            select: { firstName: true, lastName: true },
          },
        },
      },
      patient: {
        include: {
          user: {
            select: { firstName: true, lastName: true },
          },
        },
      },
    },
  });

  return assignment;
}

export async function unassignCaregiver(caregiverId: string, patientId: string) {
  const db = getDatabase();

  const assignment = await db.caregiverAssignment.findFirst({
    where: {
      caregiverId,
      patientId,
      removedAt: null,
    },
  });

  if (!assignment) {
    throw AppError.notFound('Active assignment');
  }

  await db.caregiverAssignment.update({
    where: { id: assignment.id },
    data: { removedAt: new Date() },
  });
}
