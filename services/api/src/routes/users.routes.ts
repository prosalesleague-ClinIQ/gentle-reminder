import { Router } from 'express';
import * as usersController from '../controllers/users.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { uuidParam } from '../validators/common.validator.js';

const router = Router();

router.get(
  '/:id',
  authenticate,
  validateRequest({ params: uuidParam }),
  usersController.getUser,
);

router.put(
  '/:id',
  authenticate,
  validateRequest({ params: uuidParam }),
  usersController.updateUser,
);

export default router;
