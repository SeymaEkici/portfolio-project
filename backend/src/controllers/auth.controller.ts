import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loginAdminService } from '../services/auth.service.js';

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await loginAdminService(req.body);

  // Token'ı httpOnly Cookie olarak tarayıcıya yazıyoruz
  res.cookie('jwt', token, {
    httpOnly: true, // JS erişimini engeller (XSS koruması)
    secure: process.env.NODE_ENV === 'production', // Production ortamında HTTPS zorunluluğu
    sameSite: 'lax', // CSRF koruması
    maxAge: 24 * 60 * 60 * 1000, // 1 gün (milisaniye cinsinden)
  });

  res.status(200).json({
    status: 'success',
    message: 'Giriş başarılı.',
    data: { user },
  });
});

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
  // Cookie'yi sıfırlayarak oturumu kapatıyoruz
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    status: 'success',
    message: 'Çıkış yapıldı.',
  });
});

export const getMeController = asyncHandler(async (req: Request, res: Response) => {
  // Auth middleware'den gelen req.user verisi
  res.status(200).json({
    status: 'success',
    data: { user: (req as any).user },
  });
});