import { Request, Response, NextFunction } from 'express';
import * as patientService from '../services/patient.service.js';
import type { ApiResponse } from '@gentle-reminder/shared-types';

export async function createPatient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const patient = await patientService.createPatient(req.body);

    const response: ApiResponse = {
      success: true,
      data: patient,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export async function getPatient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const patient = await patientService.getPatientById(req.params.id);

    const response: ApiResponse = {
      success: true,
      data: patient,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function getPatientProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profile = await patientService.getPatientProfile(req.params.id);

    const response: ApiResponse = {
      success: true,
      data: profile,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function updatePatient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const patient = await patientService.updatePatient(req.params.id, req.body);

    const response: ApiResponse = {
      success: true,
      data: patient,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function deletePatient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await patientService.deletePatient(req.params.id);

    const response: ApiResponse = {
      success: true,
    };

    res.status(204).json(response);
  } catch (error) {
    next(error);
  }
}

export async function listPatients(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const result = await patientService.listPatients(page, pageSize);

    const response: ApiResponse = {
      success: true,
      data: result.patients,
      meta: result.meta,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
