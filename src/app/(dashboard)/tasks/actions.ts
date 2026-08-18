'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function getWorkspaceId() {
  const cookieStore = await cookies();
  return cookieStore.get('workspace_id')?.value || 'default-workspace';
}

export async function getTasks(filters?: { status?: string; priority?: string }) {
  const workspaceId = await getWorkspaceId();
  
  const where: any = { workspaceId };
  if (filters?.status) where.status = filters.status as any;
  if (filters?.priority) where.priority = filters.priority;

  const tasks = await prisma.task.findMany({
    where,
    include: {
      prospect: {
        select: { id: true, companyName: true, contactFullName: true }
      }
    },
    orderBy: [
      { dueAt: 'asc' },
      { createdAt: 'desc' }
    ],
    take: 50
  });

  return tasks;
}

export async function createTask(data: { title: string; description?: string; priority: string; dueDate: Date; prospectId?: string }) {
  const workspaceId = await getWorkspaceId();
  
  const task = await prisma.task.create({
    data: {
      ...data,
      workspaceId,
      status: 'OPEN'
    }
  });
  
  revalidatePath('/tasks');
  return task;
}

export async function updateTask(id: string, data: { status?: string; priority?: string; dueDate?: Date; title?: string; description?: string }) {
  const workspaceId = await getWorkspaceId();
  
  const task = await prisma.task.update({
    where: { id, workspaceId },
    data: data as any
  });
  
  revalidatePath('/tasks');
  return task;
}

export async function deleteTask(id: string) {
  const workspaceId = await getWorkspaceId();
  
  await prisma.task.delete({
    where: { id, workspaceId }
  });
  
  revalidatePath('/tasks');
}
