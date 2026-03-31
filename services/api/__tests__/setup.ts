import jwt from 'jsonwebtoken';
import type { Express } from 'express';
import request from 'supertest';

// ---------------------------------------------------------------------------
// Test JWT secret – must match the fallback in src/config/env.ts
// ---------------------------------------------------------------------------
export const TEST_JWT_SECRET = 'dev-jwt-secret';
export const TEST_JWT_REFRESH_SECRET = 'dev-jwt-refresh-secret';

// ---------------------------------------------------------------------------
// Mock Prisma client
// ---------------------------------------------------------------------------

/**
 * Builds a mock PrismaClient whose every model exposes the standard query
 * methods (findUnique, findFirst, findMany, create, update, delete, count).
 * Each method is a `jest.fn()` so tests can set return values per-case.
 */
function createMockPrismaClient() {
  const models = [
    'user',
    'patient',
    'session',
    'exerciseResult',
    'cognitiveScore',
    'family',
    'memory',
  ] as const;

  const methods = [
    'findUnique',
    'findFirst',
    'findMany',
    'create',
    'update',
    'delete',
    'count',
    'upsert',
  ] as const;

  const client: Record<string, Record<string, jest.Mock>> = {};
  for (const model of models) {
    client[model] = {};
    for (const method of methods) {
      client[model][method] = jest.fn();
    }
  }

  return client;
}

export const mockPrisma = createMockPrismaClient();

// Mock the database module so every call to `getDatabase()` returns our mock
jest.mock('@gentle-reminder/database', () => ({
  getDatabase: () => mockPrisma,
  disconnectDatabase: jest.fn(),
  PrismaClient: jest.fn(),
}));

// Mock the cognitive-engine package used in session completion
jest.mock('@gentle-reminder/cognitive-engine', () => ({
  calculateSessionScores: jest.fn(() => ({
    overallScore: 75,
    orientationScore: 80,
    identityScore: 70,
    memoryScore: 75,
    languageScore: 72,
    executiveFunctionScore: 68,
    attentionScore: 78,
  })),
}));

// ---------------------------------------------------------------------------
// Helper: generate a valid access token for a test user
// ---------------------------------------------------------------------------
export interface TestUser {
  userId: string;
  email: string;
  role: string;
}

const defaultTestUser: TestUser = {
  userId: '00000000-0000-4000-a000-000000000001',
  email: 'test@example.com',
  role: 'caregiver',
};

export function generateTestToken(overrides: Partial<TestUser> = {}): string {
  const payload = { ...defaultTestUser, ...overrides };
  return jwt.sign(payload, TEST_JWT_SECRET, { expiresIn: '15m' });
}

export function generateTestRefreshToken(overrides: Partial<TestUser> = {}): string {
  const payload = { ...defaultTestUser, ...overrides };
  return jwt.sign(payload, TEST_JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

// ---------------------------------------------------------------------------
// Helper: create a supertest agent bound to the Express app
// ---------------------------------------------------------------------------
let _app: Express | null = null;

export async function getApp(): Promise<Express> {
  if (!_app) {
    // Dynamic import so mocks are registered before any app code runs
    const mod = await import('../src/app.js');
    _app = mod.default;
  }
  return _app;
}

export function agent() {
  // Returns a supertest wrapper – call `await getApp()` first, then pass it
  return {
    async get(url: string) {
      const app = await getApp();
      return request(app).get(url);
    },
    async post(url: string) {
      const app = await getApp();
      return request(app).post(url);
    },
    async put(url: string) {
      const app = await getApp();
      return request(app).put(url);
    },
    async patch(url: string) {
      const app = await getApp();
      return request(app).patch(url);
    },
    async delete(url: string) {
      const app = await getApp();
      return request(app).delete(url);
    },
  };
}

// ---------------------------------------------------------------------------
// Reset all mocks between tests
// ---------------------------------------------------------------------------
export function resetMocks() {
  for (const model of Object.values(mockPrisma)) {
    for (const fn of Object.values(model)) {
      (fn as jest.Mock).mockReset();
    }
  }
}
