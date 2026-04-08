import { UserRole } from '@gentle-reminder/shared-types';
import { hasPermission, getPermittedActions, Resource, Action } from '../src/permissions';

describe('Permission Matrix', () => {
  describe('hasPermission', () => {
    it('should allow patient to create sessions', () => {
      expect(hasPermission(UserRole.PATIENT, Resource.SESSIONS, Action.CREATE)).toBe(true);
    });

    it('should deny patient from accessing analytics', () => {
      expect(hasPermission(UserRole.PATIENT, Resource.ANALYTICS, Action.READ)).toBe(false);
    });

    it('should allow caregiver to list patients', () => {
      expect(hasPermission(UserRole.CAREGIVER, Resource.PATIENTS, Action.LIST)).toBe(true);
    });

    it('should deny caregiver from deleting patients', () => {
      expect(hasPermission(UserRole.CAREGIVER, Resource.PATIENTS, Action.DELETE)).toBe(false);
    });

    it('should allow clinician to create reports', () => {
      expect(hasPermission(UserRole.CLINICIAN, Resource.REPORTS, Action.CREATE)).toBe(true);
    });

    it('should allow system admin full access to all resources', () => {
      const resources = Object.values(Resource);
      const actions = [Action.CREATE, Action.READ, Action.DELETE, Action.LIST];
      for (const resource of resources) {
        for (const action of actions) {
          expect(hasPermission(UserRole.SYSTEM_ADMIN, resource, action)).toBe(true);
        }
      }
    });

    it('should allow family member to read patient data', () => {
      expect(hasPermission(UserRole.FAMILY_MEMBER, Resource.PATIENTS, Action.READ)).toBe(true);
    });

    it('should deny family member from creating patients', () => {
      expect(hasPermission(UserRole.FAMILY_MEMBER, Resource.PATIENTS, Action.CREATE)).toBe(false);
    });

    it('should allow facility admin to manage users', () => {
      expect(hasPermission(UserRole.FACILITY_ADMIN, Resource.USERS, Action.CREATE)).toBe(true);
      expect(hasPermission(UserRole.FACILITY_ADMIN, Resource.USERS, Action.READ)).toBe(true);
    });
  });

  describe('getPermittedActions', () => {
    it('should return all actions for patient on sessions', () => {
      const actions = getPermittedActions(UserRole.PATIENT, Resource.SESSIONS);
      expect(actions).toContain(Action.CREATE);
      expect(actions).toContain(Action.READ);
      expect(actions).not.toContain(Action.DELETE);
    });

    it('should return empty array for unauthorized resource', () => {
      const actions = getPermittedActions(UserRole.PATIENT, Resource.USERS);
      expect(actions).toEqual([]);
    });

    it('should return full CRUD for system admin on patients', () => {
      const actions = getPermittedActions(UserRole.SYSTEM_ADMIN, Resource.PATIENTS);
      expect(actions).toContain(Action.CREATE);
      expect(actions).toContain(Action.READ);
      expect(actions).toContain(Action.UPDATE);
      expect(actions).toContain(Action.DELETE);
      expect(actions).toContain(Action.LIST);
    });
  });
});
