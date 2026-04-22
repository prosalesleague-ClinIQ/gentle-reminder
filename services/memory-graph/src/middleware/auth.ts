import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@gentle-reminder/auth';
import type { AuthenticatedUser } from '@gentle-reminder/auth';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Fail-fast env validation for JWT_SECRET (fortress-audit C-3, 2026-04-22).
 * Previous revision silently fell back to 'dev-secret-change-me', allowing
 * forged admin tokens in any misconfigured prod environment.
 */
const FORBIDDEN_SECRETS = new Set([
  'dev-jwt-secret',
  'dev-jwt-refresh-secret',
  'dev-secret-change-me',
  'CHANGE_ME',
  'CHANGE_ME_TO_A_SECURE_RANDOM_STRING',
  'password',
  'secret',
  'changeme',
]);

function resolveJwtSecret(): string {
  const raw = process.env.JWT_SECRET;
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isProd = nodeEnv === 'production';
  const isTest = nodeEnv === 'test';

  if (isTest) {
    return raw || 'test-jwt-secret-ci';
  }

  if (!raw) {
    if (isProd) {
      throw new Error('[memory-graph] JWT_SECRET is required in production. Refusing to boot.');
    }
    // Dev: random ephemeral secret per-process so we never silently accept
    // tokens signed with a well-known string.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('crypto').randomBytes(48).toString('base64');
  }

  if (FORBIDDEN_SECRETS.has(raw)) {
    throw new Error('[memory-graph] JWT_SECRET matches a well-known default/placeholder. Regenerate.');
  }

  if (isProd && raw.length < 32) {
    throw new Error('[memory-graph] JWT_SECRET must be ≥32 bytes in production.');
  }

  return raw;
}

const JWT_SECRET = resolveJwtSecret();

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing or invalid authorization header',
      },
    });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const payload = verifyAccessToken(token, JWT_SECRET);
    // In production, reject tokens without tenantId unless role is system_admin.
    // This closes fortress-audit C-1 (cross-tenant PHI retrieval).
    if (
      process.env.NODE_ENV === 'production' &&
      !payload.tenantId &&
      payload.role !== 'system_admin'
    ) {
      res.status(403).json({
        success: false,
        error: {
          code: 'TENANT_SCOPE_REQUIRED',
          message: 'Access token is missing required tenant scope',
        },
      });
      return;
    }
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId ?? null,
      facilityId: payload.facilityId ?? null,
    };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Access token is invalid or expired',
      },
    });
  }
}

/**
 * Optional auth — attaches user if valid token present, continues regardless.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const payload = verifyAccessToken(token, JWT_SECRET);
      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };
    } catch {
      // Token invalid, continue without user
    }
  }

  next();
}

/**
 * Requires a specific role or higher.
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
      return;
    }

    next();
  };
}
