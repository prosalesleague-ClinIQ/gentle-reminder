import { Request, Response, NextFunction } from 'express';
import { getTenantById, getTenantBySlug, getTenantByDomain } from '@gentle-reminder/database';

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
    }
  }
}

const MULTI_TENANT_ENABLED = process.env.MULTI_TENANT_ENABLED === 'true';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'gentlereminder.health';

/**
 * Resolves the current tenant from three sources in priority order:
 * 1. X-Tenant-ID header (explicit override, e.g. for admin tools)
 * 2. Subdomain extraction (e.g. mayo-clinic.gentlereminder.health)
 * 3. JWT tenantId claim (set during authentication)
 *
 * When MULTI_TENANT_ENABLED is not 'true', this middleware is a no-op
 * and all requests proceed in single-tenant mode.
 */
export async function tenantResolver(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!MULTI_TENANT_ENABLED) {
    return next();
  }

  try {
    // Priority 1: Explicit header
    const headerTenantId = req.headers['x-tenant-id'] as string | undefined;
    if (headerTenantId) {
      const tenant = await getTenantById(headerTenantId);
      if (tenant && tenant.isActive) {
        req.tenantId = tenant.id;
        return next();
      }
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TENANT',
          message: 'Tenant specified in X-Tenant-ID header is invalid or inactive',
        },
      });
      return;
    }

    // Priority 2: Subdomain extraction
    const host = req.hostname || req.headers.host || '';
    const subdomain = extractSubdomain(host, BASE_DOMAIN);
    if (subdomain) {
      const tenant = await getTenantBySlug(subdomain);
      if (tenant && tenant.isActive) {
        req.tenantId = tenant.id;
        return next();
      }
      // Also try domain lookup
      const tenantByDomain = await getTenantByDomain(host);
      if (tenantByDomain) {
        req.tenantId = tenantByDomain.id;
        return next();
      }
    }

    // Priority 3: JWT tenantId claim (set by auth middleware)
    if (req.user && (req.user as any).tenantId) {
      req.tenantId = (req.user as any).tenantId;
      return next();
    }

    // No tenant resolved -- allow request to proceed without tenant context.
    // Individual routes/services can decide whether tenantId is required.
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Extracts the subdomain from a hostname relative to the base domain.
 * e.g. "mayo-clinic.gentlereminder.health" with base "gentlereminder.health"
 * returns "mayo-clinic".
 */
function extractSubdomain(host: string, baseDomain: string): string | null {
  // Strip port if present
  const hostname = host.split(':')[0];

  if (!hostname.endsWith(baseDomain)) {
    return null;
  }

  const prefix = hostname.slice(0, -(baseDomain.length + 1)); // +1 for the dot
  if (!prefix || prefix.includes('.')) {
    return null; // No subdomain or nested subdomain
  }

  return prefix;
}
