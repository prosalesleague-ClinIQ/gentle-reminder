import { getDatabase } from '@gentle-reminder/database';
import {
  createTenant as dbCreateTenant,
  getTenantById as dbGetTenantById,
  getTenantBySlug as dbGetTenantBySlug,
  listTenants as dbListTenants,
  updateTenant as dbUpdateTenant,
  deactivateTenant as dbDeactivateTenant,
} from '@gentle-reminder/database';
import type { Tenant } from '@prisma/client';

/**
 * Provisions a new tenant with a default system_admin user.
 */
export async function provisionTenant(
  name: string,
  slug: string,
  domain?: string,
): Promise<{ tenant: Tenant; adminUser: { id: string; email: string } }> {
  const db = getDatabase();

  // Validate slug uniqueness
  const existing = await dbGetTenantBySlug(slug);
  if (existing) {
    throw new Error(`Tenant with slug "${slug}" already exists`);
  }

  const tenant = await dbCreateTenant(name, slug, domain);

  // Create a default admin user for the tenant
  const adminEmail = `admin@${slug}.gentlereminder.health`;
  const adminUser = await db.user.create({
    data: {
      email: adminEmail,
      passwordHash: '', // Must be set via password reset flow
      firstName: 'Tenant',
      lastName: 'Admin',
      role: 'facility_admin',
      tenantId: tenant.id,
    },
  });

  return {
    tenant,
    adminUser: { id: adminUser.id, email: adminUser.email },
  };
}

/**
 * Returns usage statistics for a tenant.
 */
export async function getTenantUsage(tenantId: string): Promise<{
  patientCount: number;
  sessionCount: number;
  userCount: number;
  storageEstimateMb: number;
}> {
  const db = getDatabase();

  const [patientCount, sessionCount, userCount] = await Promise.all([
    db.patient.count({ where: { tenantId } }),
    db.session.count({
      where: {
        patient: { tenantId },
      },
    }),
    db.user.count({ where: { tenantId } }),
  ]);

  // Rough storage estimate based on record counts
  const storageEstimateMb = Math.round(
    (patientCount * 0.5 + sessionCount * 0.1 + userCount * 0.05) * 100,
  ) / 100;

  return { patientCount, sessionCount, userCount, storageEstimateMb };
}

/**
 * Lists patients belonging to a tenant with pagination.
 */
export async function listTenantPatients(
  tenantId: string,
  pagination: { page: number; limit: number } = { page: 1, limit: 20 },
): Promise<{
  patients: any[];
  total: number;
  page: number;
  limit: number;
}> {
  const db = getDatabase();
  const skip = (pagination.page - 1) * pagination.limit;

  const [patients, total] = await Promise.all([
    db.patient.findMany({
      where: { tenantId },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
      skip,
      take: pagination.limit,
      orderBy: { createdAt: 'desc' },
    }),
    db.patient.count({ where: { tenantId } }),
  ]);

  return {
    patients,
    total,
    page: pagination.page,
    limit: pagination.limit,
  };
}

// Re-export database-level helpers for convenience
export {
  dbGetTenantById as getTenantById,
  dbGetTenantBySlug as getTenantBySlug,
  dbListTenants as listTenants,
  dbUpdateTenant as updateTenant,
  dbDeactivateTenant as deactivateTenant,
};
