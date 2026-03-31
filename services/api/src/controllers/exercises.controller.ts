import { Request, Response, NextFunction } from 'express';
import * as exerciseService from '../services/exercise.service.js';
import type { ApiResponse } from '@gentle-reminder/shared-types';

export async function recordResult(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await exerciseService.recordExerciseResult(req.body);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export async function getExerciseTypes(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const types = exerciseService.getExerciseTypes();

    const response: ApiResponse = {
      success: true,
      data: types,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
