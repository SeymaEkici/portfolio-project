import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRouter from './routes/index.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { AppError } from './utils/appError.js';

const app: Application = express();

// 1. Global Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true, // HTTP-Only cookie taşıyabilmek için kritik
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 2. Rotalar
app.use('/api', apiRouter);

// 3. Tanımsız Rotaları Yakalama (404 Handler)
app.use((req, res, next) => {
  next(new AppError(`Aradığınız ${req.originalUrl} adresi bu sunucuda bulunamadı.`, 404));
});

// 4. Global Error Handler Middleware
app.use(globalErrorHandler);

export default app;