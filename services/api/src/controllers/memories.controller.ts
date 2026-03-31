import { Request, Response, NextFunction } from 'express';
import * as memoryService from '../services/memory.service.js';
import type { ApiResponse } from '@gentle-reminder/shared-types';

export async function createMemory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const memory = await memoryService.createMemory(req.body);

    const response: ApiResponse = {
      success: true,
      data: memory,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export async function getMemory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const memory = await memoryService.getMemoryById(req.params.id);

    const response: ApiResponse = {
      success: true,
      data: memory,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function listMemories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { patientId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const result = await memoryService.listMemories(patientId, page, pageSize);

    const response: ApiResponse = {
      success: true,
      data: result.memories,
      meta: result.meta,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function updateMemory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const memory = await memoryService.updateMemory(req.params.id, req.body);

    const response: ApiResponse = {
      success: true,
      data: memory,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function deleteMemory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await memoryService.deleteMemory(req.params.id);

    const response: ApiResponse = {
      success: true,
    };

    res.status(204).json(response);
  } catch (error) {
    next(error);
  }
}
