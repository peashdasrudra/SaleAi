'use server';

import { z } from 'zod';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth-helpers';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function registerUser(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = registerSchema.safeParse(rawData);

    if (!validatedData.success) {
      return { error: 'Invalid input data' };
    }

    const { name, email, password } = validatedData.data;
    const lowerEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: lowerEmail },
    });

    if (existingUser) {
      return { error: 'A user with this email already exists' };
    }

    const passwordHash = await hashPassword(password);

    // Create user and default workspace in a transaction
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email: lowerEmail,
          passwordHash,
        },
      });

      await tx.workspace.create({
        data: {
          name: `${name}'s Workspace`,
          ownerId: user.id,
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Failed to register user. Please try again later.' };
  }
}
