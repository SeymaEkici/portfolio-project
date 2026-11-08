import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRouter from './routes/index.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { AppError } from './utils/appError.js';

const app: Application = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL || 'https://portfolio-project-delta-navy.vercel.app'
];

// 1. Global Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Tarayıcı dışı (Postman vb.) istekler veya listedeki origin'lere izin ver
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS politikası tarafından engellendi'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
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