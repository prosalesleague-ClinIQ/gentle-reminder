import { Request, Response, NextFunction } from 'express';
import * as surveillance from '../services/postMarketSurveillance.js';
import type { ApiResponse } from '@gentle-reminder/shared-types';

export async function getSafetyReport(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const periodDays = req.query.periodDays ? Number(req.query.periodDays) : 90;
    const report = surveillance.generateSafetyReport(periodDays);

    const response: ApiResponse = {
      success: true,
      data: report,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function trackAccuracy(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const record = surveillance.trackAlgorithmAccuracy(req.body);

    const response: ApiResponse = {
      success: true,
      data: record,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export async function reportComplaint(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const complaint = surveillance.reportComplaint(req.body);

    const response: ApiResponse = {
      success: true,
      data: complaint,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export async function getDriftAnalysis(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const windowDays = req.query.windowDays ? Number(req.query.windowDays) : 30;
    const threshold = req.query.threshold ? Number(req.query.threshold) : 0.15;
    const analysis = surveillance.detectAlgorithmDrift(windowDays, threshold);

    const response: ApiResponse = {
      success: true,
      data: analysis,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
