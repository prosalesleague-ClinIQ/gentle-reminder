import { Request, Response, NextFunction } from 'express';
import * as sessionService from '../services/session.service.js';
import type { ApiResponse } from '@gentle-reminder/shared-types';

export async function startSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { patientId } = req.body;
    const session = await sessionService.startSession(patientId);

    const response: ApiResponse = {
      success: true,
      data: session,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export async function completeSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = await sessionService.completeSession(req.params.id, req.body.notes);

    const response: ApiResponse = {
      success: true,
      data: session,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function getSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = await sessionService.getSessionById(req.params.id);

    const response: ApiResponse = {
      success: true,
      data: session,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function getSessionHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      patientId,
      page = 1,
      pageSize = 20,
      startDate,
      endDate,
    } = req.query as any;

    const result = await sessionService.getSessionHistory(
      patientId,
      parseInt(page) || 1,
      parseInt(pageSize) || 20,
      startDate,
      endDate,
    );

    const response: ApiResponse = {
      success: true,
      data: result.sessions,
      meta: result.meta,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
