import { prisma } from '../config/db.js';
import { AppError } from '../utils/appError.js';

export const getAllMessages = async () => {
  return prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
};

export const createMessage = async (data: any) => {
  return prisma.contactMessage.create({ data });
};

export const markAsRead = async (id: string) => {
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) throw new AppError('Mesaj bulunamadı.', 404);

  return prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  });
};

export const deleteMessage = async (id: string) => {
  return prisma.contactMessage.delete({ where: { id } });
};