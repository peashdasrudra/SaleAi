import { Job } from 'bullmq';
import { prisma } from '@/lib/db';

export default async function notificationProcessor(job: Job) {
  const { workspaceId, type, message, prospectId, replyId, channels } = job.data;

  const notification = await prisma.notification.create({
    data: {
      workspaceId,
      type,
      message,
      prospectId,
      replyId,
      status: 'PENDING'
    }
  });

  for (const channel of channels) {
    try {
      if (channel === 'IN_APP') {
        // Already created in DB
      } else if (channel === 'EMAIL') {
        // Mock email send
      } else if (channel === 'TELEGRAM') {
        // Mock telegram
      } else if (channel === 'SLACK') {
        // Mock slack
      }
    } catch (e) {
      console.error(`Failed to send notification via ${channel}`, e);
    }
  }

  await prisma.notification.update({
    where: { id: notification.id },
    data: { status: 'SENT', sentAt: new Date() }
  });

  return { success: true };
}
