'use server';

import { revalidatePath } from 'next/cache';

// Mock implementations for brevity

export async function getCampaigns(filters?: { status?: string }) {
  return [
    {
      id: 'camp_1',
      name: 'Q3 Enterprise Tech Directors',
      targetCountry: 'US',
      status: 'RUNNING',
      offer: 'Free AI assessment for tech teams',
      prospectCount: 150,
      sentCount: 45,
      repliedCount: 3,
      createdAt: new Date().toISOString(),
    }
  ];
}

export async function getCampaignById(id: string) {
  return {
    id,
    name: 'Q3 Enterprise Tech Directors',
    status: 'RUNNING',
    createdAt: new Date().toISOString(),
    stats: {
      prospects: 150,
      sent: 45,
      delivered: 44,
      opened: 30,
      clicked: 12,
      replied: 3,
    }
  };
}

export async function createCampaign(data: any) {
  // await prisma.campaign.create({ ... })
  revalidatePath('/campaigns');
  return { success: true, id: 'camp_new' };
}

export async function updateCampaign(id: string, data: any) {
  revalidatePath(`/campaigns/${id}`);
  return { success: true };
}

export async function launchCampaign(id: string) {
  // compliance check
  // set status to RUNNING
  revalidatePath(`/campaigns/${id}`);
  revalidatePath('/campaigns');
}

export async function pauseCampaign(id: string) {
  revalidatePath(`/campaigns/${id}`);
  revalidatePath('/campaigns');
}

export async function resumeCampaign(id: string) {
  revalidatePath(`/campaigns/${id}`);
  revalidatePath('/campaigns');
}

export async function pauseAllCampaigns() {
  revalidatePath('/campaigns');
}

export async function addProspectsToCampaign(campaignId: string, prospectIds: string[]) {
  revalidatePath(`/campaigns/${campaignId}`);
}

export async function previewCampaignEmail(campaignId: string, prospectId: string) {
  // generate sample email
  return { subject: 'Sample Subject', bodyHtml: '<p>Sample Body</p>' };
}
