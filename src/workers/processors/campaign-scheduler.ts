import { Job } from 'bullmq';
import { prisma } from '@/lib/db';
import { emailSendQueue } from '../queues';
import { checkDailyLimit, checkDomainLimit } from '@/lib/scheduling/send-window';

export default async function campaignSchedulerProcessor(job: Job) {
  const now = new Date();

  const activeCampaigns = await prisma.campaign.findMany({
    where: { status: 'RUNNING' }
  });

  let processed = 0;

  for (const campaign of activeCampaigns) {
    const dueProspects = await prisma.campaignProspect.findMany({
      where: {
        campaignId: campaign.id,
        sequenceStatus: 'ACTIVE',
        nextSendAt: { lte: now }
      },
      include: { prospect: true },
      take: 100 // Batch limit
    });

    for (const cp of dueProspects) {
      // Check limits
      if (!await checkDailyLimit(campaign.workspaceId, campaign.id, now)) continue;
      const domain = (cp.prospect.businessEmail || '').split('@')[1];
      if (!await checkDomainLimit(campaign.workspaceId, domain, campaign.id, now)) continue;

      // Ensure we have a pending email to send, in reality we might generate it here if needed
      const pendingEmail = await prisma.emailMessage.findFirst({
        where: { campaignId: campaign.id, prospectId: cp.prospectId, deliveryStatus: 'QUEUED' },
        orderBy: { createdAt: 'asc' }
      });

      if (pendingEmail) {
        await emailSendQueue.add('send-email', {
          emailMessageId: pendingEmail.id,
          idempotencyKey: `send-${pendingEmail.id}`
        });

        // Update nextSendAt mock logic
        await prisma.campaignProspect.update({
          where: { id: cp.id },
          data: { nextSendAt: new Date(now.getTime() + 24 * 60 * 60 * 1000) } // Next day
        });

        processed++;
      }
    }
  }

  return { processed };
}
