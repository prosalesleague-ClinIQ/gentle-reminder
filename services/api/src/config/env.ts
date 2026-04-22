/**
 * Environment configuration for services/api.
 *
 * Fail-fast posture: in production (NODE_ENV=production) every secret MUST be
 * supplied via env; missing or default-looking values throw at boot rather than
 * silently running with well-known dev credentials.
 *
 * Hardened 2026-04-22 per fortress-audit finding C-3 (JWT_SECRET dev fallback
 * fail-open). Previous revision silently shipped `'dev-jwt-secret'` whenever
 * env was unset, allowing forged admin tokens in any misconfigured prod env.
 */

const FORBIDDEN_SECRET_VALUES = new Set<string>([
  'dev-jwt-secret',
  'dev-jwt-refresh-secret',
  'dev-secret-change-me',
  'CHANGE_ME',
  'CHANGE_ME_TO_A_SECURE_RANDOM_STRING',
  'CHANGE_ME_TO_ANOTHER_SECURE_RANDOM_STRING',
  'your-jwt-secret-change-in-production',
  'your-jwt-refresh-secret-change-in-production',
  'password',
  'secret',
  'changeme',
]);

const MIN_SECRET_BYTES = 32;

function requireSecret(name: string, rawValue: string | undefined, isProd: boolean): string {
  if (!rawValue) {
    if (isProd) {
      throw new Error(
        `[env] ${name} is required in production. Refusing to boot with a default value.`
      );
    }
    // Non-prod: use a *distinct* ephemeral dev value per-process so JWTs signed
    // today don't silently verify elsewhere. 48 random bytes base64-encoded.
    const crypto = require('crypto') as typeof import('crypto');
    return crypto.randomBytes(48).toString('base64');
  }
  if (FORBIDDEN_SECRET_VALUES.has(rawValue)) {
    throw new Error(
      `[env] ${name} matches a well-known default/placeholder. Regenerate with: openssl rand -base64 48`
    );
  }
  if (isProd && rawValue.length < MIN_SECRET_BYTES) {
    throw new Error(
      `[env] ${name} is shorter than ${MIN_SECRET_BYTES} bytes in production. Regenerate with: openssl rand -base64 48`
    );
  }
  return rawValue;
}

function requireUrl(name: string, rawValue: string | undefined, isProd: boolean, devFallback: string): string {
  if (!rawValue) {
    if (isProd) {
      throw new Error(`[env] ${name} is required in production.`);
    }
    return devFallback;
  }
  // In production, refuse any URL that embeds the literal "password" or a known placeholder.
  if (isProd && /:(password|changeme|CHANGE_ME)@/i.test(rawValue)) {
    throw new Error(`[env] ${name} embeds a placeholder credential. Rotate before deploying.`);
  }
  return rawValue;
}

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const IS_TEST = NODE_ENV === 'test';

// In tests, skip strict validation so Jest fixtures can run without real secrets.
const STRICT = IS_PRODUCTION && !IS_TEST;

export const env = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: NODE_ENV,
  databaseUrl: requireUrl(
    'DATABASE_URL',
    process.env.DATABASE_URL,
    STRICT,
    'postgresql://user:password@localhost:5432/gentle_reminder'
  ),
  jwtSecret: IS_TEST
    ? process.env.JWT_SECRET || 'test-jwt-secret-ci'
    : requireSecret('JWT_SECRET', process.env.JWT_SECRET, STRICT),
  jwtRefreshSecret: IS_TEST
    ? process.env.JWT_REFRESH_SECRET || 'test-refresh-secret-ci'
    : requireSecret('JWT_REFRESH_SECRET', process.env.JWT_REFRESH_SECRET, STRICT),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  logLevel: process.env.LOG_LEVEL || 'debug',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  isDevelopment: NODE_ENV === 'development',
  isProduction: IS_PRODUCTION,
  isTest: IS_TEST,
  multiTenantEnabled: process.env.MULTI_TENANT_ENABLED === 'true',
  baseDomain: process.env.BASE_DOMAIN || 'gentlereminder.health',
} as const;
