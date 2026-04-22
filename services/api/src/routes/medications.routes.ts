import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { auditPhiAccess } from "../middleware/audit.js";
import * as controller from '../controllers/medications.controller.js';

const router = Router();

// Audit PHI access (fortress-audit C-4, 2026-04-22)
router.use(auditPhiAccess("medications"));

router.use(authenticate);

router.get('/:patientId', controller.getMedications);
router.post('/', controller.createMedication);
router.post('/log', controller.logAdministration);
router.get('/schedule/:patientId', controller.getTodaySchedule);
router.get('/adherence/:patientId', controller.getAdherenceRate);

export default router;
