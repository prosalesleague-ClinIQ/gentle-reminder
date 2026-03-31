import bcrypt from 'bcryptjs';
import { generateTokenPair, verifyRefreshToken } from '@gentle-reminder/auth';
import type { TokenPair } from '@gentle-reminder/auth';
import { getDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import type { UserRole } from '@gentle-reminder/shared-types';
import { UserRole as PrismaUserRole } from '@prisma/client';

const BCRYPT_ROUNDS = 12;

export async function login(email: string, password: string): Promise<TokenPair> {
  const db = getDatabase();

  const user = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw AppError.unauthorized('Invalid email or password');
  }

  if (!user.isActive) {
    throw AppError.unauthorized('Account is deactivated');
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) {
    throw AppError.unauthorized('Invalid email or password');
  }

  return generateTokenPair(
    {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    },
    env.jwtSecret,
    env.jwtRefreshSecret,
  );
}

export async function register(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}): Promise<TokenPair> {
  const db = getDatabase();

  const existingUser = await db.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (existingUser) {
    throw AppError.conflict('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const user = await db.user.create({
    data: {
      email: input.email.toLowerCase(),
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role as PrismaUserRole,
      isActive: true,
    },
  });

  return generateTokenPair(
    {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    },
    env.jwtSecret,
    env.jwtRefreshSecret,
  );
}

export async function refreshToken(token: string): Promise<TokenPair> {
  let payload;
  try {
    payload = verifyRefreshToken(token, env.jwtRefreshSecret);
  } catch {
    throw AppError.unauthorized('Invalid or expired refresh token');
  }

  const db = getDatabase();
  const user = await db.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user || !user.isActive) {
    throw AppError.unauthorized('User not found or deactivated');
  }

  return generateTokenPair(
    {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    },
    env.jwtSecret,
    env.jwtRefreshSecret,
  );
}
