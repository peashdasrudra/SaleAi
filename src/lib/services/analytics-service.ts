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
    prisma.emailMessage.count({ where: { workspaceId, createdAt: { gte: today }, type: 'SENT' } }),
    prisma.reply.count({ where: { workspaceId, createdAt: { gte: today } } }),
    prisma.reply.count({ where: { workspaceId, classification: 'HOT' } }),
    prisma.prospect.count({ where: { workspaceId, contactStatus: 'CONVERTED' } }),
    prisma.suppression.count({ where: { workspaceId, reason: 'UNSUBSCRIBE' } }),
    prisma.campaign.count({ where: { workspaceId, status: 'RUNNING' } }),
    prisma.emailMessage.count({ where: { workspaceId, type: 'SENT' } }),
    prisma.reply.count({ where: { workspaceId } }),
  ]);

  const bounceRate = totalEmailsSent > 0 ? (await prisma.emailMessage.count({ where: { workspaceId, type: 'BOUNCED' } }) / totalEmailsSent) * 100 : 0;
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

  return prisma.audit.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getCampaignAnalytics(workspaceId: string, campaignId?: string) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const whereClause = campaignId ? { workspaceId, campaignId } : { workspaceId };
  
  // Note: Depending on actual schema, these counts might come from aggregating emailMessages
  // For the sake of standard metrics:
  const stats = await prisma.emailMessage.groupBy({
    by: campaignId ? ['campaignId'] : ['campaignId'],
    where: whereClause,
    _count: {
      type: true, // We will filter by types if type is SENT, OPENED, etc.
    }
  });

  // A more realistic approach without knowing exact schema for emailMessage statuses:
  const [sent, delivered, opened, clicked, replied, bounced, complained] = await Promise.all([
    prisma.emailMessage.count({ where: { ...whereClause, type: 'SENT' } }),
    prisma.emailMessage.count({ where: { ...whereClause, type: 'DELIVERED' } }),
    prisma.emailMessage.count({ where: { ...whereClause, type: 'OPENED' } }),
    prisma.emailMessage.count({ where: { ...whereClause, type: 'CLICKED' } }),
    prisma.emailMessage.count({ where: { ...whereClause, type: 'REPLIED' } }),
    prisma.emailMessage.count({ where: { ...whereClause, type: 'BOUNCED' } }),
    prisma.emailMessage.count({ where: { ...whereClause, type: 'COMPLAINED' } }),
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
