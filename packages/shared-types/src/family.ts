export enum Relationship {
  SPOUSE = 'spouse',
  CHILD = 'child',
  GRANDCHILD = 'grandchild',
  SIBLING = 'sibling',
  PARENT = 'parent',
  FRIEND = 'friend',
  CAREGIVER = 'caregiver',
  OTHER = 'other',
}

export interface FamilyMember {
  id: string;
  patientId: string;
  userId?: string;
  displayName: string;
  relationship: Relationship;
  photoUrl?: string;
  voiceMessageUrl?: string;
  videoMessageUrl?: string;
  dateOfBirth?: Date;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFamilyMemberInput {
  patientId: string;
  userId?: string;
  displayName: string;
  relationship: Relationship;
  photoUrl?: string;
  voiceMessageUrl?: string;
  videoMessageUrl?: string;
  notes?: string;
}

export interface UpdateFamilyMemberInput {
  displayName?: string;
  relationship?: Relationship;
  photoUrl?: string;
  voiceMessageUrl?: string;
  videoMessageUrl?: string;
  notes?: string;
  isActive?: boolean;
}
