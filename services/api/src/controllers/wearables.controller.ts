import { Request, Response, NextFunction } from 'express';
import * as wearableService from '../services/wearable.service.js';
import type { ApiResponse } from '@gentle-reminder/shared-types';

export async function ingestBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { signals } = req.body;

    if (!Array.isArray(signals)) {
      res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'signals must be an array' },
      });
      return;
    }

    const result = await wearableService.ingestBatch(signals);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    res.status(202).json(response);
  } catch (error) {
    next(error);
  }
}

export async function ingestHeartRate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const signal = await wearableService.ingestHeartRate(req.body);

    const response: ApiResponse = {
      success: true,
      data: signal,
    };

    res.status(202).json(response);
  } catch (error) {
    next(error);
  }
}

export async function ingestMovement(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const signal = await wearableService.ingestMovement(req.body);

    const response: ApiResponse = {
      success: true,
      data: signal,
    };

    res.status(202).json(response);
  } catch (error) {
    next(error);
  }
}

export async function ingestSleep(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const signal = await wearableService.ingestSleep(req.body);

    const response: ApiResponse = {
      success: true,
      data: signal,
    };

    res.status(202).json(response);
  } catch (error) {
    next(error);
  }
}

export async function getDailySummary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { patientId } = req.params;
    const date = req.query.date as string | undefined;

    const summary = await wearableService.getDailySummary(patientId, date);

    const response: ApiResponse = {
      success: true,
      data: summary,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
