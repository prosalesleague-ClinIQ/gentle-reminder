import { getDatabase } from '@gentle-reminder/database';

export const resolvers = {
  Query: {
    patient: async (_: unknown, { id }: { id: string }) => {
      const db = getDatabase();
      return db.patient.findUnique({
        where: { id },
        include: { user: true, familyMembers: true },
      });
    },
    patients: async (_: unknown, { limit = 20, offset = 0 }: { limit?: number; offset?: number }) => {
      const db = getDatabase();
      const [patients, totalCount] = await Promise.all([
        db.patient.findMany({ take: limit, skip: offset, include: { user: true } }),
        db.patient.count(),
      ]);
      return { patients, totalCount };
    },
    sessionHistory: async (_: unknown, { patientId, limit = 20 }: { patientId: string; limit?: number }) => {
      const db = getDatabase();
      return db.session.findMany({
        where: { patientId },
        take: limit,
        orderBy: { startedAt: 'desc' },
        include: { exerciseResults: true },
      });
    },
    cognitiveScores: async (_: unknown, { patientId, days = 30 }: { patientId: string; days?: number }) => {
      const db = getDatabase();
      const since = new Date();
      since.setDate(since.getDate() - days);
      return db.cognitiveScore.findMany({
        where: { patientId, recordedAt: { gte: since } },
        orderBy: { recordedAt: 'asc' },
      });
    },
    alerts: async (_: unknown, { patientId, severity }: { patientId?: string; severity?: string }) => {
      const db = getDatabase();
      const where: any = {};
      if (patientId) where.patientId = patientId;
      if (severity) where.severity = severity;
      return db.alert.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 });
    },
    medications: async (_: unknown, { patientId }: { patientId: string }) => {
      const db = getDatabase();
      return db.medication.findMany({ where: { patientId, isActive: true } });
    },
    biomarkerScores: async (_: unknown, { patientId }: { patientId: string }) => {
      const db = getDatabase();
      return db.biomarkerScore.findMany({
        where: { patientId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    },
    riskPredictions: async (_: unknown, { patientId }: { patientId: string }) => {
      const db = getDatabase();
      return db.riskPrediction.findMany({
        where: { patientId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
    },
  },
  Patient: {
    sessions: async (parent: any) => {
      const db = getDatabase();
      return db.session.findMany({ where: { patientId: parent.id }, take: 10, orderBy: { startedAt: 'desc' } });
    },
    cognitiveScores: async (parent: any) => {
      const db = getDatabase();
      return db.cognitiveScore.findMany({ where: { patientId: parent.id }, take: 10, orderBy: { recordedAt: 'desc' } });
    },
    alerts: async (parent: any) => {
      const db = getDatabase();
      return db.alert.findMany({ where: { patientId: parent.id, isRead: false }, take: 10 });
    },
  },
};
