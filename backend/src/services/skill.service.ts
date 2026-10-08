import { prisma } from '../config/db.js';

export const getAllSkills = async () => {
  return prisma.skill.findMany({ orderBy: { order: 'asc' } });
};

export const createSkill = async (data: any) => {
  return prisma.skill.create({ data });
};

export const updateSkill = async (id: string, data: any) => {
  return prisma.skill.update({ where: { id }, data });
};

export const deleteSkill = async (id: string) => {
  return prisma.skill.delete({ where: { id } });
};