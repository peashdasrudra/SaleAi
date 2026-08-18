import { Job } from 'bullmq';
import { prisma } from '@/lib/db';
import { notificationQueue } from '../queues';
import { DeliveryStatus, ContactStatus } from '@prisma/client';

export default async function webhookProcessor(job: Job) {
  const { eventType, messageId, email, timestamp, metadata } = job.data;

  const emailMessage = await prisma.emailMessage.findFirst({
    where: { providerMessageId: messageId },
    include: { prospect: true }
  });

  if (!emailMessage) {
    return { status: 'ignored', reason: 'Message not found' };
  }

  // Idempotency: if already processed this event type for this message, skip
  // (Simplified for now, would typically use an EventLog table)

  await prisma.emailMessage.update({
    where: { id: emailMessage.id },
    data: { deliveryStatus: eventType as DeliveryStatus } // OPENED, CLICKED, BOUNCED, etc.
  });

  if (eventType === 'BOUNCED' || eventType === 'COMPLAINED') {
    await prisma.prospect.update({
      where: { id: emailMessage.prospectId },
      data: { contactStatus: eventType === 'BOUNCED' ? 'BOUNCED' : 'UNSUBSCRIBED' }
    });

    await prisma.suppression.create({
      data: {
        workspaceId: emailMessage.prospect.workspaceId,
        email: emailMessage.prospect.businessEmail,
        reason: eventType === 'BOUNCED' ? 'HARD_BOUNCE' : 'COMPLAINT'
      }
    });

    await prisma.campaignProspect.updateMany({
      where: { prospectId: emailMessage.prospectId },
      data: { sequenceStatus: 'PAUSED' }
    });

    if (eventType === 'COMPLAINED') {
      await notificationQueue.add('complaint', {
        workspaceId: emailMessage.prospect.workspaceId,
        type: 'CAMPAIGN_ERROR',
        message: `Spam complaint from ${emailMessage.prospect.businessEmail}`,
        prospectId: emailMessage.prospectId,
        channels: ['IN_APP', 'EMAIL']
      });
    }
  }

  return { status: 'processed' };
}
