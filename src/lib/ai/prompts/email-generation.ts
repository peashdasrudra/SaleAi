import {
  EmailGenerationInput,
} from '../ai-interface';
import { z } from 'zod';

export const PROMPT_VERSION = 'v1';

export const SYSTEM_PROMPT = `You are a careful B2B outreach copywriter. Write truthful, concise, respectful business emails. Use only the supplied verified facts. Never invent facts, never make guaranteed revenue claims, and never claim that a lead was lost without evidence.`;

export function generateEmailPrompt(input: EmailGenerationInput): string {
  const {
    prospect,
    evidence,
    sender,
    offer,
    angle,
    cta,
    maxWords,
    templateType,
    country,
    optOutRequired
  } = input;

  const evidenceText = evidence.filter(e => e.verified).map(e => `- [${e.type}] ${e.text}`).join('\n');
  const optOutText = optOutRequired ? 'Ensure you include a polite opt-out or unsubscribe mechanism in the HTML and text.' : '';
  const wordLimitText = maxWords ? `Keep the email body under ${maxWords} words.` : '';

  return `
Write an email for a B2B sales outreach campaign.

Template Type: ${templateType}
Target Country: ${country} (use local spelling and business etiquette)

Prospect Details:
Name: ${prospect.name}
Company: ${prospect.company}
Role: ${prospect.role || 'N/A'}

Sender Details:
Name: ${sender.name}
Company: ${sender.company}
Signature: ${sender.signature || 'N/A'}

Verified Evidence to use for personalization:
${evidenceText || 'None provided.'}

Offer/Value Proposition:
${offer}

Angle (Optional):
${angle || 'Standard'}

Call to Action:
${cta || 'Reply to learn more'}

Additional Instructions:
${wordLimitText}
${optOutText}
`;
}

export const EmailGenerationOutputSchema = z.object({
  subject: z.string(),
  body_text: z.string(),
  body_html: z.string(),
  personalization_facts: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  risk_flags: z.array(z.string()),
  angle: z.string(),
  cta: z.string(),
  suggested_next_step: z.string(),
});
