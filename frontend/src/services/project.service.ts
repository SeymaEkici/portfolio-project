import { api } from '@/lib/api';
import { Project } from '@/types';

export async function getProjects(featuredOnly?: boolean): Promise<Project[]> {
  const url = featuredOnly ? '/projects?featured=true' : '/projects';
  const response = await api.get(url);
  return response.data.data.projects;
}

export async function getProjectBySlug(slug: string): Promise<Project> {
  const response = await api.get(`/projects/${slug}`);
  return response.data.data.project;
}

export async function createProject(data: any): Promise<any> {
  const response = await api.post('/projects', data);
  return response.data.data.project;
}