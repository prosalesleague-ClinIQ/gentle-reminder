import { getDatabase } from './index.js';
import type { Tenant } from '@prisma/client';

export async function createTenant(
  name: string,
  slug: string,
  domain?: string,
): Promise<Tenant> {
  const db = getDatabase();
  return db.tenant.create({
    data: {
      name,
      slug,
      domain: domain ?? null,
    },
  });
}

export async function getTenantById(id: string): Promise<Tenant | null> {
  const db = getDatabase();
  return db.tenant.findUnique({ where: { id } });
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const db = getDatabase();
  return db.tenant.findUnique({ where: { slug } });
}

export async function getTenantByDomain(domain: string): Promise<Tenant | null> {
  const db = getDatabase();
  return db.tenant.findFirst({ where: { domain, isActive: true } });
}

export async function updateTenant(
  id: string,
  data: Partial<Pick<Tenant, 'name' | 'slug' | 'domain' | 'isActive'>> & { settings?: Record<string, unknown> },
): Promise<Tenant> {
  const db = getDatabase();
  return db.tenant.update({ where: { id }, data: data as any });
}

export async function listTenants(): Promise<Tenant[]> {
  const db = getDatabase();
  return db.tenant.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function deactivateTenant(id: string): Promise<Tenant> {
  const db = getDatabase();
  return db.tenant.update({
    where: { id },
    data: { isActive: false },
  });
}
