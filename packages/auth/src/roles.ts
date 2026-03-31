import { UserRole } from '@gentle-reminder/shared-types';

/**
 * Role hierarchy: higher index = more permissions.
 * system_admin > facility_admin > clinician > caregiver > family_member > patient
 */
const ROLE_HIERARCHY: UserRole[] = [
  UserRole.PATIENT,
  UserRole.FAMILY_MEMBER,
  UserRole.CAREGIVER,
  UserRole.CLINICIAN,
  UserRole.FACILITY_ADMIN,
  UserRole.SYSTEM_ADMIN,
];

export function getRoleLevel(role: UserRole): number {
  return ROLE_HIERARCHY.indexOf(role);
}

export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return getRoleLevel(userRole) >= getRoleLevel(requiredRole);
}

export function isPatient(role: UserRole): boolean {
  return role === UserRole.PATIENT;
}

export function isClinical(role: UserRole): boolean {
  return role === UserRole.CLINICIAN || role === UserRole.FACILITY_ADMIN;
}

export function isAdmin(role: UserRole): boolean {
  return role === UserRole.FACILITY_ADMIN || role === UserRole.SYSTEM_ADMIN;
}
