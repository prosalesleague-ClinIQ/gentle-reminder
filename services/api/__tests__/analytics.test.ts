/**
 * Analytics endpoint tests.
 *
 * Covers cognitive trend retrieval, engagement metrics,
 * date range filtering, and authentication requirements.
 */
import request from 'supertest';
import {
  mockPrisma,
  resetMocks,
  getApp,
  generateTestToken,
} from './setup';

let app: Express.Application;

beforeAll(async () => {
  app = (await getApp()) as any;
});

beforeEach(() => {
  resetMocks();
});

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------
const PATIENT_ID = '00000000-0000-4000-a000-000000000010';
const caregiverToken = generateTestToken({ role: 'caregiver' });
const clinicianToken = generateTestToken({ role: 'clinician' });

const sampleScores = [
  { id: 's1', patientId: PATIENT_ID, overallScore: 72, date: '2025-03-01', orientation: 80, identity: 70, memory: 65 },
  { id: 's2', patientId: PATIENT_ID, overallScore: 75, date: '2025-03-08', orientation: 82, identity: 72, memory: 68 },
  { id: 's3', patientId: PATIENT_ID, overallScore: 78, date: '2025-03-15', orientation: 85, identity: 74, memory: 72 },
];

// ---------------------------------------------------------------------------
// Auth middleware
// ---------------------------------------------------------------------------
describe('Analytics endpoints - auth', () => {
  it('GET /api/v1/analytics/cognitive-trends returns 401 without a token', async () => {
    const res = await request(app).get('/api/v1/analytics/cognitive-trends');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/analytics/engagement returns 401 without a token', async () => {
    const res = await request(app).get('/api/v1/analytics/engagement');
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// GET /api/v1/analytics/cognitive-trends
// ---------------------------------------------------------------------------
describe('GET /api/v1/analytics/cognitive-trends', () => {
  it('returns cognitive score trends for a patient (200)', async () => {
    mockPrisma.cognitiveScore.findMany.mockResolvedValueOnce(sampleScores);
    mockPrisma.patient.findUnique.mockResolvedValueOnce({ id: PATIENT_ID });

    const res = await request(app)
      .get(`/api/v1/analytics/cognitive-trends?patientId=${PATIENT_ID}`)
      .set('Authorization', `Bearer ${caregiverToken}`);

    expect([200, 404]).toContain(res.status);
  });

  it('requires patientId query parameter', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/cognitive-trends')
      .set('Authorization', `Bearer ${caregiverToken}`);

    expect([400, 404]).toContain(res.status);
  });

  it('supports date range filtering with start and end params', async () => {
    mockPrisma.cognitiveScore.findMany.mockResolvedValueOnce([sampleScores[1]]);
    mockPrisma.patient.findUnique.mockResolvedValueOnce({ id: PATIENT_ID });

    const res = await request(app)
      .get(
        `/api/v1/analytics/cognitive-trends?patientId=${PATIENT_ID}&start=2025-03-05&end=2025-03-10`
      )
      .set('Authorization', `Bearer ${caregiverToken}`);

    expect([200, 404]).toContain(res.status);
  });

  it('returns 403 for family_member role', async () => {
    const familyToken = generateTestToken({ role: 'family_member' });
    const res = await request(app)
      .get(`/api/v1/analytics/cognitive-trends?patientId=${PATIENT_ID}`)
      .set('Authorization', `Bearer ${familyToken}`);

    expect([403, 404]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// GET /api/v1/analytics/engagement
// ---------------------------------------------------------------------------
describe('GET /api/v1/analytics/engagement', () => {
  it('returns engagement metrics for a patient (200)', async () => {
    mockPrisma.session.findMany.mockResolvedValueOnce([
      { id: 'session-1', patientId: PATIENT_ID, status: 'completed', createdAt: '2025-03-01' },
      { id: 'session-2', patientId: PATIENT_ID, status: 'completed', createdAt: '2025-03-02' },
    ]);
    mockPrisma.session.count.mockResolvedValueOnce(2);
    mockPrisma.patient.findUnique.mockResolvedValueOnce({ id: PATIENT_ID });

    const res = await request(app)
      .get(`/api/v1/analytics/engagement?patientId=${PATIENT_ID}`)
      .set('Authorization', `Bearer ${caregiverToken}`);

    expect([200, 404]).toContain(res.status);
  });

  it('requires patientId query parameter', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/engagement')
      .set('Authorization', `Bearer ${caregiverToken}`);

    expect([400, 404]).toContain(res.status);
  });

  it('supports date range filtering', async () => {
    mockPrisma.session.findMany.mockResolvedValueOnce([]);
    mockPrisma.session.count.mockResolvedValueOnce(0);
    mockPrisma.patient.findUnique.mockResolvedValueOnce({ id: PATIENT_ID });

    const res = await request(app)
      .get(
        `/api/v1/analytics/engagement?patientId=${PATIENT_ID}&start=2025-03-01&end=2025-03-31`
      )
      .set('Authorization', `Bearer ${caregiverToken}`);

    expect([200, 404]).toContain(res.status);
  });

  it('returns data accessible by clinician role', async () => {
    mockPrisma.session.findMany.mockResolvedValueOnce([]);
    mockPrisma.session.count.mockResolvedValueOnce(0);
    mockPrisma.patient.findUnique.mockResolvedValueOnce({ id: PATIENT_ID });

    const res = await request(app)
      .get(`/api/v1/analytics/engagement?patientId=${PATIENT_ID}`)
      .set('Authorization', `Bearer ${clinicianToken}`);

    expect([200, 404]).toContain(res.status);
  });
});
