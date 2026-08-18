import { Job } from 'bullmq';
import { prisma } from '@/lib/db';
import { checkDailyLimit, checkDomainLimit } from '@/lib/scheduling/send-window';
import { getProspectTimezone, isWithinSendingWindow } from '@/lib/scheduling/timezone-utils';
import { createEmailProvider } from '@/lib/email/email-factory';

const emailProvider = createEmailProvider();

export default async function sendEmailProcessor(job: Job) {
  const { emailMessageId, idempotencyKey } = job.data;

  // Simple idempotency check via DB
  const existing = await prisma.emailMessage.findUnique({
    where: { id: emailMessageId }
  });

  if (!existing || existing.deliveryStatus !== 'QUEUED') {
    return { status: 'skipped', reason: 'Already sent or not pending' };
  }

  const emailMessage = await prisma.emailMessage.findUnique({
    where: { id: emailMessageId },
    include: {
      prospect: { include: { workspace: true } },
      campaign: true
    }
  });

  if (!emailMessage || !emailMessage.campaign) throw new Error('Email message or campaign not found');

  const { prospect, campaign } = emailMessage;
  const workspace = prospect.workspace;
  
  // Suppression check
  const suppressed = await prisma.suppression.findFirst({
    where: { workspaceId: workspace.id, email: prospect.businessEmail }
  });

  if (suppressed) {
    await prisma.emailMessage.update({
      where: { id: emailMessageId },
      data: { deliveryStatus: 'FAILED' }
    });
    return { status: 'failed', reason: 'Suppressed' };
  }

  // Limits
  const now = new Date();
  if (!await checkDailyLimit(workspace.id, campaign.id, now)) {
    throw new Error('Daily limit reached');
  }

  const domain = (prospect.businessEmail || '').split('@')[1];
  if (!await checkDomainLimit(workspace.id, domain, campaign.id, now)) {
    throw new Error('Domain limit reached');
  }

  // Send
  try {
    const result = await emailProvider.send({
      from: workspace.companyEmail || process.env.RESEND_FROM_EMAIL || 'hello@example.com',
      to: prospect.businessEmail!,
      subject: (emailMessage as any).subject || 'Email',
      html: (emailMessage as any).bodyHtml || '',
      text: (emailMessage as any).bodyText || '',
      replyTo: workspace.companyEmail || undefined
    });

    if (!result.success || !result.messageId) {
      throw new Error(`Provider failed: ${result.error}`);
    }

    const providerMessageId = result.messageId;

    await prisma.emailMessage.update({
      where: { id: emailMessageId },
      data: {
        providerMessageId,
        sentAt: now,
        deliveryStatus: 'SENT'
      }
    });

    await prisma.campaignProspect.update({
      where: { campaignId_prospectId: { campaignId: campaign.id, prospectId: prospect.id } },
      data: { lastSentAt: now }
    });

    await prisma.auditLog.create({
      data: {
        workspaceId: workspace.id,
        action: 'EMAIL_SENT',
        entityType: 'EmailMessage',
        entityId: emailMessageId,
        metadata: { providerMessageId }
      }
    });

    return { status: 'sent', providerMessageId };

  } catch (error: any) {
    await prisma.emailMessage.update({
      where: { id: emailMessageId },
      data: { deliveryStatus: 'FAILED' }
    });
    throw error;
  }
}
