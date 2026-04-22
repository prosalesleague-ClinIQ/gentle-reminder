import { Router } from 'express';
import * as sessionsController from '../controllers/sessions.controller.js';
import { auditPhiAccess } from "../middleware/audit.js";
import { authenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { Resource, Action } from '@gentle-reminder/auth';
import { uuidParam } from '../validators/common.validator.js';
import {
  createSessionSchema,
  completeSessionSchema,
  sessionHistoryQuery,
} from '../validators/session.validator.js';

const router = Router();

// Audit PHI access (fortress-audit C-4, 2026-04-22)
router.use(auditPhiAccess("sessions"));

router.post(
  '/start',
  authenticate,
  roleGuard(Resource.SESSIONS, Action.CREATE),
  validateRequest({ body: createSessionSchema }),
  sessionsController.startSession,
);

router.post(
  '/:id/complete',
  authenticate,
  validateRequest({ params: uuidParam, body: completeSessionSchema }),
  sessionsController.completeSession,
);

router.get(
  '/history',
  authenticate,
  roleGuard(Resource.SESSIONS, Action.READ),
  validateRequest({ query: sessionHistoryQuery }),
  sessionsController.getSessionHistory,
);

router.get(
  '/:id',
  authenticate,
  roleGuard(Resource.SESSIONS, Action.READ),
  validateRequest({ params: uuidParam }),
  sessionsController.getSession,
);

export default router;
