import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';

export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Sunucu tarafında bilinmeyen bir hata oluştu.';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  // Development ortamında detaylı hatayı logluyoruz
  if (process.env.NODE_ENV !== 'production') {
    console.error('💥 HATA DETAYI:', err);
  }

  res.status(statusCode).json({
    status: statusCode >= 400 && statusCode < 500 ? 'fail' : 'error',
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};