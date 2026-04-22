import { Router } from 'express';
import * as patientsController from '../controllers/patients.controller.js';
import { authenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { auditPhiAccess } from '../middleware/audit.js';
import { Resource, Action } from '@gentle-reminder/auth';
import { uuidParam, paginationQuery } from '../validators/common.validator.js';
import { createPatientSchema, updatePatientSchema } from '../validators/patient.validator.js';

const router = Router();

// PHI access logged on every successful patient-resource hit (fortress-audit C-4, 2026-04-22).
router.use(auditPhiAccess('patient'));

router.get(
  '/',
  authenticate,
  roleGuard(Resource.PATIENTS, Action.LIST),
  validateRequest({ query: paginationQuery }),
  patientsController.listPatients,
);

router.post(
  '/',
  authenticate,
  roleGuard(Resource.PATIENTS, Action.CREATE),
  validateRequest({ body: createPatientSchema }),
  patientsController.createPatient,
);

router.get(
  '/:id',
  authenticate,
  roleGuard(Resource.PATIENTS, Action.READ),
  validateRequest({ params: uuidParam }),
  patientsController.getPatient,
);

router.get(
  '/:id/profile',
  authenticate,
  roleGuard(Resource.PATIENTS, Action.READ),
  validateRequest({ params: uuidParam }),
  patientsController.getPatientProfile,
);

router.put(
  '/:id',
  authenticate,
  roleGuard(Resource.PATIENTS, Action.UPDATE),
  validateRequest({ params: uuidParam, body: updatePatientSchema }),
  patientsController.updatePatient,
);

router.delete(
  '/:id',
  authenticate,
  roleGuard(Resource.PATIENTS, Action.DELETE),
  validateRequest({ params: uuidParam }),
  patientsController.deletePatient,
);

export default router;
