'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function getSuppressions(page: number, pageSize: number, search?: string) {
  const cookieStore = await cookies();
  const workspaceId = cookieStore.get('workspace_id')?.value;
  if (!workspaceId) throw new Error('Workspace not found');

  const skip = (page - 1) * pageSize;
  const where: any = { workspaceId };
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { domain: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [items, total] = await Promise.all([
    prisma.suppression.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.suppression.count({ where })
  ]);

  return { items, total };
}

export async function addSuppression(data: { email?: string, domain?: string, reason: string, source: string }) {
  const cookieStore = await cookies();
  const workspaceId = cookieStore.get('workspace_id')?.value;
  if (!workspaceId) throw new Error('Workspace not found');

  await prisma.suppression.create({
    data: {
      ...data,
      workspaceId
    }
  });

  revalidatePath('/suppression');
}

export async function deleteSuppression(id: string) {
  const cookieStore = await cookies();
  const workspaceId = cookieStore.get('workspace_id')?.value;
  if (!workspaceId) throw new Error('Workspace not found');

  await prisma.suppression.delete({
    where: { id, workspaceId }
  });

  revalidatePath('/suppression');
}

export async function bulkDeleteSuppressions(ids: string[]) {
  const cookieStore = await cookies();
  const workspaceId = cookieStore.get('workspace_id')?.value;
  if (!workspaceId) throw new Error('Workspace not found');

  await prisma.suppression.deleteMany({
    where: { id: { in: ids }, workspaceId }
  });

  revalidatePath('/suppression');
}
