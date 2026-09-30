import { Router } from 'express';
import * as projectController from '../controllers/project.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createProjectSchema, updateProjectSchema } from '../schemas/project.schema.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = Router();

// PUBLIC ROUTES (Herkes erişebilir)
router.get('/', projectController.getAllProjects);
router.get('/:slug', projectController.getProjectBySlug);

// PROTECTED ROUTES (Sadece ADMIN erişebilir)
router.use(protect, restrictTo('ADMIN')); // Bu satırdan sonraki tüm rotalar korunur!

router.post('/', validate(createProjectSchema), projectController.createProject);
router.patch('/:id', validate(updateProjectSchema), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export default router;