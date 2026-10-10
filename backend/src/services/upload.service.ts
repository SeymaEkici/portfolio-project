import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { AppError } from '../utils/appError.js';

// Cloudinary konfigürasyonu
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinaryService = (fileBuffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'portfolio-projects' },
      (error, result) => {
        if (error || !result) {
          return reject(new AppError('Görsel buluta yüklenirken hata oluştu.', 500));
        }
        resolve(result.secure_url); // Buluttaki kalıcı URL'i dönüyoruz
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};