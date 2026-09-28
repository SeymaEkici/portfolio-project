import { Router } from 'express';
import { loginController, logoutController, getMeController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginSchema } from '../schemas/auth.schema.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', validate(loginSchema), loginController);
router.post('/logout', logoutController);
router.get('/me', protect, getMeController);

export default router;