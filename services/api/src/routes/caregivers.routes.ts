import { Router } from 'express';
import * as caregiversController from '../controllers/caregivers.controller.js';
import { authenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { Resource, Action } from '@gentle-reminder/auth';
import { uuidParam, paginationQuery } from '../validators/common.validator.js';

const router = Router();

router.get(
  '/',
  authenticate,
  validateRequest({ query: paginationQuery }),
  caregiversController.listCaregivers,
);

router.get(
  '/:id',
  authenticate,
  validateRequest({ params: uuidParam }),
  caregiversController.getCaregiver,
);

router.post(
  '/assign',
  authenticate,
  roleGuard(Resource.PATIENTS, Action.UPDATE),
  caregiversController.assignCaregiver,
);

router.post(
  '/unassign',
  authenticate,
  roleGuard(Resource.PATIENTS, Action.UPDATE),
  caregiversController.unassignCaregiver,
);

export default router;
