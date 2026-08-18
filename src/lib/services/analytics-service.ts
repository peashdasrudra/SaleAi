import prisma from '@/lib/db';

export async function getDashboardStats(workspaceId: string) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const [
    totalProspects,
    priorityA,
    priorityB,
    priorityC,
    readyForReview,
    emailsAwaitingApproval,
    sentToday,
    repliesToday,
    hotLeads,
    meetingsBooked,
    optOuts,
    campaignsRunning,
    totalEmailsSent,
    totalReplies
  ] = await Promise.all([
    prisma.prospect.count({ where: { workspaceId } }),
    prisma.prospect.count({ where: { workspaceId, priority: 'A' } }),
    prisma.prospect.count({ where: { workspaceId, priority: 'B' } }),
    prisma.prospect.count({ where: { workspaceId, priority: 'C' } }),
    prisma.prospect.count({ where: { workspaceId, researchStatus: 'REVIEW_REQUIRED' } }),
    prisma.generatedEmail.count({ where: { prospect: { workspaceId }, approvalStatus: 'PENDING' } }),
    prisma.emailMessage.count({ where: { prospect: { workspaceId }, createdAt: { gte: today }, deliveryStatus: 'SENT' } }),
    prisma.reply.count({ where: { prospect: { workspaceId }, createdAt: { gte: today } } }),
    prisma.reply.count({ where: { prospect: { workspaceId }, classification: 'HOT' } }),
    prisma.prospect.count({ where: { workspaceId, contactStatus: 'CONVERTED' } }),
    prisma.suppression.count({ where: { workspaceId, reason: 'UNSUBSCRIBE' } }),
    prisma.campaign.count({ where: { workspaceId, status: 'RUNNING' } }),
    prisma.emailMessage.count({ where: { prospect: { workspaceId }, deliveryStatus: 'SENT' } }),
    prisma.reply.count({ where: { prospect: { workspaceId } } }),
  ]);

  const bounceRate = totalEmailsSent > 0 ? (await prisma.emailMessage.count({ where: { prospect: { workspaceId }, deliveryStatus: 'BOUNCED' } }) / totalEmailsSent) * 100 : 0;
  const replyRate = totalEmailsSent > 0 ? (totalReplies / totalEmailsSent) * 100 : 0;

  return {
    totalProspects,
    priorityA,
    priorityB,
    priorityC,
    readyForReview,
    emailsAwaitingApproval,
    sentToday,
    repliesToday,
    hotLeads,
    meetingsBooked,
    optOuts,
    bounceRate,
    replyRate,
    campaignsRunning,
  };
}

export async function getRecentActivity(workspaceId: string, limit: number = 10) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  return prisma.auditLog.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getCampaignAnalytics(workspaceId: string, campaignId?: string) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const whereClause = campaignId ? { prospect: { workspaceId }, campaignId } : { prospect: { workspaceId } };
  
  const stats = await prisma.emailMessage.groupBy({
    by: campaignId ? ['campaignId'] : ['campaignId'],
    where: whereClause,
    _count: {
      deliveryStatus: true,
    }
  });

  const [sent, delivered, opened, clicked, replied, bounced, complained] = await Promise.all([
    prisma.emailMessage.count({ where: { ...whereClause, deliveryStatus: 'SENT' } }),
    prisma.emailMessage.count({ where: { ...whereClause, deliveryStatus: 'DELIVERED' } }),
    prisma.emailMessage.count({ where: { ...whereClause, deliveryStatus: 'OPENED' } }),
    prisma.emailMessage.count({ where: { ...whereClause, deliveryStatus: 'CLICKED' } }),
    prisma.emailMessage.count({ where: { ...whereClause, replyStatus: 'REPLIED' } }),
    prisma.emailMessage.count({ where: { ...whereClause, deliveryStatus: 'BOUNCED' } }),
    prisma.emailMessage.count({ where: { ...whereClause, deliveryStatus: 'COMPLAINED' } }),
  ]);

  return {
    campaignId,
    stats: {
      sent,
      delivered,
      opened,
      clicked,
      replied,
      bounced,
      complained
    }
  };
}
