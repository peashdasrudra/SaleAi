import prisma from '@/lib/db';
import { Priority } from '@prisma/client';
import { DEFAULT_SCORING_RULES, ScoringRule } from './scoring-rules';

export async function scoreProspect(prospectId: string, rules: ScoringRule[] = DEFAULT_SCORING_RULES) {
  const prospect = await prisma.prospect.findUnique({
    where: { id: prospectId },
    include: { evidences: true },
  });

  if (!prospect) {
    throw new Error(`Prospect with ID ${prospectId} not found`);
  }

  let totalScore = 0;
  const breakdown = [];
  const evidences = prospect.evidences || [];

  for (const rule of rules) {
    let matches = false;

    if (rule.evidenceType) {
      matches = evidences.some((e: any) => e.type === rule.evidenceType && (rule.requiresVerification ? e.isVerified : true));
    } else {
      switch (rule.id) {
        case 'has_email':
          matches = !!prospect.businessEmail;
          break;
        case 'has_phone':
          matches = !!prospect.publicBusinessPhone;
          break;
        case 'large_corp':
          matches = prospect.teamSize ? parseInt(prospect.teamSize, 10) > 50 : false;
          break;
        case 'disqualified':
          matches = ['DISQUALIFIED', 'UNSUBSCRIBED', 'BOUNCED'].includes(prospect.contactStatus || '');
          break;
      }
    }

    if (matches) {
      totalScore += rule.points;
      breakdown.push({
        prospectId,
        factor: rule.factor,
        points: rule.points,
        explanation: rule.category || rule.factor || 'Scoring rule applied',
      });
    }
  }

  totalScore = Math.max(0, Math.min(100, totalScore));

  let priority: Priority = 'C';
  if (totalScore >= 75) priority = 'A';
  else if (totalScore >= 55) priority = 'B';
  else if (totalScore < 30) priority = 'DISQUALIFIED';

  if (['DISQUALIFIED', 'UNSUBSCRIBED', 'BOUNCED'].includes(prospect.contactStatus || '')) {
    priority = 'DISQUALIFIED';
    totalScore = 0;
  }

  await prisma.$transaction([
    prisma.scoreBreakdown.deleteMany({
      where: { prospectId },
    }),
    ...(breakdown.length > 0
      ? [
          prisma.scoreBreakdown.createMany({
            data: breakdown,
          }),
        ]
      : []),
    prisma.prospect.update({
      where: { id: prospectId },
      data: { totalScore, priority },
    }),
  ]);

  return { totalScore, priority, breakdown };
}

export async function bulkScoreProspects(prospectIds: string[], rules: ScoringRule[] = DEFAULT_SCORING_RULES) {
  const results = [];
  for (const id of prospectIds) {
    try {
      results.push(await scoreProspect(id, rules));
    } catch (error) {
      console.error(`Failed to score prospect ${id}:`, error);
    }
  }
  return results;
}

export async function getScoreBreakdown(prospectId: string) {
  return prisma.scoreBreakdown.findMany({
    where: { prospectId },
    orderBy: { createdAt: 'desc' },
  });
}
