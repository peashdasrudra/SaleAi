import { Job } from 'bullmq';
import { prisma } from '@/lib/db';
import { notificationQueue } from '../queues';

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
    data: { deliveryStatus: eventType } // OPENED, CLICKED, BOUNCED, etc.
  });

  if (eventType === 'BOUNCED' || eventType === 'COMPLAINED') {
    await prisma.prospect.update({
      where: { id: emailMessage.prospectId },
      data: { status: eventType === 'BOUNCED' ? 'BOUNCED' : 'UNSUBSCRIBED' }
    });

    await prisma.suppressionList.create({
      data: {
        workspaceId: emailMessage.workspaceId,
        email: emailMessage.prospect.email,
        reason: eventType
      }
    });

    await prisma.campaignProspect.updateMany({
      where: { prospectId: emailMessage.prospectId },
      data: { status: 'PAUSED' }
    });

    if (eventType === 'COMPLAINED') {
      await notificationQueue.add('complaint', {
        workspaceId: emailMessage.workspaceId,
        type: 'COMPLAINT',
        message: `Spam complaint from ${emailMessage.prospect.email}`,
        prospectId: emailMessage.prospectId,
        channels: ['IN_APP', 'EMAIL']
      });
    }
  }

  return { status: 'processed' };
}
