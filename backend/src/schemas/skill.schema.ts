import { z } from 'zod';
import { SkillCategory } from '@prisma/client';

export const createSkillSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Yetenek adı zorunludur.' }),
    level: z.number().min(1).max(100).default(50),
    category: z.nativeEnum(SkillCategory, { required_error: 'Geçerli bir kategori seçiniz.' }),
    iconUrl: z.string().url().optional().or(z.literal('')),
    order: z.number().int().default(0),
  }),
});

export const updateSkillSchema = z.object({
  body: createSkillSchema.shape.body.partial(),
  params: z.object({ id: z.string().uuid('Geçersiz ID.') }),
});