import { z } from 'zod';
import { CognitiveStage, Relationship, MemoryType } from '@gentle-reminder/shared-types';

export const createPatientSchema = z.object({
  userId: z.string().uuid('Invalid user UUID'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  diagnosisDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  cognitiveStage: z.nativeEnum(CognitiveStage).optional().default(CognitiveStage.UNKNOWN),
  preferredName: z.string().min(1, 'Preferred name is required').max(100),
  city: z.string().min(1, 'City is required').max(200),
  timezone: z.string().optional().default('UTC'),
  primaryLanguage: z.string().optional().default('en'),
  notes: z.string().max(2000).optional(),
});

export const updatePatientSchema = z.object({
  cognitiveStage: z.nativeEnum(CognitiveStage).optional(),
  preferredName: z.string().min(1).max(100).optional(),
  city: z.string().min(1).max(200).optional(),
  timezone: z.string().optional(),
  primaryLanguage: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

export const createFamilyMemberSchema = z.object({
  patientId: z.string().uuid('Invalid patient UUID'),
  userId: z.string().uuid('Invalid user UUID').optional(),
  displayName: z.string().min(1, 'Display name is required').max(100),
  relationship: z.nativeEnum(Relationship, {
    errorMap: () => ({ message: 'Invalid relationship type' }),
  }),
  photoUrl: z.string().url().optional(),
  voiceMessageUrl: z.string().url().optional(),
  videoMessageUrl: z.string().url().optional(),
  notes: z.string().max(2000).optional(),
});

export const updateFamilyMemberSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  relationship: z.nativeEnum(Relationship).optional(),
  photoUrl: z.string().url().optional(),
  voiceMessageUrl: z.string().url().optional(),
  videoMessageUrl: z.string().url().optional(),
  notes: z.string().max(2000).optional(),
  isActive: z.boolean().optional(),
});

export const createMemorySchema = z.object({
  patientId: z.string().uuid('Invalid patient UUID'),
  type: z.nativeEnum(MemoryType, {
    errorMap: () => ({ message: 'Invalid memory type' }),
  }),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional(),
  mediaUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  transcription: z.string().optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  recordedAt: z.string().datetime().optional(),
});

export const updateMemorySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  transcription: z.string().optional(),
  aiSummary: z.string().optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  isFavorite: z.boolean().optional(),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type CreateFamilyMemberInput = z.infer<typeof createFamilyMemberSchema>;
export type UpdateFamilyMemberInput = z.infer<typeof updateFamilyMemberSchema>;
export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
export type UpdateMemoryInput = z.infer<typeof updateMemorySchema>;
