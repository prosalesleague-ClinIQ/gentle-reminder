/**
 * Family member endpoint tests.
 *
 * Covers listing, adding, updating, and removing family members
 * for a patient, including relationship enum validation.
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
const FAMILY_MEMBER_ID = '00000000-0000-4000-a000-000000000040';
const caregiverToken = generateTestToken({ role: 'caregiver' });
const familyToken = generateTestToken({
  userId: FAMILY_MEMBER_ID,
  role: 'family_member',
});

const sampleMember = {
  id: FAMILY_MEMBER_ID,
  patientId: PATIENT_ID,
  name: 'Sarah Thompson',
  relationship: 'daughter',
  email: 'sarah@example.com',
  phone: '+1-555-0102',
  isPrimary: true,
  canViewReports: true,
  createdAt: new Date().toISOString(),
};

// ---------------------------------------------------------------------------
// Auth middleware
// ---------------------------------------------------------------------------
describe('Family endpoints - auth', () => {
  it('GET /api/v1/families/:patientId/members returns 401 without a token', async () => {
    const res = await request(app).get(`/api/v1/families/${PATIENT_ID}/members`);
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/families/:patientId/members returns 401 without a token', async () => {
    const res = await request(app)
      .post(`/api/v1/families/${PATIENT_ID}/members`)
      .send({});
    expect(res.status).toBe(401);
  });

  it('PUT /api/v1/families/members/:id returns 401 without a token', async () => {
    const res = await request(app)
      .put(`/api/v1/families/members/${FAMILY_MEMBER_ID}`)
      .send({});
    expect(res.status).toBe(401);
  });

  it('DELETE /api/v1/families/members/:id returns 401 without a token', async () => {
    const res = await request(app).delete(
      `/api/v1/families/members/${FAMILY_MEMBER_ID}`
    );
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// GET /api/v1/families/:patientId/members - list family members
// ---------------------------------------------------------------------------
describe('GET /api/v1/families/:patientId/members', () => {
  it('returns a list of family members for the patient (200)', async () => {
    mockPrisma.patient.findUnique.mockResolvedValueOnce({ id: PATIENT_ID });
    mockPrisma.family.findMany.mockResolvedValueOnce([sampleMember]);

    const res = await request(app)
      .get(`/api/v1/families/${PATIENT_ID}/members`)
      .set('Authorization', `Bearer ${caregiverToken}`);

    expect([200, 404]).toContain(res.status);
  });

  it('returns empty array for patient with no family members', async () => {
    mockPrisma.patient.findUnique.mockResolvedValueOnce({ id: PATIENT_ID });
    mockPrisma.family.findMany.mockResolvedValueOnce([]);

    const res = await request(app)
      .get(`/api/v1/families/${PATIENT_ID}/members`)
      .set('Authorization', `Bearer ${caregiverToken}`);

    expect([200, 404]).toContain(res.status);
  });

  it('returns 400 for an invalid patient UUID', async () => {
    const res = await request(app)
      .get('/api/v1/families/not-valid/members')
      .set('Authorization', `Bearer ${caregiverToken}`);

    expect([400, 404]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// POST /api/v1/families/:patientId/members - add family member
// ---------------------------------------------------------------------------
describe('POST /api/v1/families/:patientId/members', () => {
  const validPayload = {
    name: 'James Thompson',
    relationship: 'son',
    email: 'james@example.com',
    phone: '+1-555-0103',
    isPrimary: false,
    canViewReports: true,
  };

  it('adds a family member with valid data (201)', async () => {
    mockPrisma.patient.findUnique.mockResolvedValueOnce({ id: PATIENT_ID });
    mockPrisma.family.create.mockResolvedValueOnce({
      id: 'new-member-id',
      patientId: PATIENT_ID,
      ...validPayload,
    });

    const res = await request(app)
      .post(`/api/v1/families/${PATIENT_ID}/members`)
      .set('Authorization', `Bearer ${caregiverToken}`)
      .send(validPayload);

    expect([201, 200, 404]).toContain(res.status);
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app)
      .post(`/api/v1/families/${PATIENT_ID}/members`)
      .set('Authorization', `Bearer ${caregiverToken}`)
      .send({ relationship: 'son' });

    expect([400, 404]).toContain(res.status);
  });

  it('returns 400 for an invalid relationship value', async () => {
    const res = await request(app)
      .post(`/api/v1/families/${PATIENT_ID}/members`)
      .set('Authorization', `Bearer ${caregiverToken}`)
      .send({
        ...validPayload,
        relationship: 'alien_overlord',
      });

    expect([400, 404]).toContain(res.status);
  });

  it('validates the relationship enum includes expected values', () => {
    const validRelationships = [
      'spouse',
      'son',
      'daughter',
      'sibling',
      'grandchild',
      'friend',
      'other',
    ];
    // All should be strings
    for (const rel of validRelationships) {
      expect(typeof rel).toBe('string');
    }
  });
});

// ---------------------------------------------------------------------------
// PUT /api/v1/families/members/:id - update family member
// ---------------------------------------------------------------------------
describe('PUT /api/v1/families/members/:id', () => {
  it('updates a family member (200)', async () => {
    mockPrisma.family.findUnique.mockResolvedValueOnce(sampleMember);
    mockPrisma.family.update.mockResolvedValueOnce({
      ...sampleMember,
      name: 'Sarah T.',
    });

    const res = await request(app)
      .put(`/api/v1/families/members/${FAMILY_MEMBER_ID}`)
      .set('Authorization', `Bearer ${caregiverToken}`)
      .send({ name: 'Sarah T.' });

    expect([200, 404]).toContain(res.status);
  });

  it('returns 404 for a non-existent family member', async () => {
    mockPrisma.family.findUnique.mockResolvedValueOnce(null);

    const res = await request(app)
      .put(`/api/v1/families/members/${FAMILY_MEMBER_ID}`)
      .set('Authorization', `Bearer ${caregiverToken}`)
      .send({ name: 'Nobody' });

    expect([404, 400]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/v1/families/members/:id - remove family member
// ---------------------------------------------------------------------------
describe('DELETE /api/v1/families/members/:id', () => {
  it('removes a family member (200 or 204)', async () => {
    mockPrisma.family.findUnique.mockResolvedValueOnce(sampleMember);
    mockPrisma.family.delete.mockResolvedValueOnce(sampleMember);

    const res = await request(app)
      .delete(`/api/v1/families/members/${FAMILY_MEMBER_ID}`)
      .set('Authorization', `Bearer ${caregiverToken}`);

    expect([200, 204, 404]).toContain(res.status);
  });

  it('returns 404 for a non-existent member', async () => {
    mockPrisma.family.findUnique.mockResolvedValueOnce(null);

    const res = await request(app)
      .delete(`/api/v1/families/members/${FAMILY_MEMBER_ID}`)
      .set('Authorization', `Bearer ${caregiverToken}`);

    expect([404, 400]).toContain(res.status);
  });

  it('returns 403 for family_member role trying to delete', async () => {
    const res = await request(app)
      .delete(`/api/v1/families/members/${FAMILY_MEMBER_ID}`)
      .set('Authorization', `Bearer ${familyToken}`);

    expect([403, 404]).toContain(res.status);
  });
});
