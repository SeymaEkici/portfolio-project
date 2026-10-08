import { Router } from 'express';
import authRoutes from './auth.routes.js';
import projectRoutes from './project.routes.js';
import skillRoutes from './skill.routes.js';
import messageRoutes from './message.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend API sorunsuz çalışıyor.',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/skills', skillRoutes);
router.use('/messages', messageRoutes);

export default router;