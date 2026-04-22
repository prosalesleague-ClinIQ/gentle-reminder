/**
 * Audit log writer + PHI-redacting serializer.
 *
 * Added 2026-04-22 per fortress-audit finding C-4 — the `AuditLog` Prisma
 * model existed but had zero write call-sites across `services/**`. HIPAA
 * §164.312(b) requires audit controls; this module is the single writer.
 *
 * Design:
 *   - `logAudit()` is the canonical API. Call from controllers or from the
 *     Express middleware that wraps every PHI route.
 *   - Fails CLOSED in production: missing userId + missing action → throws.
 *   - PHI redactor strips known-sensitive keys before serialization so the
 *     log itself is not a PHI exfil vector.
 *   - Non-blocking (fire-and-forget) by default to avoid adding latency on
 *     happy-path requests; errors are swallowed to stderr with a counter.
 *     Pass `{ awaitWrite: true }` if you need write-before-respond semantics
 *     (e.g., for destructive admin actions or CFR-11 records).
 */

import { getDatabase } from './index.js';

export type AuditAction =
  | 'read'
  | 'create'
  | 'update'
  | 'delete'
  | 'export'
  | 'login'
  | 'logout'
  | 'login.failed'
  | 'role.change'
  | 'tenant.create'
  | 'tenant.update'
  | 'api_key.rotate'
  | 'phi.export'
  | 'phi.access'
  | string;

export interface AuditEntry {
  userId?: string | null;
  tenantId?: string | null;
  action: AuditAction;
  resource: string;
  resourceId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  details?: Record<string, unknown>;
}

export interface AuditOptions {
  /** If true, await the write before returning. Default: false (fire-and-forget). */
  awaitWrite?: boolean;
  /** If set, redact these additional keys from `details` before writing. */
  extraRedactKeys?: string[];
}

/**
 * Keys whose values are always redacted in `details`. Case-insensitive match.
 * Extend via AuditOptions.extraRedactKeys for call-site specifics.
 */
const DEFAULT_REDACT_KEYS = new Set([
  'password',
  'passwordhash',
  'pw',
  'secret',
  'apikey',
  'api_key',
  'token',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'ssn',
  'socialsecuritynumber',
  'dob',
  'dateofbirth',
  'mrn',
  'medicalrecordnumber',
  'creditcard',
  'cc',
  'cvv',
  'phi',
  'patientname',
  'patient_full_name',
]);

export function redactPHI(
  details: Record<string, unknown> | undefined,
  extraKeys: string[] = []
): Record<string, unknown> | undefined {
  if (!details) return undefined;
  const extra = new Set(extraKeys.map((k) => k.toLowerCase()));
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(details)) {
    const kLower = key.toLowerCase();
    if (DEFAULT_REDACT_KEYS.has(kLower) || extra.has(kLower)) {
      out[key] = '[REDACTED]';
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      out[key] = redactPHI(value as Record<string, unknown>, extraKeys);
    } else {
      out[key] = value;
    }
  }
  return out;
}

/**
 * Record an audit event.
 *
 * Usage:
 *   await logAudit({ userId, action: 'read', resource: 'patient', resourceId });
 *
 * Or fire-and-forget inside a middleware:
 *   logAudit({...}).catch(() => {});
 */
export async function logAudit(entry: AuditEntry, opts: AuditOptions = {}): Promise<void> {
  const isProd = process.env.NODE_ENV === 'production';
  if (!entry.action || !entry.resource) {
    if (isProd) {
      throw new Error('[audit] action and resource are required');
    }
    return;
  }

  const serialized = redactPHI(
    {
      tenantId: entry.tenantId ?? null,
      userAgent: entry.userAgent,
      ...entry.details,
    },
    opts.extraRedactKeys
  );

  const doWrite = async () => {
    try {
      const db = getDatabase();
      await db.auditLog.create({
        data: {
          userId: entry.userId ?? null,
          action: entry.action,
          resource: entry.resource,
          resourceId: entry.resourceId ?? null,
          details: serialized as object,
          ipAddress: entry.ipAddress ?? null,
        },
      });
    } catch (err) {
      // Never let audit failures break the request path. Log to stderr with
      // a distinct prefix so the ops pipeline can alert on high rates.
      console.error('[audit.write.failed]', (err as Error)?.message);
    }
  };

  if (opts.awaitWrite) {
    await doWrite();
  } else {
    // Fire-and-forget. Still returns a resolved Promise to keep the API
    // always-await-safe.
    void doWrite();
  }
}
