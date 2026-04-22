import { Router } from 'express';
import * as surveillanceController from '../controllers/surveillance.controller.js';
import { auditPhiAccess } from "../middleware/audit.js";
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Audit PHI access (fortress-audit C-4, 2026-04-22)
router.use(auditPhiAccess("surveillance"));

router.get(
  '/report',
  authenticate,
  surveillanceController.getSafetyReport,
);

router.post(
  '/accuracy',
  authenticate,
  surveillanceController.trackAccuracy,
);

router.post(
  '/complaint',
  authenticate,
  surveillanceController.reportComplaint,
);

router.get(
  '/drift',
  authenticate,
  surveillanceController.getDriftAnalysis,
);

export default router;
