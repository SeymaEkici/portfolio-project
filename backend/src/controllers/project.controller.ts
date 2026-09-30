import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as projectService from '../services/project.service.js';

export const getAllProjects = asyncHandler(async (req: Request, res: Response) => {
  // ?featured=true query parametresini kontrol et
  const isFeatured = req.query.featured === 'true' ? true : undefined;
  
  const projects = await projectService.getAllProjectsService(isFeatured);
  
  res.status(200).json({ status: 'success', data: { projects } });
});

export const getProjectBySlug = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.getProjectBySlugService(req.params.slug as string);
  res.status(200).json({ status: 'success', data: { project } });
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.createProjectService(req.body);
  res.status(201).json({ status: 'success', data: { project } }); // 201 Created
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.updateProjectService(req.params.id as string, req.body);
  res.status(200).json({ status: 'success', data: { project } });
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  await projectService.deleteProjectService(req.params.id as string);
  res.status(204).json({ status: 'null', data: null }); // 204 No Content
});