import request from 'supertest';
import bcrypt from 'bcryptjs';
import {
  mockPrisma,
  resetMocks,
  getApp,
  generateTestRefreshToken,
  TEST_JWT_SECRET,
  TEST_JWT_REFRESH_SECRET,
} from './setup';

// Mock bcryptjs so we never do real hashing in tests
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

let app: Express.Application;

beforeAll(async () => {
  app = await getApp() as any;
});

beforeEach(() => {
  resetMocks();
  (bcrypt.compare as jest.Mock).mockReset();
  (bcrypt.hash as jest.Mock).mockReset();
});

// ---------------------------------------------------------------------------
// POST /api/v1/auth/register
// ---------------------------------------------------------------------------
describe('POST /api/v1/auth/register', () => {
  const validPayload = {
    email: 'newuser@example.com',
    password: 'SecurePass1',
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'caregiver',
  };

  it('should create a new user and return tokens (201)', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce(null); // no existing user
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce('$2a$12$hashedpassword');
    mockPrisma.user.create.mockResolvedValueOnce({
      id: '00000000-0000-4000-a000-000000000099',
      email: 'newuser@example.com',
      role: 'caregiver',
      firstName: 'Jane',
      lastName: 'Doe',
      isActive: true,
    });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
    expect(res.body.data).toHaveProperty('expiresIn');
    expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
  });

  it('should return 409 if the email is already taken', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'existing-id',
      email: 'newuser@example.com',
    });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(validPayload);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('should return 400 for invalid payload (missing fields)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'bad' }); // missing most fields

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 400 for a weak password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validPayload, password: 'short' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

// ---------------------------------------------------------------------------
// POST /api/v1/auth/login
// ---------------------------------------------------------------------------
describe('POST /api/v1/auth/login', () => {
  const loginPayload = {
    email: 'test@example.com',
    password: 'ValidPass1',
  };

  const storedUser = {
    id: '00000000-0000-4000-a000-000000000001',
    email: 'test@example.com',
    passwordHash: '$2a$12$hashedpassword',
    role: 'caregiver',
    isActive: true,
  };

  it('should return tokens for valid credentials', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce(storedUser);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send(loginPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
    expect(res.body.data).toHaveProperty('expiresIn');
  });

  it('should return 401 for invalid email', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce(null); // user not found

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@example.com', password: 'ValidPass1' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return 401 for wrong password', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce(storedUser);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send(loginPayload);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return 401 for a deactivated account', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      ...storedUser,
      isActive: false,
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send(loginPayload);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 when email is missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ password: 'ValidPass1' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

// ---------------------------------------------------------------------------
// POST /api/v1/auth/refresh
// ---------------------------------------------------------------------------
describe('POST /api/v1/auth/refresh', () => {
  it('should return new tokens for a valid refresh token', async () => {
    const refreshToken = generateTestRefreshToken();

    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: '00000000-0000-4000-a000-000000000001',
      email: 'test@example.com',
      role: 'caregiver',
      isActive: true,
    });

    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
  });

  it('should return 401 for an invalid refresh token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: 'totally-invalid-token' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 when user is deactivated', async () => {
    const refreshToken = generateTestRefreshToken();

    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: '00000000-0000-4000-a000-000000000001',
      email: 'test@example.com',
      role: 'caregiver',
      isActive: false,
    });

    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 when refresh token is missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
