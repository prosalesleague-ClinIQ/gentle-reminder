import { Request, Response, NextFunction } from 'express';
import * as caregiverService from '../services/caregiver.service.js';
import type { ApiResponse } from '@gentle-reminder/shared-types';

export async function getCaregiver(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const caregiver = await caregiverService.getCaregiverById(req.params.id);

    const response: ApiResponse = {
      success: true,
      data: caregiver,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function listCaregivers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const result = await caregiverService.listCaregivers(page, pageSize);

    const response: ApiResponse = {
      success: true,
      data: result.caregivers,
      meta: result.meta,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function assignCaregiver(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { caregiverId, patientId } = req.body;
    const assignment = await caregiverService.assignCaregiver(caregiverId, patientId);

    const response: ApiResponse = {
      success: true,
      data: assignment,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export async function unassignCaregiver(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { caregiverId, patientId } = req.body;
    await caregiverService.unassignCaregiver(caregiverId, patientId);

    const response: ApiResponse = {
      success: true,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
