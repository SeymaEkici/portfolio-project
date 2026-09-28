import { Router } from 'express';
import authRoutes from './auth.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend API sorunsuz çalışıyor.',
    timestamp: new Date().toISOString(),
  });
});

// Auth modülü rotaları
router.use('/auth', authRoutes);

export default router;