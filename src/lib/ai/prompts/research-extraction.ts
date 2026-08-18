import { ResearchInput } from '../ai-interface';
import { z } from 'zod';

export const SYSTEM_PROMPT = `You are an expert web researcher. Extract business facts from webpage content. Look for: contact forms, booking links, instant acknowledgment, team size, active listings, recent reviews, service areas. Never fabricate — only extract what's visible.`;

export function generateResearchPrompt(input: ResearchInput): string {
  return `
Extract facts for the following company based on the content provided.

Company Name: ${input.companyName}
Website: ${input.website || 'N/A'}
Business Type: ${input.businessType || 'N/A'}

Page Content:
${input.pageContent || '(No content provided)'}
`;
}

export const ResearchOutputSchema = z.object({
  facts: z.array(z.object({
    type: z.string(),
    text: z.string(),
    confidence: z.number().min(0).max(1),
  })),
  summary: z.string(),
  suggestedEvidenceTypes: z.array(z.string()),
});
