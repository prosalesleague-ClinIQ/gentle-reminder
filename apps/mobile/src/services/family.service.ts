import { api } from './api';
import type { FamilyMember } from '@gentle-reminder/shared-types';

/**
 * Family service - manages family member data.
 */
export const familyService = {
  /**
   * Get all family members for a patient.
   */
  async getFamilyMembers(patientId: string): Promise<FamilyMember[]> {
    const response = await api.get<FamilyMember[]>(
      `/patients/${patientId}/family`,
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get family members');
    }

    return response.data;
  },

  /**
   * Get a specific family member by ID.
   */
  async getFamilyMember(memberId: string): Promise<FamilyMember> {
    const response = await api.get<FamilyMember>(`/family/${memberId}`);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get family member');
    }

    return response.data;
  },
};
