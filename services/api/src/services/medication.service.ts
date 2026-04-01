import { getDatabase } from '@gentle-reminder/database';
import { AppError } from '../middleware/errorHandler.js';

export async function getMedications(patientId: string) {
  const db = getDatabase();
  return db.medication.findMany({
    where: { patientId, isActive: true },
    orderBy: { name: 'asc' },
  });
}

export async function createMedication(data: {
  patientId: string;
  name: string;
  dosage: string;
  route?: string;
  frequency: string;
  scheduledTimes: string[];
  instructions?: string;
  prescribedBy?: string;
  startDate: string;
  endDate?: string;
}) {
  const db = getDatabase();
  return db.medication.create({
    data: {
      patientId: data.patientId,
      name: data.name,
      dosage: data.dosage,
      route: data.route || 'oral',
      frequency: data.frequency,
      scheduledTimes: data.scheduledTimes,
      instructions: data.instructions,
      prescribedBy: data.prescribedBy,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  });
}

export async function logAdministration(data: {
  medicationId: string;
  patientId: string;
  administeredBy?: string;
  status: string;
  scheduledTime: string;
  notes?: string;
}) {
  const db = getDatabase();

  const medication = await db.medication.findUnique({ where: { id: data.medicationId } });
  if (!medication) throw AppError.notFound('Medication not found');

  return db.medicationLog.create({
    data: {
      medicationId: data.medicationId,
      patientId: data.patientId,
      administeredBy: data.administeredBy,
      status: data.status,
      scheduledTime: data.scheduledTime,
      takenAt: data.status === 'taken' ? new Date() : null,
      notes: data.notes,
    },
  });
}

export async function getTodaySchedule(patientId: string) {
  const db = getDatabase();
  const medications = await db.medication.findMany({
    where: { patientId, isActive: true },
    include: {
      logs: {
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return medications.map((med) => ({
    ...med,
    todayLogs: med.logs,
    scheduledTimes: med.scheduledTimes,
  }));
}

export async function getAdherenceRate(patientId: string, days: number = 30) {
  const db = getDatabase();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const logs = await db.medicationLog.findMany({
    where: { patientId, createdAt: { gte: since } },
  });

  const total = logs.length;
  const taken = logs.filter((l) => l.status === 'taken').length;

  return {
    total,
    taken,
    rate: total > 0 ? Math.round((taken / total) * 100) : 0,
    period: `${days} days`,
  };
}
