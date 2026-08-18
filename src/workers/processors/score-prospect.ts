import { Job } from 'bullmq';
import { prisma } from '@/lib/db';
import { notificationQueue } from '../queues';

// Mock scoring engine
const scoringEngine = {
  scoreProspect: async (prospect: any) => {
    return Math.floor(Math.random() * 100);
  }
};

export default async function scoreProcessor(job: Job) {
  const { prospectId } = job.data;

  const prospect = await prisma.prospect.findUnique({
    where: { id: prospectId }
  });

  if (!prospect) {
    throw new Error(`Prospect not found: ${prospectId}`);
  }

  const score = await scoringEngine.scoreProspect(prospect);

  await prisma.prospect.update({
    where: { id: prospectId },
    data: { score }
  });

  if (score >= 80) { // A priority
    await notificationQueue.add('score-notification', {
      workspaceId: prospect.workspaceId,
      type: 'HIGH_SCORE',
      message: `Prospect ${prospect.email} achieved a high score of ${score}`,
      prospectId,
      channels: ['IN_APP']
    });
  }

  return { prospectId, score };
}
