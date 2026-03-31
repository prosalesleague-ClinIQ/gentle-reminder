import { Request, Response, NextFunction } from 'express';
import * as analyticsService from '../services/analytics.service.js';
import type { ApiResponse } from '@gentle-reminder/shared-types';

export async function getCognitiveTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { patientId, period = '30d' } = req.query as any;

    const trends = await analyticsService.getCognitiveTrends(patientId, period);

    const response: ApiResponse = {
      success: true,
      data: trends,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function getEngagement(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { patientId, period = '30d' } = req.query as any;

    const engagement = await analyticsService.getEngagement(patientId, period);

    const response: ApiResponse = {
      success: true,
      data: engagement,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
