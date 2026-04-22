import { Router } from 'express';
import * as memoriesController from '../controllers/memories.controller.js';
import { auditPhiAccess } from "../middleware/audit.js";
import { authenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { Resource, Action } from '@gentle-reminder/auth';
import { uuidParam, patientIdParam } from '../validators/common.validator.js';
import { createMemorySchema, updateMemorySchema } from '../validators/patient.validator.js';

const router = Router();

// Audit PHI access (fortress-audit C-4, 2026-04-22)
router.use(auditPhiAccess("memories"));

router.get(
  '/patient/:patientId',
  authenticate,
  roleGuard(Resource.MEMORIES, Action.READ),
  validateRequest({ params: patientIdParam }),
  memoriesController.listMemories,
);

router.post(
  '/',
  authenticate,
  roleGuard(Resource.MEMORIES, Action.CREATE),
  validateRequest({ body: createMemorySchema }),
  memoriesController.createMemory,
);

router.get(
  '/:id',
  authenticate,
  roleGuard(Resource.MEMORIES, Action.READ),
  validateRequest({ params: uuidParam }),
  memoriesController.getMemory,
);

router.put(
  '/:id',
  authenticate,
  roleGuard(Resource.MEMORIES, Action.UPDATE),
  validateRequest({ params: uuidParam, body: updateMemorySchema }),
  memoriesController.updateMemory,
);

router.delete(
  '/:id',
  authenticate,
  roleGuard(Resource.MEMORIES, Action.DELETE),
  validateRequest({ params: uuidParam }),
  memoriesController.deleteMemory,
);

export default router;
