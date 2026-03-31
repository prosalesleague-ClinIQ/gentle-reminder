import { UserRole } from '@gentle-reminder/shared-types';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
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
