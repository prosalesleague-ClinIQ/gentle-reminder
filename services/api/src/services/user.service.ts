import { getDatabase } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getUserById(id: string) {
  const db = getDatabase();

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      profilePhotoUrl: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw AppError.notFound('User');
  }

  return user;
}

export async function updateUser(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    profilePhotoUrl?: string;
    isActive?: boolean;
  },
) {
  const db = getDatabase();

  const existing = await db.user.findUnique({ where: { id } });
  if (!existing) {
    throw AppError.notFound('User');
  }

  const user = await db.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      profilePhotoUrl: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}
