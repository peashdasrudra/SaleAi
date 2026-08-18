'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function getWorkspaceId() {
  const cookieStore = await cookies();
  return cookieStore.get('workspace_id')?.value || 'default-workspace';
}

export async function getResearchQueue(filters?: { status?: string; country?: string; priority?: string }) {
  const workspaceId = await getWorkspaceId();
  
  const where: any = { workspaceId };
  
  if (filters?.status && filters.status !== 'all') {
    where.researchStatus = filters.status as any;
  } else {
    where.researchStatus = { in: ['NEW', 'QUEUED', 'IN_PROGRESS', 'REVIEW_REQUIRED'] };
  }

  if (filters?.country) where.country = filters.country;
  if (filters?.priority) where.priority = filters.priority;

  const prospects = await prisma.prospect.findMany({
    where,
    include: {
      evidences: {
        orderBy: { observedAt: 'desc' }
      }
    },
    orderBy: [
      { priority: 'desc' },
      { totalScore: 'desc' }
    ]
  });

  return prospects;
}

export async function addEvidence(data: { prospectId: string; type: string; text: string; url?: string; confidence: number }) {
  const workspaceId = await getWorkspaceId();
  
  const evidence = await prisma.prospectEvidence.create({
    data: {
      prospectId: data.prospectId,
      evidenceType: data.type as any,
      evidenceText: data.text,
      evidenceUrl: data.url,
      confidence: data.confidence,
      observedAt: new Date(),
      verifiedByUser: false
    }
  });
  
  revalidatePath('/research');
  return evidence;
}

export async function updateEvidence(id: string, data: { verified?: boolean; confidence?: number; text?: string }) {
  const workspaceId = await getWorkspaceId();
  
  const evidence = await prisma.prospectEvidence.update({
    where: { id },
    data: {
      verifiedByUser: data.verified,
      confidence: data.confidence,
      evidenceText: data.text,
    }
  });
  
  revalidatePath('/research');
  return evidence;
}

export async function deleteEvidence(id: string) {
  const workspaceId = await getWorkspaceId();
  
  await prisma.prospectEvidence.delete({
    where: { id }
  });
  
  revalidatePath('/research');
}

export async function updateResearchStatus(prospectId: string, status: string) {
  const workspaceId = await getWorkspaceId();
  
  await prisma.prospect.update({
    where: { id: prospectId, workspaceId },
    data: { researchStatus: status }
  });
  
  revalidatePath('/research');
}

export async function triggerScoring(prospectId: string) {
  const workspaceId = await getWorkspaceId();
  
  // Update status to queued
  await prisma.prospect.update({
    where: { id: prospectId, workspaceId },
    data: { researchStatus: 'QUEUED' }
  });
  
  // Add to background research queue
  const { researchQueue } = await import('@/workers/queues');
  await researchQueue.add('research-prospect', { prospectId });
  
  revalidatePath('/research');
}

export async function markDoNotContact(prospectId: string) {
  const workspaceId = await getWorkspaceId();
  
  await prisma.prospect.update({
    where: { id: prospectId, workspaceId },
    data: { doNotContact: true, researchStatus: 'COMPLETE' }
  });
  
  revalidatePath('/research');
}
