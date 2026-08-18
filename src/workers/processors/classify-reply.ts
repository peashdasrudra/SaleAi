import { Job } from 'bullmq';
import { prisma } from '@/lib/db';
import { notificationQueue } from '../queues';

// Mock classifier
const classifier = {
  classify: async (text: string) => {
    return { classification: 'HOT', sentiment: 'POSITIVE', confidence: 0.9 };
  }
};

const scores: Record<string, number> = {
  HOT: 20, WARM: 10, CURIOUS: 5, NEUTRAL: 0, OBJECTION: -5, NOT_INTERESTED: -15, UNSUBSCRIBE: -30
};

export default async function classifyReplyProcessor(job: Job) {
  const { replyId } = job.data;

  const reply = await prisma.reply.findUnique({
    where: { id: replyId },
    include: { prospect: true }
  });

  if (!reply) throw new Error('Reply not found');

  const { classification, sentiment, confidence } = await classifier.classify(reply.body);

  await prisma.reply.update({
    where: { id: replyId },
    data: { classification, sentiment, confidence }
  });

  await prisma.prospect.update({
    where: { id: reply.prospectId },
    data: { 
      status: 'REPLIED',
      score: { increment: scores[classification] || 0 }
    }
  });

  await prisma.campaignProspect.updateMany({
    where: { prospectId: reply.prospectId },
    data: { status: 'PAUSED' }
  });

  if (['HOT', 'WARM'].includes(classification)) {
    await notificationQueue.add('hot-reply', {
      workspaceId: reply.workspaceId,
      type: 'HOT_REPLY',
      message: `${classification} reply from ${reply.prospect.email}`,
      prospectId: reply.prospectId,
      replyId,
      channels: ['IN_APP', 'SLACK']
    });

    await prisma.task.create({
      data: {
        workspaceId: reply.workspaceId,
        prospectId: reply.prospectId,
        title: `Reply personally within 15 minutes to ${reply.prospect.email}`,
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 15 * 60 * 1000)
      }
    });
  }

  return { classification };
}
