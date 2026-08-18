'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function getWorkspaceId() {
  const cookieStore = await cookies();
  return cookieStore.get('workspace_id')?.value || 'default-workspace';
}

export async function getNotifications(filters?: { type?: string }) {
  const workspaceId = await getWorkspaceId();
  
  const where: any = { workspaceId };
  if (filters?.type) where.type = filters.type;

  const notifications = await prisma.notification.findMany({
    where,
    include: {
      prospect: {
        select: { id: true, name: true, companyName: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return notifications;
}

export async function markAsRead(id: string) {
  const workspaceId = await getWorkspaceId();
  
  await prisma.notification.update({
    where: { id, workspaceId },
    data: { read: true }
  });
  
  revalidatePath('/notifications');
}

export async function markAllAsRead() {
  const workspaceId = await getWorkspaceId();
  
  await prisma.notification.updateMany({
    where: { workspaceId, read: false },
    data: { read: true }
  });
  
  revalidatePath('/notifications');
}

export async function deleteNotification(id: string) {
  const workspaceId = await getWorkspaceId();
  
  await prisma.notification.delete({
    where: { id, workspaceId }
  });
  
  revalidatePath('/notifications');
}
