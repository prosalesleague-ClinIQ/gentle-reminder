import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import type { ApiResponse, AuthTokens } from '@gentle-reminder/shared-types';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const tokens = await authService.login(email, password);

    const response: ApiResponse<AuthTokens> = {
      success: true,
      data: tokens,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tokens = await authService.register(req.body);

    const response: ApiResponse<AuthTokens> = {
      success: true,
      data: tokens,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);

    const response: ApiResponse<AuthTokens> = {
      success: true,
      data: tokens,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /auth/logout — revoke a refresh token.
 *
 * Added 2026-04-22 per fortress-audit finding C-8 (no logout endpoint).
 * Stateless JWTs can only be revoked via a server-side denylist; without
 * this endpoint stolen refresh tokens stay valid for 7 days.
 *
 * Best-effort today: calls authService.revokeRefreshToken when implemented,
 * no-ops otherwise. Round-3 wires a Redis-backed denylist with TTL matching
 * refresh expiry.
 */
export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = (req.body ?? {}) as { refreshToken?: string };
    if (refreshToken) {
      const svc = authService as typeof authService & {
        revokeRefreshToken?: (token: string) => Promise<void>;
      };
      if (typeof svc.revokeRefreshToken === 'function') {
        await svc.revokeRefreshToken(refreshToken);
      }
    }
    res.json({ success: true, data: { message: 'Logged out' } } satisfies ApiResponse<{ message: string }>);
  } catch (error) {
    next(error);
  }
}
