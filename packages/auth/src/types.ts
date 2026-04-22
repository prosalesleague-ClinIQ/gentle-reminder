import { UserRole } from '@gentle-reminder/shared-types';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
  /**
   * Tenant scope for this session. Undefined/null = no tenant claim in the
   * JWT; services must treat such sessions as system-level or reject them.
   * Added 2026-04-22 per fortress-audit finding C-1.
   */
  tenantId?: string | null;
  facilityId?: string | null;
}

export interface AuthConfig {
  jwtSecret: string;
  jwtRefreshSecret: string;
  accessTokenExpiry?: string;
  refreshTokenExpiry?: string;
  bcryptRounds?: number;
}

export const DEFAULT_AUTH_CONFIG: Partial<AuthConfig> = {
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  bcryptRounds: 12,
};
