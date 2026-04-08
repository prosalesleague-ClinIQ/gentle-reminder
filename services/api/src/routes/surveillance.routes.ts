import { Router } from 'express';
import * as surveillanceController from '../controllers/surveillance.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

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
