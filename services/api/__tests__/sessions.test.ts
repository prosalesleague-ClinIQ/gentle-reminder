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

const PATIENT_ID = '00000000-0000-4000-a000-000000000010';
const SESSION_ID = '00000000-0000-4000-a000-000000000020';

// ---------------------------------------------------------------------------
// Auth middleware checks (apply to all session endpoints)
// ---------------------------------------------------------------------------
describe('Session endpoints – auth middleware', () => {
  it('POST /api/v1/sessions/start returns 401 without a token', async () => {
    const res = await request(app)
      .post('/api/v1/sessions/start')
      .send({ patientId: PATIENT_ID });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('POST /api/v1/sessions/:id/complete returns 401 without a token', async () => {
    const res = await request(app)
      .post(`/api/v1/sessions/${SESSION_ID}/complete`)
      .send({});

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/sessions/history returns 401 without a token', async () => {
    const res = await request(app)
      .get('/api/v1/sessions/history')
      .query({ patientId: PATIENT_ID });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 with an invalid / expired token', async () => {
    const res = await request(app)
      .post('/api/v1/sessions/start')
      .set('Authorization', 'Bearer invalid.jwt.token')
      .send({ patientId: PATIENT_ID });

    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// POST /api/v1/sessions/start
// ---------------------------------------------------------------------------
describe('POST /api/v1/sessions/start', () => {
  const token = generateTestToken({ role: 'caregiver' });

  it('should create a new session (201)', async () => {
    const mockSession = {
      id: SESSION_ID,
      patientId: PATIENT_ID,
      status: 'started',
      startedAt: new Date().toISOString(),
      exerciseCount: 0,
    };

    mockPrisma.patient.findUnique.mockResolvedValueOnce({ id: PATIENT_ID });
    mockPrisma.session.findFirst.mockResolvedValueOnce(null); // no active session
    mockPrisma.session.create.mockResolvedValueOnce(mockSession);

    const res = await request(app)
      .post('/api/v1/sessions/start')
      .set('Authorization', `Bearer ${token}`)
      .send({ patientId: PATIENT_ID });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('started');
    expect(mockPrisma.session.create).toHaveBeenCalledTimes(1);
  });

  it('should return 404 when patient does not exist', async () => {
    mockPrisma.patient.findUnique.mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/api/v1/sessions/start')
      .set('Authorization', `Bearer ${token}`)
      .send({ patientId: PATIENT_ID });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('should return 409 when patient already has an active session', async () => {
    mockPrisma.patient.findUnique.mockResolvedValueOnce({ id: PATIENT_ID });
    mockPrisma.session.findFirst.mockResolvedValueOnce({
      id: 'active-session-id',
      status: 'started',
    });

    const res = await request(app)
      .post('/api/v1/sessions/start')
      .set('Authorization', `Bearer ${token}`)
      .send({ patientId: PATIENT_ID });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('should return 400 for an invalid patient UUID', async () => {
    const res = await request(app)
      .post('/api/v1/sessions/start')
      .set('Authorization', `Bearer ${token}`)
      .send({ patientId: 'not-a-uuid' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

// ---------------------------------------------------------------------------
// POST /api/v1/sessions/:id/complete
// ---------------------------------------------------------------------------
describe('POST /api/v1/sessions/:id/complete', () => {
  const token = generateTestToken({ role: 'caregiver' });

  it('should complete a session', async () => {
    const startedAt = new Date(Date.now() - 600_000); // 10 min ago

    mockPrisma.session.findUnique.mockResolvedValueOnce({
      id: SESSION_ID,
      patientId: PATIENT_ID,
      status: 'in_progress',
      startedAt,
      exerciseResults: [
        { domain: 'memory', score: 80, isCorrect: true, responseTimeMs: 2000, feedbackType: 'celebrated' },
      ],
    });
    mockPrisma.cognitiveScore.create.mockResolvedValueOnce({});
    mockPrisma.session.update.mockResolvedValueOnce({
      id: SESSION_ID,
      status: 'completed',
      completedAt: expect.any(Date),
      exerciseResults: [],
    });

    const res = await request(app)
      .post(`/api/v1/sessions/${SESSION_ID}/complete`)
      .set('Authorization', `Bearer ${token}`)
      .send({ notes: 'Patient did well today' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockPrisma.session.update).toHaveBeenCalledTimes(1);
  });

  it('should return 404 for a non-existent session', async () => {
    mockPrisma.session.findUnique.mockResolvedValueOnce(null);

    const res = await request(app)
      .post(`/api/v1/sessions/${SESSION_ID}/complete`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('should return 409 if session is already completed', async () => {
    mockPrisma.session.findUnique.mockResolvedValueOnce({
      id: SESSION_ID,
      status: 'completed',
      startedAt: new Date(),
      exerciseResults: [],
    });

    const res = await request(app)
      .post(`/api/v1/sessions/${SESSION_ID}/complete`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });
});

// ---------------------------------------------------------------------------
// GET /api/v1/sessions/history
// ---------------------------------------------------------------------------
describe('GET /api/v1/sessions/history', () => {
  const token = generateTestToken({ role: 'caregiver' });

  it('should return paginated session history', async () => {
    const mockSessions = [
      { id: SESSION_ID, patientId: PATIENT_ID, status: 'completed', exerciseResults: [] },
    ];

    mockPrisma.session.findMany.mockResolvedValueOnce(mockSessions);
    mockPrisma.session.count.mockResolvedValueOnce(1);

    const res = await request(app)
      .get('/api/v1/sessions/history')
      .set('Authorization', `Bearer ${token}`)
      .query({ patientId: PATIENT_ID });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toHaveProperty('totalCount');
    expect(res.body.meta).toHaveProperty('totalPages');
  });

  it('should return 400 when patientId query param is missing', async () => {
    const res = await request(app)
      .get('/api/v1/sessions/history')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
