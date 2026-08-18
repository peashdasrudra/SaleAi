import { RiskCheckInput, RiskCheckOutput } from '../ai-interface';
import { z } from 'zod';

export const SYSTEM_PROMPT = `You are an email compliance reviewer. Check outgoing B2B sales emails for risk factors. Review for:
- Invented facts
- Unsupported response-time claims
- Unsupported revenue claims
- False urgency
- Aggressive wording
- Missing sender identity
- Missing opt-out link
- Excessive personalization
- Sensitive information
- Claims of prior contact that didn't happen
- Claims website was tested when no audit exists
- Spam-like phrases
- Excessive links
- Overly long paragraphs`;

export function generateRiskCheckPrompt(input: RiskCheckInput): string {
  return `
Review the following email for compliance and risk factors.

Subject: ${input.subject}
Body (Text): ${input.bodyText}
Body (HTML): ${input.bodyHtml}
Prospect Name: ${input.prospectName}
Personalization Facts Used: ${input.personalizationFacts.join(', ')}

Context:
Has Verified Evidence: ${input.hasVerifiedEvidence}
Has Audit Record: ${input.hasAuditRecord}
Sender Identity Present: ${input.senderIdentityPresent}
Opt-out Link Present: ${input.optOutLinkPresent}
`;
}

export const RiskCheckOutputSchema = z.object({
  safe_to_send: z.boolean(),
  risk_level: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  issues: z.array(z.string()),
  required_edits: z.array(z.string()),
});

export function runRuleBasedRiskCheck(input: RiskCheckInput): RiskCheckOutput {
  const issues: string[] = [];
  const required_edits: string[] = [];

  if (!input.senderIdentityPresent) {
    issues.push('Missing sender identity.');
    required_edits.push('Add sender name and company details.');
  }

  if (!input.optOutLinkPresent) {
    issues.push('Missing opt-out link.');
    required_edits.push('Include a clear unsubscribe link or statement.');
  }

  const spamWords = ['guaranteed', '100% free', 'no risk', 'act now', 'buy direct', 'earn $'];
  const lowerBody = input.bodyText.toLowerCase();
  for (const word of spamWords) {
    if (lowerBody.includes(word)) {
      issues.push(`Spam-like phrase detected: "${word}"`);
      required_edits.push(`Remove or reword "${word}".`);
    }
  }

  const linkCount = (input.bodyHtml.match(/<a /g) || []).length;
  if (linkCount > 3) {
    issues.push('Excessive links detected.');
    required_edits.push('Reduce the number of links to 3 or fewer.');
  }

  if (input.bodyText.length > 2000) {
    issues.push('Email is overly long.');
    required_edits.push('Shorten the email text to improve readability.');
  }

  const risk_level = issues.length > 2 ? 'HIGH' : (issues.length > 0 ? 'MEDIUM' : 'LOW');
  const safe_to_send = risk_level === 'LOW';

  return {
    safe_to_send,
    risk_level,
    issues,
    required_edits,
  };
}
