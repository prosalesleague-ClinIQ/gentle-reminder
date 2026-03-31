import request from 'supertest';
import {
  mockPrisma,
  resetMocks,
  getApp,
  generateTestToken,
} from './setup';

let app: Express.Application;

beforeAll(async () => {
  app = await getApp() as any;
});

beforeEach(() => {
  resetMocks();
});

const SESSION_ID = '00000000-0000-4000-a000-000000000020';

// ---------------------------------------------------------------------------
// Auth middleware check
// ---------------------------------------------------------------------------
describe('Exercise endpoints – auth middleware', () => {
  it('POST /api/v1/exercises/result returns 401 without a token', async () => {
    const res = await request(app)
      .post('/api/v1/exercises/result')
      .send({});

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/exercises/types returns 401 without a token', async () => {
    const res = await request(app).get('/api/v1/exercises/types');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// POST /api/v1/exercises/result
// ---------------------------------------------------------------------------
describe('POST /api/v1/exercises/result', () => {
  const token = generateTestToken({ role: 'caregiver' });

  const validPayload = {
    sessionId: SESSION_ID,
    exerciseType: 'orientation_date',
    domain: 'orientation',
    prompt: 'What is today\'s date?',
    expectedAnswer: '2026-03-31',
    givenAnswer: '2026-03-31',
    isCorrect: true,
    responseTimeMs: 3500,
    feedbackType: 'celebrated',
    score: 95,
    attemptNumber: 1,
  };

  it('should record an exercise result (201)', async () => {
    mockPrisma.session.findUnique.mockResolvedValueOnce({
      id: SESSION_ID,
      status: 'started',
    });
    mockPrisma.session.update.mockResolvedValueOnce({}); // status -> in_progress
    mockPrisma.exerciseResult.create.mockResolvedValueOnce({
      id: 'result-1',
      ...validPayload,
    });
    mockPrisma.session.update.mockResolvedValueOnce({}); // increment count

    const res = await request(app)
      .post('/api/v1/exercises/result')
      .set('Authorization', `Bearer ${token}`)
      .send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(mockPrisma.exerciseResult.create).toHaveBeenCalledTimes(1);
  });

  it('should return 404 when the session does not exist', async () => {
    mockPrisma.session.findUnique.mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/api/v1/exercises/result')
      .set('Authorization', `Bearer ${token}`)
      .send(validPayload);

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('should return 409 when session is already completed', async () => {
    mockPrisma.session.findUnique.mockResolvedValueOnce({
      id: SESSION_ID,
      status: 'completed',
    });

    const res = await request(app)
      .post('/api/v1/exercises/result')
      .set('Authorization', `Bearer ${token}`)
      .send(validPayload);

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  // --- Zod validation tests ---

  it('should return 400 when sessionId is not a UUID', async () => {
    const res = await request(app)
      .post('/api/v1/exercises/result')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validPayload, sessionId: 'not-a-uuid' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 400 for an invalid exerciseType', async () => {
    const res = await request(app)
      .post('/api/v1/exercises/result')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validPayload, exerciseType: 'nonexistent_type' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 400 for an invalid cognitive domain', async () => {
    const res = await request(app)
      .post('/api/v1/exercises/result')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validPayload, domain: 'invalid_domain' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/exercises/result')
      .set('Authorization', `Bearer ${token}`)
      .send({ sessionId: SESSION_ID });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 400 when score exceeds 100', async () => {
    const res = await request(app)
      .post('/api/v1/exercises/result')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validPayload, score: 150 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 400 when responseTimeMs is negative', async () => {
    const res = await request(app)
      .post('/api/v1/exercises/result')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validPayload, responseTimeMs: -100 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 400 for an invalid feedbackType', async () => {
    const res = await request(app)
      .post('/api/v1/exercises/result')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validPayload, feedbackType: 'unknown' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

// ---------------------------------------------------------------------------
// GET /api/v1/exercises/types
// ---------------------------------------------------------------------------
describe('GET /api/v1/exercises/types', () => {
  const token = generateTestToken({ role: 'caregiver' });

  it('should return exercise type metadata', async () => {
    const res = await request(app)
      .get('/api/v1/exercises/types')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('exerciseTypes');
    expect(res.body.data).toHaveProperty('cognitiveDomains');
    expect(Array.isArray(res.body.data.exerciseTypes)).toBe(true);
    expect(Array.isArray(res.body.data.cognitiveDomains)).toBe(true);

    // Each exercise type entry should have type, domain, label
    const first = res.body.data.exerciseTypes[0];
    expect(first).toHaveProperty('type');
    expect(first).toHaveProperty('domain');
    expect(first).toHaveProperty('label');
  });

  it('should return 403 for a role without exercises:read permission', async () => {
    // family_member does NOT have exercises:read in the permissions matrix
    const familyToken = generateTestToken({ role: 'family_member' });

    const res = await request(app)
      .get('/api/v1/exercises/types')
      .set('Authorization', `Bearer ${familyToken}`);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });
});
