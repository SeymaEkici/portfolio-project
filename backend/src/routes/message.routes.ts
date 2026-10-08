import { Router } from 'express';
import * as messageController from '../controllers/message.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createMessageSchema } from '../schemas/message.schema.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = Router();

// Herkes site üzerinden mesaj gönderebilir
router.post('/', validate(createMessageSchema), messageController.createMessage);

// Sadece Admin mesajları görebilir ve silebilir
router.use(protect, restrictTo('ADMIN'));
router.get('/', messageController.getAllMessages);
router.patch('/:id/read', messageController.markMessageAsRead);
router.delete('/:id', messageController.deleteMessage);

export default router;