export type TechCategory = 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'DEVOPS' | 'OTHER';
export type SkillCategory = 'FRONTEND' | 'BACKEND' | 'TOOLS' | 'SOFT_SKILLS';

export interface Technology {
  id: string;
  name: string;
  iconUrl?: string;
  category: TechCategory;
}

export interface ProjectTechnology {
  projectId: string;
  technologyId: string;
  technology: Technology;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  isFeatured: boolean;
  order: number;
  technologies: ProjectTechnology[];
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: number;
  category: SkillCategory;
  order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}