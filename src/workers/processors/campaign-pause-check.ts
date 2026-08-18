import { Job } from 'bullmq';
import { prisma } from '@/lib/db';
import { notificationQueue } from '../queues';

export default async function campaignPauseCheckProcessor(job: Job) {
  const runningCampaigns = await prisma.campaign.findMany({
    where: { status: 'RUNNING' }
  });

  let pausedCount = 0;

  for (const campaign of runningCampaigns) {
    const stats = await prisma.campaignStats.findUnique({
      where: { campaignId: campaign.id }
    });

    if (!stats || stats.sent === 0) continue;

    const bounceRate = stats.bounced / stats.sent;
    const complaintRate = stats.complained / stats.sent;

    if (bounceRate > 0.05 || complaintRate > 0.005) {
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { status: 'PAUSED' }
      });

      await notificationQueue.add('campaign-paused', {
        workspaceId: campaign.workspaceId,
        type: 'CAMPAIGN_PAUSED',
        message: `Campaign ${campaign.name} automatically paused due to high bounce/complaint rate`,
        channels: ['IN_APP', 'EMAIL']
      });

      await prisma.auditLog.create({
        data: {
          workspaceId: campaign.workspaceId,
          action: 'CAMPAIGN_AUTO_PAUSED',
          entityType: 'Campaign',
          entityId: campaign.id,
          details: { bounceRate, complaintRate }
        }
      });
      
      pausedCount++;
    }
  }

  return { pausedCount };
}
