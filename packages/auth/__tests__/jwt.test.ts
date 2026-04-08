import { UserRole } from '@gentle-reminder/shared-types';
import {
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  TokenPayload,
} from '../src/jwt';

const TEST_SECRET = 'test-secret-key-for-jwt';
const TEST_REFRESH_SECRET = 'test-refresh-secret-key';

const mockPayload: TokenPayload = {
  userId: 'user-123',
  email: 'nurse.sarah@example.com',
  role: UserRole.CAREGIVER,
};

describe('JWT Token Management', () => {
  describe('generateTokenPair', () => {
    it('should generate access and refresh tokens', () => {
      const pair = generateTokenPair(mockPayload, TEST_SECRET, TEST_REFRESH_SECRET);
      expect(pair.accessToken).toBeTruthy();
      expect(pair.refreshToken).toBeTruthy();
      expect(pair.expiresIn).toBe(900);
    });

    it('should generate different access and refresh tokens', () => {
      const pair = generateTokenPair(mockPayload, TEST_SECRET, TEST_REFRESH_SECRET);
      expect(pair.accessToken).not.toBe(pair.refreshToken);
    });

    it('should use main secret for refresh when refresh secret not provided', () => {
      const pair = generateTokenPair(mockPayload, TEST_SECRET);
      const decoded = verifyRefreshToken(pair.refreshToken, TEST_SECRET);
      expect(decoded.userId).toBe(mockPayload.userId);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', () => {
      const pair = generateTokenPair(mockPayload, TEST_SECRET);
      const decoded = verifyAccessToken(pair.accessToken, TEST_SECRET);
      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(UserRole.CAREGIVER);
    });

    it('should throw on invalid secret', () => {
      const pair = generateTokenPair(mockPayload, TEST_SECRET);
      expect(() => verifyAccessToken(pair.accessToken, 'wrong-secret')).toThrow();
    });

    it('should throw on tampered token', () => {
      const pair = generateTokenPair(mockPayload, TEST_SECRET);
      const tampered = pair.accessToken + 'x';
      expect(() => verifyAccessToken(tampered, TEST_SECRET)).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify with refresh secret', () => {
      const pair = generateTokenPair(mockPayload, TEST_SECRET, TEST_REFRESH_SECRET);
      const decoded = verifyRefreshToken(pair.refreshToken, TEST_REFRESH_SECRET);
      expect(decoded.userId).toBe(mockPayload.userId);
    });

    it('should fail when using wrong secret', () => {
      const pair = generateTokenPair(mockPayload, TEST_SECRET, TEST_REFRESH_SECRET);
      expect(() => verifyRefreshToken(pair.refreshToken, TEST_SECRET)).toThrow();
    });
  });

  describe('decodeToken', () => {
    it('should decode a token without verification', () => {
      const pair = generateTokenPair(mockPayload, TEST_SECRET);
      const decoded = decodeToken(pair.accessToken);
      expect(decoded).not.toBeNull();
      expect(decoded!.userId).toBe(mockPayload.userId);
      expect(decoded!.email).toBe(mockPayload.email);
    });

    it('should return null for invalid token', () => {
      const result = decodeToken('not-a-valid-token');
      expect(result).toBeNull();
    });
  });
});
