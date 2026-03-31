import jwt from 'jsonwebtoken';
import { UserRole } from '@gentle-reminder/shared-types';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

const DEFAULT_ACCESS_EXPIRY = '15m';
const DEFAULT_REFRESH_EXPIRY = '7d';

export function generateTokenPair(
  payload: TokenPayload,
  secret: string,
  refreshSecret?: string,
): TokenPair {
  const accessToken = jwt.sign(payload, secret, {
    expiresIn: DEFAULT_ACCESS_EXPIRY,
  });

  const refreshToken = jwt.sign(payload, refreshSecret || secret, {
    expiresIn: DEFAULT_REFRESH_EXPIRY,
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: 900, // 15 minutes in seconds
  };
}

export function verifyAccessToken(token: string, secret: string): TokenPayload {
  return jwt.verify(token, secret) as TokenPayload;
}

export function verifyRefreshToken(token: string, secret: string): TokenPayload {
  return jwt.verify(token, secret) as TokenPayload;
}

export function decodeToken(token: string): TokenPayload | null {
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded === 'string') return null;
  return decoded as TokenPayload;
}
