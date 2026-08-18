import prisma from '@/lib/db';
import { checkSuppression } from './suppression-service';

export interface CreateCampaignInput {
  name: string;
  description?: string;
  schedule?: any;
  settings?: any;
}

export async function createCampaign(workspaceId: string, data: CreateCampaignInput) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  return prisma.campaign.create({
    data: {
      ...data,
      workspaceId,
      status: 'DRAFT',
    },
  });
}

export async function getCampaigns(workspaceId: string, filters: any = {}) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const page = filters.page || 1;
  const pageSize = filters.pageSize || 50;
  const skip = (page - 1) * pageSize;

  const where: any = { workspaceId };
  if (filters.status) where.status = filters.status;

  const [campaigns, total] = await Promise.all([
    prisma.campaign.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { campaignProspects: true, emailMessages: true },
        },
      }
    }),
    prisma.campaign.count({ where }),
  ]);

  return {
    campaigns,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getCampaignById(workspaceId: string, id: string) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const campaign = await prisma.campaign.findUnique({
    where: { id, workspaceId },
    include: {
      campaignProspects: {
        include: { prospect: true },
      },
      emailMessages: {
        take: 50,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!campaign) throw new Error('Campaign not found');
  return campaign;
}

export async function updateCampaign(workspaceId: string, id: string, data: any) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const campaign = await prisma.campaign.findUnique({
    where: { id, workspaceId },
  });

  if (!campaign) throw new Error('Campaign not found');

  return prisma.campaign.update({
    where: { id },
    data,
  });
}

export async function launchCampaign(workspaceId: string, id: string) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const campaign = await prisma.campaign.findUnique({
    where: { id, workspaceId },
    include: {
      campaignProspects: {
        include: { prospect: true }
      }
    }
  });

  if (!campaign) throw new Error('Campaign not found');

  for (const cp of campaign.campaignProspects) {
    if (!cp.prospect.businessEmail) {
      throw new Error(`Prospect ${cp.prospect.id} has no email`);
    }

    const { suppressed } = await checkSuppression(workspaceId, cp.prospect.businessEmail);
    if (suppressed) {
      throw new Error(`Prospect email ${cp.prospect.businessEmail} is suppressed`);
    }
    
    // Add additional validation here for approved emails etc. if required by schema
  }

  return prisma.campaign.update({
    where: { id },
    data: { status: 'RUNNING' },
  });
}

export async function pauseCampaign(workspaceId: string, id: string, reason?: string) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const campaign = await prisma.campaign.findUnique({
    where: { id, workspaceId },
  });

  if (!campaign) throw new Error('Campaign not found');

  await prisma.campaignProspect.updateMany({
    where: { campaignId: id },
    data: { status: 'PAUSED' },
  });

  return prisma.campaign.update({
    where: { id },
    data: { status: 'PAUSED' }, // reason could be logged or stored if field exists
  });
}

export async function pauseAllCampaigns(workspaceId: string) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const runningCampaigns = await prisma.campaign.findMany({
    where: { workspaceId, status: 'RUNNING' }
  });

  for (const c of runningCampaigns) {
    await pauseCampaign(workspaceId, c.id, 'EMERGENCY_PAUSE');
  }

  return { pausedCount: runningCampaigns.length };
}

export async function resumeCampaign(workspaceId: string, id: string) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const campaign = await prisma.campaign.findUnique({
    where: { id, workspaceId },
  });

  if (!campaign) throw new Error('Campaign not found');
  if (campaign.status !== 'PAUSED') throw new Error('Campaign is not paused');

  await prisma.campaignProspect.updateMany({
    where: { campaignId: id, status: 'PAUSED' },
    data: { status: 'NOT_STARTED' }, // Or active status based on implementation
  });

  return prisma.campaign.update({
    where: { id },
    data: { status: 'RUNNING' },
  });
}

export async function addProspectsToCampaign(workspaceId: string, campaignId: string, prospectIds: string[]) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId, workspaceId } });
  if (!campaign) throw new Error('Campaign not found');

  const prospects = await prisma.prospect.findMany({
    where: { workspaceId, id: { in: prospectIds } }
  });

  const added: any[] = [];
  
  for (const prospect of prospects) {
    if (prospect.businessEmail) {
      const { suppressed } = await checkSuppression(workspaceId, prospect.businessEmail);
      if (!suppressed) {
        const cp = await prisma.campaignProspect.create({
          data: {
            campaignId,
            prospectId: prospect.id,
            status: 'NOT_STARTED',
          }
        });
        added.push(cp);
      }
    }
  }

  return added;
}

export async function removeProspectFromCampaign(workspaceId: string, campaignId: string, prospectId: string) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId, workspaceId } });
  if (!campaign) throw new Error('Campaign not found');

  return prisma.campaignProspect.deleteMany({
    where: {
      campaignId,
      prospectId,
    }
  });
}
