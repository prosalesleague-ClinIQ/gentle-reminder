import { z } from 'zod';
import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';

export const createSessionSchema = z.object({
  patientId: z.string().uuid('Invalid patient UUID'),
});

export const completeSessionSchema = z.object({
  notes: z.string().max(2000).optional(),
});

export const sessionHistoryQuery = z.object({
  patientId: z.string().uuid('Invalid patient UUID'),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().min(1).default(1)),
  pageSize: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().int().min(1).max(100).default(20)),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const createExerciseResultSchema = z.object({
  sessionId: z.string().uuid('Invalid session UUID'),
  exerciseType: z.nativeEnum(ExerciseType, {
    errorMap: () => ({ message: 'Invalid exercise type' }),
  }),
  domain: z.nativeEnum(CognitiveDomain, {
    errorMap: () => ({ message: 'Invalid cognitive domain' }),
  }),
  prompt: z.string().min(1, 'Prompt is required'),
  expectedAnswer: z.string().min(1, 'Expected answer is required'),
  givenAnswer: z.string(),
  isCorrect: z.boolean(),
  responseTimeMs: z.number().int().min(0),
  feedbackType: z.nativeEnum(FeedbackType, {
    errorMap: () => ({ message: 'Invalid feedback type' }),
  }),
  score: z.number().min(0).max(100),
  attemptNumber: z.number().int().min(1).optional().default(1),
});

export const analyticsQuery = z.object({
  patientId: z.string().uuid('Invalid patient UUID'),
  period: z.enum(['7d', '30d', '90d', '6m', '1y']).optional().default('30d'),
});

export const engagementQuery = z.object({
  patientId: z.string().uuid('Invalid patient UUID'),
  period: z.enum(['7d', '30d', '90d', '6m', '1y']).optional().default('30d'),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type CompleteSessionInput = z.infer<typeof completeSessionSchema>;
export type SessionHistoryQuery = z.infer<typeof sessionHistoryQuery>;
export type CreateExerciseResultInput = z.infer<typeof createExerciseResultSchema>;
export type AnalyticsQuery = z.infer<typeof analyticsQuery>;
export type EngagementQuery = z.infer<typeof engagementQuery>;
