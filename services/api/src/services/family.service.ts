import { getDatabase } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { Relationship } from '@prisma/client';

export async function createFamilyMember(data: {
  patientId: string;
  userId?: string;
  displayName: string;
  relationship: string;
  photoUrl?: string;
  voiceMessageUrl?: string;
  videoMessageUrl?: string;
  notes?: string;
}) {
  const db = getDatabase();

  const patient = await db.patient.findUnique({ where: { id: data.patientId } });
  if (!patient) {
    throw AppError.notFound('Patient');
  }

  const familyMember = await db.familyMember.create({
    data: {
      patientId: data.patientId,
      userId: data.userId,
      displayName: data.displayName,
      relationship: data.relationship as Relationship,
      photoUrl: data.photoUrl,
      voiceMessageUrl: data.voiceMessageUrl,
      videoMessageUrl: data.videoMessageUrl,
      notes: data.notes,
      isActive: true,
    },
  });

  return familyMember;
}

export async function getFamilyMemberById(id: string) {
  const db = getDatabase();

  const member = await db.familyMember.findUnique({
    where: { id },
  });

  if (!member) {
    throw AppError.notFound('Family member');
  }

  return member;
}

export async function listFamilyMembers(patientId: string) {
  const db = getDatabase();

  const patient = await db.patient.findUnique({ where: { id: patientId } });
  if (!patient) {
    throw AppError.notFound('Patient');
  }

  const members = await db.familyMember.findMany({
    where: {
      patientId,
      isActive: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  return members;
}

export async function updateFamilyMember(
  id: string,
  data: {
    displayName?: string;
    relationship?: string;
    photoUrl?: string;
    voiceMessageUrl?: string;
    videoMessageUrl?: string;
    notes?: string;
    isActive?: boolean;
  },
) {
  const db = getDatabase();

  const existing = await db.familyMember.findUnique({ where: { id } });
  if (!existing) {
    throw AppError.notFound('Family member');
  }

  const member = await db.familyMember.update({
    where: { id },
    data: {
      ...data,
      relationship: data.relationship ? (data.relationship as Relationship) : undefined,
    },
  });

  return member;
}

export async function deleteFamilyMember(id: string) {
  const db = getDatabase();

  const existing = await db.familyMember.findUnique({ where: { id } });
  if (!existing) {
    throw AppError.notFound('Family member');
  }

  // Soft delete by setting isActive to false
  await db.familyMember.update({
    where: { id },
    data: { isActive: false },
  });
}
