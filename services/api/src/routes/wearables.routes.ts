import { Router } from 'express';
import * as wearablesController from '../controllers/wearables.controller.js';
import { auditPhiAccess } from "../middleware/audit.js";
import { authenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { Resource, Action } from '@gentle-reminder/auth';

const router = Router();

// Audit PHI access (fortress-audit C-4, 2026-04-22)
router.use(auditPhiAccess("wearables"));

// Ingest a batch of wearable signals
router.post(
  '/data',
  authenticate,
  roleGuard(Resource.PATIENTS, Action.UPDATE),
  wearablesController.ingestBatch,
);

// Ingest heart rate data
router.post(
  '/heartrate',
  authenticate,
  roleGuard(Resource.PATIENTS, Action.UPDATE),
  wearablesController.ingestHeartRate,
);

// Ingest movement / step data
router.post(
  '/movement',
  authenticate,
  roleGuard(Resource.PATIENTS, Action.UPDATE),
  wearablesController.ingestMovement,
);

// Ingest sleep data
router.post(
  '/sleep',
  authenticate,
  roleGuard(Resource.PATIENTS, Action.UPDATE),
  wearablesController.ingestSleep,
);

// Get daily summary for a patient
router.get(
  '/summary/:patientId',
  authenticate,
  roleGuard(Resource.PATIENTS, Action.READ),
  wearablesController.getDailySummary,
);

export default router;
