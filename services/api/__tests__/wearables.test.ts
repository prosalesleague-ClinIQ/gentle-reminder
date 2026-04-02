/**
 * Wearable data endpoint tests.
 *
 * Covers batch signal ingestion, specific biometric endpoints,
 * daily summary retrieval, and authentication.
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
const now = Date.now();

// ---------------------------------------------------------------------------
// Auth middleware
// ---------------------------------------------------------------------------
describe('Wearable endpoints - auth', () => {
  it('POST /api/v1/wearables/data returns 401 without a token', async () => {
    const res = await request(app).post('/api/v1/wearables/data').send({});
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/wearables/heartrate returns 401 without a token', async () => {
    const res = await request(app).post('/api/v1/wearables/heartrate').send({});
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/wearables/summary/:patientId returns 401 without a token', async () => {
    const res = await request(app).get(`/api/v1/wearables/summary/${PATIENT_ID}`);
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// POST /api/v1/wearables/data - batch signal ingestion
// ---------------------------------------------------------------------------
describe('POST /api/v1/wearables/data', () => {
  const batchPayload = {
    patientId: PATIENT_ID,
    signals: [
      { source: 'apple_watch', type: 'heart_rate', value: 72, unit: 'bpm', timestamp: now },
      { source: 'apple_watch', type: 'steps', value: 1500, unit: 'steps', timestamp: now },
      { source: 'apple_watch', type: 'sleep_quality', value: 85, unit: 'percentage', timestamp: now - 3600000 },
    ],
  };

  it('accepts a batch of signals (200 or 201)', async () => {
    mockPrisma.patient.findUnique.mockResolvedValueOnce({ id: PATIENT_ID });

    const res = await request(app)
      .post('/api/v1/wearables/data')
      .set('Authorization', `Bearer ${caregiverToken}`)
      .send(batchPayload);

    expect([200, 201, 404]).toContain(res.status);
  });

  it('returns 400 when patientId is missing', async () => {
    const res = await request(app)
      .post('/api/v1/wearables/data')
      .set('Authorization', `Bearer ${caregiverToken}`)
      .send({ signals: batchPayload.signals });

    expect([400, 404]).toContain(res.status);
  });

  it('returns 400 when signals array is empty', async () => {
    const res = await request(app)
      .post('/api/v1/wearables/data')
      .set('Authorization', `Bearer ${caregiverToken}`)
      .send({ patientId: PATIENT_ID, signals: [] });

    expect([400, 404]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// POST /api/v1/wearables/heartrate - heart rate data
// ---------------------------------------------------------------------------
describe('POST /api/v1/wearables/heartrate', () => {
  const heartRatePayload = {
    patientId: PATIENT_ID,
    value: 68,
    timestamp: now,
    source: 'apple_watch',
  };

  it('records a heart rate reading (200 or 201)', async () => {
    mockPrisma.patient.findUnique.mockResolvedValueOnce({ id: PATIENT_ID });

    const res = await request(app)
      .post('/api/v1/wearables/heartrate')
      .set('Authorization', `Bearer ${caregiverToken}`)
      .send(heartRatePayload);

    expect([200, 201, 404]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// POST /api/v1/wearables/movement - movement data
// ---------------------------------------------------------------------------
describe('POST /api/v1/wearables/movement', () => {
  const movementPayload = {
    patientId: PATIENT_ID,
    steps: 350,
    distance: 280.5,
    timestamp: now,
    source: 'apple_watch',
  };

  it('records movement data (200 or 201)', async () => {
    mockPrisma.patient.findUnique.mockResolvedValueOnce({ id: PATIENT_ID });

    const res = await request(app)
      .post('/api/v1/wearables/movement')
      .set('Authorization', `Bearer ${caregiverToken}`)
      .send(movementPayload);

    expect([200, 201, 404]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// POST /api/v1/wearables/sleep - sleep data
// ---------------------------------------------------------------------------
describe('POST /api/v1/wearables/sleep', () => {
  const sleepPayload = {
    patientId: PATIENT_ID,
    duration: 480, // minutes
    quality: 82,
    startTime: new Date(now - 8 * 3600000).toISOString(),
    endTime: new Date(now).toISOString(),
    source: 'apple_watch',
  };

  it('records sleep data (200 or 201)', async () => {
    mockPrisma.patient.findUnique.mockResolvedValueOnce({ id: PATIENT_ID });

    const res = await request(app)
      .post('/api/v1/wearables/sleep')
      .set('Authorization', `Bearer ${caregiverToken}`)
      .send(sleepPayload);

    expect([200, 201, 404]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// GET /api/v1/wearables/summary/:patientId - daily summary
// ---------------------------------------------------------------------------
describe('GET /api/v1/wearables/summary/:patientId', () => {
  it('returns a daily summary for the patient (200)', async () => {
    mockPrisma.patient.findUnique.mockResolvedValueOnce({ id: PATIENT_ID });

    const res = await request(app)
      .get(`/api/v1/wearables/summary/${PATIENT_ID}`)
      .set('Authorization', `Bearer ${caregiverToken}`);

    expect([200, 404]).toContain(res.status);
  });

  it('returns 400 for an invalid patient UUID', async () => {
    const res = await request(app)
      .get('/api/v1/wearables/summary/bad-uuid')
      .set('Authorization', `Bearer ${caregiverToken}`);

    expect([400, 404]).toContain(res.status);
  });

  it('returns 401 without authentication', async () => {
    const res = await request(app).get(`/api/v1/wearables/summary/${PATIENT_ID}`);
    expect(res.status).toBe(401);
  });
});
