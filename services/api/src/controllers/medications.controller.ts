import { Request, Response, NextFunction } from 'express';
import * as medicationService from '../services/medication.service.js';
import type { ApiResponse } from '@gentle-reminder/shared-types';

export async function getMedications(req: Request, res: Response<ApiResponse>, next: NextFunction) {
  try {
    const { patientId } = req.params;
    const medications = await medicationService.getMedications(patientId);
    res.json({ success: true, data: medications });
  } catch (error) { next(error); }
}

export async function createMedication(req: Request, res: Response<ApiResponse>, next: NextFunction) {
  try {
    const medication = await medicationService.createMedication(req.body);
    res.status(201).json({ success: true, data: medication });
  } catch (error) { next(error); }
}

export async function logAdministration(req: Request, res: Response<ApiResponse>, next: NextFunction) {
  try {
    const log = await medicationService.logAdministration(req.body);
    res.status(201).json({ success: true, data: log });
  } catch (error) { next(error); }
}

export async function getTodaySchedule(req: Request, res: Response<ApiResponse>, next: NextFunction) {
  try {
    const { patientId } = req.params;
    const schedule = await medicationService.getTodaySchedule(patientId);
    res.json({ success: true, data: schedule });
  } catch (error) { next(error); }
}

export async function getAdherenceRate(req: Request, res: Response<ApiResponse>, next: NextFunction) {
  try {
    const { patientId } = req.params;
    const days = parseInt(req.query.days as string) || 30;
    const adherence = await medicationService.getAdherenceRate(patientId, days);
    res.json({ success: true, data: adherence });
  } catch (error) { next(error); }
}
