import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { Resource, Action } from '@gentle-reminder/auth';
import { analyticsQuery, engagementQuery } from '../validators/session.validator.js';

const router = Router();

router.get(
  '/cognitive-trends',
  authenticate,
  roleGuard(Resource.ANALYTICS, Action.READ),
  validateRequest({ query: analyticsQuery }),
  analyticsController.getCognitiveTrends,
);

router.get(
  '/engagement',
  authenticate,
  roleGuard(Resource.ANALYTICS, Action.READ),
  validateRequest({ query: engagementQuery }),
  analyticsController.getEngagement,
);

export default router;
