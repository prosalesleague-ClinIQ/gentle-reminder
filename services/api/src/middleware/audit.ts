import { Request, Response, NextFunction } from 'express';
import { logAudit } from '@gentle-reminder/database';

/**
 * Audit-logging middleware for PHI routes.
 *
 * Installed 2026-04-22 per fortress-audit finding C-4 (AuditLog model exists
 * but has zero writers across services/**). HIPAA §164.312(b) requires audit
 * controls; this middleware fulfils the per-route access-recording portion.
 *
 * Mount on route groups that touch PHI (patients, memories, biomarkers,
 * incidents, etc.). Fire-and-forget write — never blocks the response path.
 *
 * Usage:
 *   import { auditPhiAccess } from '../middleware/audit.js';
 *   router.use('/patients', auditPhiAccess('patient'));
 */
export function auditPhiAccess(resource: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Compute action from method.
    const action =
      req.method === 'GET' || req.method === 'HEAD'
        ? 'read'
        : req.method === 'POST'
        ? 'create'
        : req.method === 'PUT' || req.method === 'PATCH'
        ? 'update'
        : req.method === 'DELETE'
        ? 'delete'
        : req.method.toLowerCase();

    // Extract resourceId from the first path segment after the resource (if any).
    // e.g. /api/v1/patients/:id → resourceId = :id
    const pathParts = req.originalUrl.split('?')[0].split('/').filter(Boolean);
    const resourceIndex = pathParts.findIndex((p) =>
      resource === p || `${resource}s` === p || resource === p.replace(/s$/, '')
    );
    const resourceId =
      resourceIndex >= 0 && pathParts[resourceIndex + 1]
        ? pathParts[resourceIndex + 1]
        : null;

    // Capture request metadata (no body — bodies may contain PHI and the
    // logAudit redactor only runs on `details`).
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      null;
    const userAgent = req.headers['user-agent'] ?? null;

    // Wait for the response to complete to record final status.
    res.on('finish', () => {
      // Only record successful access (2xx). Log failed/forbidden separately
      // via a dedicated logAudit call at the 401/403 handler.
      if (res.statusCode >= 200 && res.statusCode < 300) {
        void logAudit({
          userId: req.user?.userId ?? null,
          tenantId: (req.user as { tenantId?: string | null } | undefined)?.tenantId ?? null,
          action,
          resource,
          resourceId,
          ipAddress,
          userAgent: typeof userAgent === 'string' ? userAgent : null,
          details: { status: res.statusCode, method: req.method },
        });
      }
    });

    next();
  };
}

/**
 * Audit helper for admin/privileged actions (role change, tenant CRUD,
 * api-key rotation, phi.export). Awaits the write so the event is durable
 * before the response is sent.
 */
export async function auditAdminAction(
  req: Request,
  action: string,
  resource: string,
  resourceId?: string | null,
  details?: Record<string, unknown>,
): Promise<void> {
  const ipAddress =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || null;
  const userAgent = req.headers['user-agent'];
  await logAudit(
    {
      userId: req.user?.userId ?? null,
      tenantId: (req.user as { tenantId?: string | null } | undefined)?.tenantId ?? null,
      action,
      resource,
      resourceId: resourceId ?? null,
      ipAddress,
      userAgent: typeof userAgent === 'string' ? userAgent : null,
      details,
    },
    { awaitWrite: true },
  );
}
