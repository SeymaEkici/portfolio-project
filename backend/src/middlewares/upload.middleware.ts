import multer from 'multer';
import { Request } from 'express';
import { AppError } from '../utils/appError.js';

// Dosyaları geçici olarak RAM'de (memoryStorage) tutuyoruz, disk yerine doğrudan Cloudinary'e stream edeceğiz
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Yalnızca .jpeg, .png, .jpg veya .webp formatında görseller yüklenebilir.', 400));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maksimum 5 MB
  },
});