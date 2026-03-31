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
