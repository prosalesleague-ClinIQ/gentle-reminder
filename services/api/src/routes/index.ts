import { Router } from 'express';
import authRoutes from './auth.routes.js';
import usersRoutes from './users.routes.js';
import patientsRoutes from './patients.routes.js';
import caregiversRoutes from './caregivers.routes.js';
import familiesRoutes from './families.routes.js';
import sessionsRoutes from './sessions.routes.js';
import exercisesRoutes from './exercises.routes.js';
import memoriesRoutes from './memories.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/patients', patientsRoutes);
router.use('/caregivers', caregiversRoutes);
router.use('/families', familiesRoutes);
router.use('/sessions', sessionsRoutes);
router.use('/exercises', exercisesRoutes);
router.use('/memories', memoriesRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
