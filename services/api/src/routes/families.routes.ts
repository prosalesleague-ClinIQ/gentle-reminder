import { Router } from 'express';
import * as familiesController from '../controllers/families.controller.js';
import { auditPhiAccess } from "../middleware/audit.js";
import { authenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { Resource, Action } from '@gentle-reminder/auth';
import { uuidParam, patientIdParam } from '../validators/common.validator.js';
import {
  createFamilyMemberSchema,
  updateFamilyMemberSchema,
} from '../validators/patient.validator.js';

const router = Router();

// Audit PHI access (fortress-audit C-4, 2026-04-22)
router.use(auditPhiAccess("families"));

router.get(
  '/patient/:patientId',
  authenticate,
  roleGuard(Resource.FAMILIES, Action.READ),
  validateRequest({ params: patientIdParam }),
  familiesController.listFamilyMembers,
);

router.post(
  '/',
  authenticate,
  roleGuard(Resource.FAMILIES, Action.CREATE),
  validateRequest({ body: createFamilyMemberSchema }),
  familiesController.createFamilyMember,
);

router.get(
  '/:id',
  authenticate,
  roleGuard(Resource.FAMILIES, Action.READ),
  validateRequest({ params: uuidParam }),
  familiesController.getFamilyMember,
);

router.put(
  '/:id',
  authenticate,
  roleGuard(Resource.FAMILIES, Action.UPDATE),
  validateRequest({ params: uuidParam, body: updateFamilyMemberSchema }),
  familiesController.updateFamilyMember,
);

router.delete(
  '/:id',
  authenticate,
  roleGuard(Resource.FAMILIES, Action.DELETE),
  validateRequest({ params: uuidParam }),
  familiesController.deleteFamilyMember,
);

export default router;
