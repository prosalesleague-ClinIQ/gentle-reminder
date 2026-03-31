export enum UserRole {
  PATIENT = 'patient',
  FAMILY_MEMBER = 'family_member',
  CAREGIVER = 'caregiver',
  CLINICIAN = 'clinician',
  FACILITY_ADMIN = 'facility_admin',
  SYSTEM_ADMIN = 'system_admin',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profilePhotoUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profilePhotoUrl?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  profilePhotoUrl?: string;
  isActive?: boolean;
}
