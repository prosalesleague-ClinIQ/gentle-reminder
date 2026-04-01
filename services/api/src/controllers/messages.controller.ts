import { Request, Response, NextFunction } from 'express';
import * as messageService from '../services/message.service.js';
import type { ApiResponse } from '@gentle-reminder/shared-types';

export async function getConversations(req: Request, res: Response<ApiResponse>, next: NextFunction) {
  try {
    const { userId } = req.params;
    const conversations = await messageService.getConversations(userId);
    res.json({ success: true, data: conversations });
  } catch (error) { next(error); }
}

export async function getThreadMessages(req: Request, res: Response<ApiResponse>, next: NextFunction) {
  try {
    const { threadId } = req.params;
    const thread = await messageService.getThreadMessages(threadId);
    res.json({ success: true, data: thread });
  } catch (error) { next(error); }
}

export async function sendMessage(req: Request, res: Response<ApiResponse>, next: NextFunction) {
  try {
    const message = await messageService.sendMessage(req.body);
    res.status(201).json({ success: true, data: message });
  } catch (error) { next(error); }
}
