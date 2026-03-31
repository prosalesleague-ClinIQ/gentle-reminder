import { Router } from 'express';
import * as voiceController from '../controllers/voice.controller.js';
import { authenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { Resource, Action } from '@gentle-reminder/auth';

const router = Router();

// List voice profiles for a patient
router.get(
  '/:patientId',
  authenticate,
  roleGuard(Resource.MEMORIES, Action.READ),
  voiceController.listVoiceProfiles,
);

// Create a new voice profile (with consent tracking)
router.post(
  '/',
  authenticate,
  roleGuard(Resource.MEMORIES, Action.CREATE),
  voiceController.createVoiceProfile,
);

// Delete a voice profile
router.delete(
  '/:id',
  authenticate,
  roleGuard(Resource.MEMORIES, Action.DELETE),
  voiceController.deleteVoiceProfile,
);

// Generate speech from text using a voice profile
router.post(
  '/:id/generate',
  authenticate,
  roleGuard(Resource.MEMORIES, Action.READ),
  voiceController.generateSpeech,
);

export default router;
