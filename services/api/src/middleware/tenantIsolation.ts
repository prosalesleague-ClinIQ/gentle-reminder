import { PrismaClient, Prisma } from '@prisma/client';
import { getDatabase } from '@gentle-reminder/database';

/**
 * Models that have a tenantId field and should be scoped.
 * The Tenant model itself is excluded -- it has no tenantId.
 */
const TENANT_SCOPED_MODELS = new Set([
  'User',
  'Patient',
]);

/** Prisma operations that read data */
const READ_OPERATIONS = new Set([
  'findMany',
  'findFirst',
  'findFirstOrThrow',
  'findUnique',
  'findUniqueOrThrow',
  'count',
  'aggregate',
  'groupBy',
]);

/** Prisma operations that create data */
const CREATE_OPERATIONS = new Set([
  'create',
  'createMany',
  'upsert',
]);

/** Prisma operations that mutate existing data */
const MUTATION_OPERATIONS = new Set([
  'update',
  'updateMany',
  'delete',
  'deleteMany',
]);

/**
 * Returns a Prisma client extended with automatic tenant isolation.
 *
 * - Reads: auto-injects WHERE tenantId = tenantId
 * - Creates: auto-sets tenantId on the data payload
 * - Updates/Deletes: adds tenantId to the where clause to prevent cross-tenant mutation
 *
 * When tenantId is null/undefined (single-tenant mode), returns the
 * unmodified Prisma client.
 */
export function getTenantPrisma(tenantId: string | undefined | null) {
  const basePrisma = getDatabase();

  if (!tenantId) {
    return basePrisma;
  }

  return basePrisma.$extends({
    query: {
      $allOperations({ model, operation, args, query }) {
        if (!model || !TENANT_SCOPED_MODELS.has(model)) {
          return query(args);
        }

        // Read operations: inject tenantId into where clause
        if (READ_OPERATIONS.has(operation)) {
          args.where = {
            ...args.where,
            tenantId,
          };
          return query(args);
        }

        // Create operations: set tenantId on the data
        if (CREATE_OPERATIONS.has(operation)) {
          if (operation === 'createMany' && args.data && Array.isArray(args.data)) {
            args.data = (args.data as any[]).map((item: any) => ({
              ...item,
              tenantId,
            }));
          } else if (operation === 'upsert') {
            args.where = { ...args.where, tenantId };
            if (args.create) {
              args.create = { ...args.create, tenantId };
            }
            if (args.update) {
              // update stays as-is, but where already scoped
            }
          } else if (args.data) {
            args.data = { ...args.data, tenantId };
          }
          return query(args);
        }

        // Mutation operations: scope to tenant
        if (MUTATION_OPERATIONS.has(operation)) {
          args.where = {
            ...args.where,
            tenantId,
          };
          return query(args);
        }

        return query(args);
      },
    },
  });
}
