import { Job } from 'bullmq';
import { prisma } from '@/lib/db';
import { notificationQueue } from '../queues';
import { OpenAIProvider } from '@/lib/ai/openai-provider';
import { fetchWebPageText } from '@/lib/ai/fetch-web';

const aiProvider = new OpenAIProvider();

export default async function researchProcessor(job: Job) {
  const { prospectId } = job.data;

  const prospect = await prisma.prospect.findUnique({
    where: { id: prospectId }
  });

  if (!prospect) {
    throw new Error(`Prospect not found: ${prospectId}`);
  }

  // Update status to IN_PROGRESS
  await prisma.prospect.update({
    where: { id: prospectId },
    data: { researchStatus: 'IN_PROGRESS' }
  });

  let pageContent = '';
  if (prospect.website) {
    const text = await fetchWebPageText(prospect.website);
    if (text) pageContent = text;
  }

  const result = await aiProvider.extractResearchFacts({
    companyName: prospect.companyName,
    website: prospect.website || undefined,
    businessType: prospect.businessType || undefined,
    pageContent
  });

  // Calculate score based on evidence confidence
  let totalScore = 0;
  
  // Save evidence
  for (const fact of result.facts) {
    await prisma.prospectEvidence.create({
      data: {
        prospectId,
        evidenceType: fact.type.toUpperCase().substring(0, 50) as any,
        evidenceText: fact.text,
        confidence: fact.confidence,
        observedAt: new Date(),
        verifiedByUser: false
      }
    });
    totalScore += Math.floor(fact.confidence / 2); // Simple scoring mechanic
  }
  
  // Cap score at 100
  totalScore = Math.min(100, Math.max(0, totalScore));

  await prisma.prospect.update({
    where: { id: prospectId },
    data: { 
      totalScore,
      researchStatus: 'COMPLETE'
    }
  });

  // Check if we need to notify
  if (totalScore >= 80) {
    await notificationQueue.add('score-notification', {
      workspaceId: prospect.workspaceId,
      type: 'HOT_LEAD',
      message: `Research complete: ${prospect.companyName} achieved a high score of ${totalScore}`,
      prospectId,
      channels: ['IN_APP']
    });
  }

  return { prospectId, totalScore, factsCount: result.facts.length };
}
