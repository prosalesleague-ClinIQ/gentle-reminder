import { Router } from 'express';
import * as tenantsController from '../controllers/tenants.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';

const router = Router();

// All tenant management routes require system_admin role
router.post(
  '/',
  authenticate,
  requireRole('system_admin' as any),
  tenantsController.createTenant,
);

router.get(
  '/',
  authenticate,
  requireRole('system_admin' as any),
  tenantsController.listTenants,
);

router.get(
  '/:id',
  authenticate,
  requireRole('system_admin' as any, 'facility_admin' as any),
  tenantsController.getTenant,
);

router.put(
  '/:id',
  authenticate,
  requireRole('system_admin' as any),
  tenantsController.updateTenant,
);

router.delete(
  '/:id',
  authenticate,
  requireRole('system_admin' as any),
  tenantsController.deactivateTenant,
);

router.get(
  '/:id/usage',
  authenticate,
  requireRole('system_admin' as any, 'facility_admin' as any),
  tenantsController.getTenantUsage,
);

export default router;
