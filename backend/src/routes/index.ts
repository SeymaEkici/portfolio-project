import { Router } from 'express';

const router = Router();

// Health Check Endpoint (Sunucu ayakta mı kontrolü)
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend API sorunsuz çalışıyor.',
    timestamp: new Date().toISOString(),
  });
});

export default router;