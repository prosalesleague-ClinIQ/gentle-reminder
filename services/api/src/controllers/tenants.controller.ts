import { Request, Response, NextFunction } from 'express';
import * as tenantService from '../services/tenant.service.js';
import type { ApiResponse } from '@gentle-reminder/shared-types';

export async function createTenant(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, slug, domain } = req.body;

    if (!name || !slug) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'name and slug are required' },
      });
      return;
    }

    const result = await tenantService.provisionTenant(name, slug, domain);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export async function listTenants(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const tenants = await tenantService.listTenants();

    const response: ApiResponse = {
      success: true,
      data: tenants,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function getTenant(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const tenant = await tenantService.getTenantById(req.params.id);

    if (!tenant) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Tenant not found' },
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: tenant,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function updateTenant(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const tenant = await tenantService.updateTenant(req.params.id, req.body);

    const response: ApiResponse = {
      success: true,
      data: tenant,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function deactivateTenant(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const tenant = await tenantService.deactivateTenant(req.params.id);

    const response: ApiResponse = {
      success: true,
      data: tenant,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function getTenantUsage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const usage = await tenantService.getTenantUsage(req.params.id);

    const response: ApiResponse = {
      success: true,
      data: usage,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
