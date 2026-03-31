import { Router } from 'express';
import * as exercisesController from '../controllers/exercises.controller.js';
import { authenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { Resource, Action } from '@gentle-reminder/auth';
import { createExerciseResultSchema } from '../validators/session.validator.js';

const router = Router();

router.post(
  '/result',
  authenticate,
  validateRequest({ body: createExerciseResultSchema }),
  exercisesController.recordResult,
);

router.get(
  '/types',
  authenticate,
  roleGuard(Resource.EXERCISES, Action.READ),
  exercisesController.getExerciseTypes,
);

export default router;
