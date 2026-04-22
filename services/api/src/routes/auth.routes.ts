import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { loginSchema, registerSchema, refreshTokenSchema } from '../validators/auth.validator.js';

const router = Router();

router.post(
  '/login',
  authLimiter,
  validateRequest({ body: loginSchema }),
  authController.login,
);

router.post(
  '/register',
  authLimiter,
  validateRequest({ body: registerSchema }),
  authController.register,
);

router.post(
  '/refresh',
  validateRequest({ body: refreshTokenSchema }),
  authController.refresh,
);

// Fortress-audit C-8 (2026-04-22): server-side session revocation.
router.post(
  '/logout',
  authLimiter,
  authController.logout,
);

export default router;
