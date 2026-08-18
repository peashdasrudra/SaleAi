import { Job } from 'bullmq';
import { prisma } from '@/lib/db';
import { notificationQueue } from '../queues';

export default async function campaignPauseCheckProcessor(job: Job) {
  const runningCampaigns = await prisma.campaign.findMany({
    where: { status: 'RUNNING' }
  });

  let pausedCount = 0;

  for (const campaign of runningCampaigns) {
    const sent = await prisma.emailMessage.count({ where: { campaignId: campaign.id, deliveryStatus: 'SENT' } });
    if (sent === 0) continue;

    const bounced = await prisma.emailMessage.count({ where: { campaignId: campaign.id, deliveryStatus: 'BOUNCED' } });
    const complained = await prisma.emailMessage.count({ where: { campaignId: campaign.id, deliveryStatus: 'COMPLAINED' } });

    const bounceRate = bounced / sent;
    const complaintRate = complained / sent;

    if (bounceRate > 0.05 || complaintRate > 0.005) {
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { status: 'PAUSED' }
      });

      await notificationQueue.add('campaign-paused', {
        workspaceId: campaign.workspaceId,
        type: 'CAMPAIGN_ERROR',
        message: `Campaign ${campaign.name} automatically paused due to high bounce/complaint rate`,
        channels: ['IN_APP', 'EMAIL']
      });

      await prisma.auditLog.create({
        data: {
          workspaceId: campaign.workspaceId,
          action: 'CAMPAIGN_AUTO_PAUSED',
          entityType: 'Campaign',
          entityId: campaign.id,
          metadata: { bounceRate, complaintRate }
        }
      });
      
      pausedCount++;
    }
  }

  return { pausedCount };
}
