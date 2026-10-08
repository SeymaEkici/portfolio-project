import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as skillService from '../services/skill.service.js';

export const getAllSkills = asyncHandler(async (req: Request, res: Response) => {
  const skills = await skillService.getAllSkills();
  res.status(200).json({ status: 'success', data: { skills } });
});

export const createSkill = asyncHandler(async (req: Request, res: Response) => {
  const skill = await skillService.createSkill(req.body);
  res.status(201).json({ status: 'success', data: { skill } });
});

export const updateSkill = asyncHandler(async (req: Request, res: Response) => {
  const skill = await skillService.updateSkill(req.params.id as string, req.body);
  res.status(200).json({ status: 'success', data: { skill } });
});

export const deleteSkill = asyncHandler(async (req: Request, res: Response) => {
  await skillService.deleteSkill(req.params.id as string);
  res.status(204).json({ status: 'success', data: null });
});