/**
 * Family types for mobile app.
 * Re-exports shared types and adds mobile-specific extensions.
 */
export type {
  FamilyMember,
  Relationship,
  CreateFamilyMemberInput,
  UpdateFamilyMemberInput,
} from '@gentle-reminder/shared-types';

/** Family member display card data */
export interface FamilyMemberCard {
  id: string;
  displayName: string;
  relationship: string;
  photoUrl?: string;
  hasVoiceMessage: boolean;
  hasVideoMessage: boolean;
}

/** Family grid layout configuration */
export interface FamilyGridConfig {
  columns: number;
  cardSize: number;
  gap: number;
}
