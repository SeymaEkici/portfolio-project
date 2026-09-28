import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';
import { verifyToken } from '../utils/jwt.js';
import { prisma } from '../config/db.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // 1. Token cookie'den mi geliyor kontrol et
    let token = req.cookies?.jwt;

    if (!token) {
      return next(new AppError('Bu işlem için giriş yapmalısınız.', 401));
    }

    // 2. Token doğrulama
    const decoded = verifyToken(token);

    // 3. Kullanıcının hala veritabanında var olduğunu kontrol et
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      return next(new AppError('Bu tokena ait kullanıcı artık mevcut değil.', 401));
    }

    // 4. İsteğe kullanıcıyı ekle
    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Geçersiz veya süresi dolmuş token.', 401));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Bu eylemi gerçekleştirmek için yetkiniz yok.', 403));
    }
    next();
  };
};