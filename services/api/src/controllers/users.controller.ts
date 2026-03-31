import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service.js';
import type { ApiResponse } from '@gentle-reminder/shared-types';

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.getUserById(req.params.id);

    const response: ApiResponse = {
      success: true,
      data: user,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.updateUser(req.params.id, req.body);

    const response: ApiResponse = {
      success: true,
      data: user,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
