import { Job } from 'bullmq';
import { prisma } from '@/lib/db';
import { notificationQueue } from '../queues';

// Mock AI provider
const aiProvider = {
  generateEmail: async (data: any) => {
    return { subject: 'Hello!', body: 'Buy my product.', riskLevel: 'LOW' };
  }
};

export default async function generateEmailProcessor(job: Job) {
  const { prospectId, campaignId, templateType, offer, angle } = job.data;

  const prospect = await prisma.prospect.findUnique({
    where: { id: prospectId },
    include: { workspace: true }
  });

  if (!prospect) {
    throw new Error(`Prospect not found: ${prospectId}`);
  }

  const result = await aiProvider.generateEmail({
    prospect,
    templateType,
    offer,
    angle,
    senderInfo: prospect.workspace
  });

  const generatedEmail = await prisma.generatedEmail.create({
    data: {
      prospectId,
      campaignId,
      subject: result.subject,
      bodyHtml: result.body,
      bodyText: result.body,
      approvalStatus: 'PENDING',
      riskFlags: [result.riskLevel]
    }
  });

  if (result.riskLevel === 'HIGH') {
    await notificationQueue.add('email-approval-needed', {
      workspaceId: prospect.workspaceId,
      type: 'CAMPAIGN_ERROR',
      message: `High risk email generated for ${prospect.businessEmail}, requires approval`,
      prospectId,
      channels: ['IN_APP', 'EMAIL']
    });
  }

  return { generatedEmailId: generatedEmail.id };
}
