import { UserRole } from '@gentle-reminder/shared-types';
import { getRoleLevel, hasMinimumRole, isPatient, isClinical, isAdmin } from '../src/roles';

describe('Role Hierarchy', () => {
  describe('getRoleLevel', () => {
    it('should return ascending levels for role hierarchy', () => {
      expect(getRoleLevel(UserRole.PATIENT)).toBeLessThan(getRoleLevel(UserRole.FAMILY_MEMBER));
      expect(getRoleLevel(UserRole.FAMILY_MEMBER)).toBeLessThan(getRoleLevel(UserRole.CAREGIVER));
      expect(getRoleLevel(UserRole.CAREGIVER)).toBeLessThan(getRoleLevel(UserRole.CLINICIAN));
      expect(getRoleLevel(UserRole.CLINICIAN)).toBeLessThan(getRoleLevel(UserRole.FACILITY_ADMIN));
      expect(getRoleLevel(UserRole.FACILITY_ADMIN)).toBeLessThan(getRoleLevel(UserRole.SYSTEM_ADMIN));
    });
  });

  describe('hasMinimumRole', () => {
    it('should return true when user has exact required role', () => {
      expect(hasMinimumRole(UserRole.CLINICIAN, UserRole.CLINICIAN)).toBe(true);
    });

    it('should return true when user has higher role', () => {
      expect(hasMinimumRole(UserRole.SYSTEM_ADMIN, UserRole.CAREGIVER)).toBe(true);
      expect(hasMinimumRole(UserRole.CLINICIAN, UserRole.CAREGIVER)).toBe(true);
    });

    it('should return false when user has lower role', () => {
      expect(hasMinimumRole(UserRole.PATIENT, UserRole.CAREGIVER)).toBe(false);
      expect(hasMinimumRole(UserRole.CAREGIVER, UserRole.CLINICIAN)).toBe(false);
    });
  });

  describe('role check helpers', () => {
    it('isPatient should identify patients', () => {
      expect(isPatient(UserRole.PATIENT)).toBe(true);
      expect(isPatient(UserRole.CAREGIVER)).toBe(false);
    });

    it('isClinical should identify clinicians and facility admins', () => {
      expect(isClinical(UserRole.CLINICIAN)).toBe(true);
      expect(isClinical(UserRole.FACILITY_ADMIN)).toBe(true);
      expect(isClinical(UserRole.CAREGIVER)).toBe(false);
      expect(isClinical(UserRole.SYSTEM_ADMIN)).toBe(false);
    });

    it('isAdmin should identify facility and system admins', () => {
      expect(isAdmin(UserRole.FACILITY_ADMIN)).toBe(true);
      expect(isAdmin(UserRole.SYSTEM_ADMIN)).toBe(true);
      expect(isAdmin(UserRole.CLINICIAN)).toBe(false);
      expect(isAdmin(UserRole.PATIENT)).toBe(false);
    });
  });
});
