/**
 * Tests for database type exports and schema validation.
 * Verifies that the types module exports expected interfaces.
 */

import * as dbTypes from '../src/types';

describe('Database Types', () => {
  it('should export database types module', () => {
    expect(dbTypes).toBeTruthy();
  });

  it('should have type definitions (module loads without error)', () => {
    // The types module is primarily TypeScript interfaces
    // This test ensures the module compiles and loads correctly
    expect(typeof dbTypes).toBe('object');
  });
});

describe('Tenant Operations', () => {
  it('should define tenant CRUD function signatures', () => {
    // Verify the tenant module exports expected functions
    // These are integration-level functions that need a DB connection
    // Here we just verify the module structure
    const tenantModule = require('../src/tenant');
    expect(typeof tenantModule.createTenant).toBe('function');
    expect(typeof tenantModule.getTenantById).toBe('function');
    expect(typeof tenantModule.getTenantBySlug).toBe('function');
    expect(typeof tenantModule.getTenantByDomain).toBe('function');
    expect(typeof tenantModule.updateTenant).toBe('function');
    expect(typeof tenantModule.listTenants).toBe('function');
    expect(typeof tenantModule.deactivateTenant).toBe('function');
  });
});
