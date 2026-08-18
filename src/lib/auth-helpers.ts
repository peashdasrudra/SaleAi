import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Not authenticated');
  }

  return session.user;
}

export async function requireWorkspace() {
  const user = await getCurrentUser();

  if (!user.workspaceId) {
    throw new Error('No workspace found for user');
  }

  return {
    userId: user.id,
    workspaceId: user.workspaceId,
  };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
