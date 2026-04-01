import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as controller from '../controllers/medications.controller.js';

const router = Router();

router.use(authenticate);

router.get('/:patientId', controller.getMedications);
router.post('/', controller.createMedication);
router.post('/log', controller.logAdministration);
router.get('/schedule/:patientId', controller.getTodaySchedule);
router.get('/adherence/:patientId', controller.getAdherenceRate);

export default router;
