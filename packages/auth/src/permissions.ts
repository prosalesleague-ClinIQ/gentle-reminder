import { UserRole } from '@gentle-reminder/shared-types';

export enum Resource {
  PATIENTS = 'patients',
  SESSIONS = 'sessions',
  EXERCISES = 'exercises',
  FAMILIES = 'families',
  MEMORIES = 'memories',
  ANALYTICS = 'analytics',
  ALERTS = 'alerts',
  USERS = 'users',
  REPORTS = 'reports',
}

export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
}

type PermissionMatrix = Record<UserRole, Partial<Record<Resource, Action[]>>>;

const PERMISSIONS: PermissionMatrix = {
  [UserRole.PATIENT]: {
    [Resource.SESSIONS]: [Action.CREATE, Action.READ],
    [Resource.EXERCISES]: [Action.READ],
    [Resource.FAMILIES]: [Action.READ],
    [Resource.MEMORIES]: [Action.CREATE, Action.READ],
  },
  [UserRole.FAMILY_MEMBER]: {
    [Resource.PATIENTS]: [Action.READ],
    [Resource.SESSIONS]: [Action.READ],
    [Resource.FAMILIES]: [Action.READ, Action.UPDATE],
    [Resource.MEMORIES]: [Action.CREATE, Action.READ, Action.UPDATE],
    [Resource.ANALYTICS]: [Action.READ],
  },
  [UserRole.CAREGIVER]: {
    [Resource.PATIENTS]: [Action.READ, Action.LIST],
    [Resource.SESSIONS]: [Action.CREATE, Action.READ, Action.LIST],
    [Resource.EXERCISES]: [Action.READ, Action.LIST],
    [Resource.FAMILIES]: [Action.READ, Action.LIST],
    [Resource.MEMORIES]: [Action.CREATE, Action.READ, Action.LIST],
    [Resource.ANALYTICS]: [Action.READ],
    [Resource.ALERTS]: [Action.READ, Action.LIST],
  },
  [UserRole.CLINICIAN]: {
    [Resource.PATIENTS]: [Action.CREATE, Action.READ, Action.UPDATE, Action.LIST],
    [Resource.SESSIONS]: [Action.READ, Action.LIST],
    [Resource.EXERCISES]: [Action.READ, Action.LIST],
    [Resource.FAMILIES]: [Action.READ, Action.LIST],
    [Resource.MEMORIES]: [Action.READ, Action.LIST],
    [Resource.ANALYTICS]: [Action.READ, Action.LIST],
    [Resource.ALERTS]: [Action.READ, Action.UPDATE, Action.LIST],
    [Resource.REPORTS]: [Action.CREATE, Action.READ, Action.LIST],
  },
  [UserRole.FACILITY_ADMIN]: {
    [Resource.PATIENTS]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.LIST],
    [Resource.SESSIONS]: [Action.READ, Action.LIST],
    [Resource.EXERCISES]: [Action.READ, Action.LIST],
    [Resource.FAMILIES]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.LIST],
    [Resource.MEMORIES]: [Action.READ, Action.LIST],
    [Resource.ANALYTICS]: [Action.READ, Action.LIST],
    [Resource.ALERTS]: [Action.READ, Action.UPDATE, Action.LIST],
    [Resource.USERS]: [Action.CREATE, Action.READ, Action.UPDATE, Action.LIST],
    [Resource.REPORTS]: [Action.CREATE, Action.READ, Action.LIST],
  },
  [UserRole.SYSTEM_ADMIN]: {
    [Resource.PATIENTS]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.LIST],
    [Resource.SESSIONS]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.LIST],
    [Resource.EXERCISES]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.LIST],
    [Resource.FAMILIES]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.LIST],
    [Resource.MEMORIES]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.LIST],
    [Resource.ANALYTICS]: [Action.READ, Action.LIST],
    [Resource.ALERTS]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.LIST],
    [Resource.USERS]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.LIST],
    [Resource.REPORTS]: [Action.CREATE, Action.READ, Action.DELETE, Action.LIST],
  },
};

export function hasPermission(role: UserRole, resource: Resource, action: Action): boolean {
  const rolePermissions = PERMISSIONS[role];
  if (!rolePermissions) return false;

  const resourceActions = rolePermissions[resource];
  if (!resourceActions) return false;

  return resourceActions.includes(action);
}

export function getPermittedActions(role: UserRole, resource: Resource): Action[] {
  return PERMISSIONS[role]?.[resource] ?? [];
}
