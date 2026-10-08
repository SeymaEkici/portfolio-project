import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as messageService from '../services/message.service.js';

export const getAllMessages = asyncHandler(async (req: Request, res: Response) => {
  const messages = await messageService.getAllMessages();
  res.status(200).json({ status: 'success', data: { messages } });
});

export const createMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await messageService.createMessage(req.body);
  res.status(201).json({ status: 'success', data: { message } });
});

export const markMessageAsRead = asyncHandler(async (req: Request, res: Response) => {
  const message = await messageService.markAsRead(req.params.id);
  res.status(200).json({ status: 'success', data: { message } });
});

export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  await messageService.deleteMessage(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});