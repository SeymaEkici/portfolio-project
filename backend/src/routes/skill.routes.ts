import { Router } from 'express';
import * as skillController from '../controllers/skill.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createSkillSchema, updateSkillSchema } from '../schemas/skill.schema.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', skillController.getAllSkills); // Herkese açık

// Admin Rotası
router.use(protect, restrictTo('ADMIN'));
router.post('/', validate(createSkillSchema), skillController.createSkill);
router.patch('/:id', validate(updateSkillSchema), skillController.updateSkill);
router.delete('/:id', skillController.deleteSkill);

export default router;