import { Router } from 'express';
import { uploadImageController } from '../controllers/upload.controller.js';
import { upload } from '../middlewares/upload.middleware.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = Router();

// Sadece Admin kullanıcılar görsel yükleyebilir
router.post('/', protect, restrictTo('ADMIN'), upload.single('image'), uploadImageController);

export default router;