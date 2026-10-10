import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinaryService } from '../services/upload.service.js';
import { AppError } from '../utils/appError.js';

export const uploadImageController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('Yüklenecek bir dosya seçilmedi.', 400);
  }

  const imageUrl = await uploadToCloudinaryService(req.file.buffer);

  res.status(200).json({
    status: 'success',
    message: 'Görsel başarıyla yüklendi.',
    data: { imageUrl },
  });
});