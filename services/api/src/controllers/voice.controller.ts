import { Request, Response, NextFunction } from 'express';
import * as voiceService from '../services/voice.service.js';
import type { ApiResponse } from '@gentle-reminder/shared-types';

export async function listVoiceProfiles(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { patientId } = req.params;
    const profiles = await voiceService.listVoiceProfiles(patientId);

    const response: ApiResponse = {
      success: true,
      data: profiles,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function createVoiceProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profile = await voiceService.createVoiceProfile(req.body);

    const response: ApiResponse = {
      success: true,
      data: profile,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export async function deleteVoiceProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await voiceService.deleteVoiceProfile(req.params.id);

    const response: ApiResponse = {
      success: true,
    };

    res.status(204).json(response);
  } catch (error) {
    next(error);
  }
}

export async function generateSpeech(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { text } = req.body;
    const result = await voiceService.generateSpeech(text, req.params.id);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
