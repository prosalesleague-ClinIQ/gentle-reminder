import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

export function getDatabase(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
    });
  }
  return prisma;
}

export async function disconnectDatabase(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
  }
}

export { PrismaClient };
export type { Prisma } from '@prisma/client';

// Tenant helpers
export {
  createTenant,
  getTenantById,
  getTenantBySlug,
  getTenantByDomain,
  updateTenant,
  listTenants,
  deactivateTenant,
} from './tenant.js';

// Audit-log writer (fortress-audit C-4, 2026-04-22)
export { logAudit, redactPHI } from './audit.js';
export type { AuditEntry, AuditAction, AuditOptions } from './audit.js';
