import { Request, Response, NextFunction } from 'express';
import * as familyService from '../services/family.service.js';
import type { ApiResponse } from '@gentle-reminder/shared-types';

export async function createFamilyMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const member = await familyService.createFamilyMember(req.body);

    const response: ApiResponse = {
      success: true,
      data: member,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export async function getFamilyMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const member = await familyService.getFamilyMemberById(req.params.id);

    const response: ApiResponse = {
      success: true,
      data: member,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function listFamilyMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const members = await familyService.listFamilyMembers(req.params.patientId);

    const response: ApiResponse = {
      success: true,
      data: members,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function updateFamilyMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const member = await familyService.updateFamilyMember(req.params.id, req.body);

    const response: ApiResponse = {
      success: true,
      data: member,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function deleteFamilyMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await familyService.deleteFamilyMember(req.params.id);

    const response: ApiResponse = {
      success: true,
    };

    res.status(204).json(response);
  } catch (error) {
    next(error);
  }
}
