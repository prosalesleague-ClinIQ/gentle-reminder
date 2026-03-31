import { z } from 'zod';

export const uuidParam = z.object({
  id: z.string().uuid('Invalid UUID format'),
});

export const paginationQuery = z.object({
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
});

export const patientIdParam = z.object({
  patientId: z.string().uuid('Invalid patient UUID format'),
});

export const dateRangeQuery = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type UuidParam = z.infer<typeof uuidParam>;
export type PaginationQuery = z.infer<typeof paginationQuery>;
export type PatientIdParam = z.infer<typeof patientIdParam>;
