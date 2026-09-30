import { z } from 'zod';

const projectCore = {
  title: z.string().min(1, 'Başlık zorunludur.'),
  slug: z.string().min(1, 'Slug zorunludur.'),
  description: z.string().min(1, 'Açıklama zorunludur.'),
  content: z.string().optional(),
  imageUrl: z.string().url('Geçerli bir URL giriniz.').optional().or(z.literal('')),
  githubUrl: z.string().url('Geçerli bir URL giriniz.').optional().or(z.literal('')),
  liveUrl: z.string().url('Geçerli bir URL giriniz.').optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  order: z.number().int().default(0),
  technologyIds: z.array(z.string().uuid('Geçersiz teknoloji ID formatı.')).optional(),
};

export const createProjectSchema = z.object({
  body: z.object(projectCore),
});

// Update işleminde tüm alanlar opsiyonel (partial) olur
export const updateProjectSchema = z.object({
  body: z.object(projectCore).partial(),
  params: z.object({
    id: z.string().uuid('Geçersiz proje ID.'),
  }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>['body'];
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>['body'];