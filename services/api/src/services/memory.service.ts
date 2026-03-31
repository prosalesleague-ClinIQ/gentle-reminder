import { getDatabase } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { MemoryType } from '@prisma/client';
import type { PaginationMeta } from '@gentle-reminder/shared-types';

export async function createMemory(data: {
  patientId: string;
  type: string;
  title: string;
  description?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  transcription?: string;
  tags?: string[];
  recordedAt?: string;
}) {
  const db = getDatabase();

  const patient = await db.patient.findUnique({ where: { id: data.patientId } });
  if (!patient) {
    throw AppError.notFound('Patient');
  }

  const memory = await db.memory.create({
    data: {
      patientId: data.patientId,
      type: data.type as MemoryType,
      title: data.title,
      description: data.description,
      mediaUrl: data.mediaUrl,
      thumbnailUrl: data.thumbnailUrl,
      transcription: data.transcription,
      isFavorite: false,
      recordedAt: data.recordedAt ? new Date(data.recordedAt) : undefined,
      tags: data.tags
        ? {
            create: data.tags.map((tag) => ({ tag })),
          }
        : undefined,
    },
    include: {
      tags: true,
    },
  });

  return {
    ...memory,
    tags: memory.tags.map((t: any) => t.tag),
  };
}

export async function getMemoryById(id: string) {
  const db = getDatabase();

  const memory = await db.memory.findUnique({
    where: { id },
    include: {
      tags: true,
      transcript: true,
    },
  });

  if (!memory) {
    throw AppError.notFound('Memory');
  }

  return {
    ...memory,
    tags: memory.tags.map((t: any) => t.tag),
  };
}

export async function listMemories(
  patientId: string,
  page: number,
  pageSize: number,
): Promise<{ memories: any[]; meta: PaginationMeta }> {
  const db = getDatabase();

  const where = { patientId };

  const [memories, totalCount] = await Promise.all([
    db.memory.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    db.memory.count({ where }),
  ]);

  return {
    memories: memories.map((m) => ({
      ...m,
      tags: m.tags.map((t: any) => t.tag),
    })),
    meta: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
}

export async function updateMemory(
  id: string,
  data: {
    title?: string;
    description?: string;
    transcription?: string;
    aiSummary?: string;
    tags?: string[];
    isFavorite?: boolean;
  },
) {
  const db = getDatabase();

  const existing = await db.memory.findUnique({ where: { id } });
  if (!existing) {
    throw AppError.notFound('Memory');
  }

  const { tags, ...updateData } = data;

  // If tags are being updated, delete existing and create new ones
  if (tags !== undefined) {
    await db.memoryTag.deleteMany({ where: { memoryId: id } });
  }

  const memory = await db.memory.update({
    where: { id },
    data: {
      ...updateData,
      tags: tags
        ? {
            create: tags.map((tag) => ({ tag })),
          }
        : undefined,
    },
    include: {
      tags: true,
    },
  });

  return {
    ...memory,
    tags: memory.tags.map((t: any) => t.tag),
  };
}

export async function deleteMemory(id: string) {
  const db = getDatabase();

  const existing = await db.memory.findUnique({ where: { id } });
  if (!existing) {
    throw AppError.notFound('Memory');
  }

  // Delete related tags first, then the memory
  await db.memoryTag.deleteMany({ where: { memoryId: id } });
  await db.memory.delete({ where: { id } });
}
