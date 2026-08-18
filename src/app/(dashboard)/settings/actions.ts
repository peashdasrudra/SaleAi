'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function getWorkspaceSettings() {
  const cookieStore = await cookies();
  const workspaceId = cookieStore.get('workspace_id')?.value;
  if (!workspaceId) throw new Error('Workspace not found');

  const settings = await prisma.workspace.findUnique({
    where: { id: workspaceId }
  });

  return settings;
}

export async function updateWorkspaceSettings(data: any) {
  const cookieStore = await cookies();
  const workspaceId = cookieStore.get('workspace_id')?.value;
  if (!workspaceId) throw new Error('Workspace not found');

  await prisma.workspace.update({
    where: { id: workspaceId },
    data
  });

  revalidatePath('/settings');
}

export async function updateScoringRules(rules: any[]) {
  const cookieStore = await cookies();
  const workspaceId = cookieStore.get('workspace_id')?.value;
  if (!workspaceId) throw new Error('Workspace not found');

  await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      scoringRules: rules
    }
  });

  revalidatePath('/settings/scoring');
}
