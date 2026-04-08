import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@gentle-reminder/auth';
import type { AuthenticatedUser } from '@gentle-reminder/auth';
import { env } from '../config/env.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser & { tenantId?: string };
      tenantId?: string;
    }
  }
}

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
    const payload = verifyAccessToken(token, env.jwtSecret);
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      tenantId: (payload as any).tenantId,
    };
    // Propagate tenantId from JWT to request for tenant resolver fallback
    if ((payload as any).tenantId) {
      req.tenantId = (payload as any).tenantId;
    }
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

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const payload = verifyAccessToken(token, env.jwtSecret);
      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        tenantId: (payload as any).tenantId,
      };
      if ((payload as any).tenantId) {
        req.tenantId = (payload as any).tenantId;
      }
    } catch {
      // Token invalid, continue without user
    }
  }

  next();
}
