import { ReplyClassificationInput, ReplyClassificationOutput } from '../ai-interface';
import { z } from 'zod';

export const SYSTEM_PROMPT = `You are an email reply classifier for B2B sales outreach. Analyze the reply and classify it accurately. Consider the full context of the conversation.`;

export function generateReplyClassificationPrompt(input: ReplyClassificationInput): string {
  return `
Analyze the following email reply and classify it.

Original Subject: ${input.originalEmailSubject || 'N/A'}
Original Body: ${input.originalEmailBody || 'N/A'}

Reply Subject: ${input.replySubject || 'N/A'}
Reply Body: ${input.replyBody}
`;
}

export const ReplyClassificationOutputSchema = z.object({
  classification: z.enum(['HOT', 'WARM', 'CURIOUS', 'NEUTRAL', 'OBJECTION', 'NOT_INTERESTED', 'UNSUBSCRIBE', 'OUT_OF_OFFICE', 'SPAM', 'UNKNOWN']),
  sentiment: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']),
  confidence: z.number().min(0).max(1),
  reason: z.string(),
  suggested_next_action: z.string(),
  should_notify: z.boolean(),
  should_pause_campaign: z.boolean(),
});

export function preClassifyReply(bodyText: string): ReplyClassificationOutput | null {
  const lowerBody = bodyText.toLowerCase();
  
  // Keyword mapping
  const rules = [
    { classification: 'UNSUBSCRIBE', sentiment: 'NEGATIVE', keywords: ['unsubscribe', 'remove me', 'stop', 'do not contact'] },
    { classification: 'OUT_OF_OFFICE', sentiment: 'NEUTRAL', keywords: ['out of office', 'vacation', 'away', 'absent', 'automated reply'] },
    { classification: 'NOT_INTERESTED', sentiment: 'NEGATIVE', keywords: ['no thanks', 'not interested'] },
    { classification: 'OBJECTION', sentiment: 'NEGATIVE', keywords: ['price', 'already have', 'not now', 'need to think'] },
    { classification: 'HOT', sentiment: 'POSITIVE', keywords: ['interested', 'send details', 'book', 'demo', 'call', 'available', 'how much', 'yes'] },
    { classification: 'WARM', sentiment: 'POSITIVE', keywords: ['tell me more', 'maybe', 'what does it do', 'curious'] },
  ];

  for (const rule of rules) {
    for (const keyword of rule.keywords) {
      // Use word boundaries for better matching
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(lowerBody)) {
        return {
          classification: rule.classification,
          sentiment: rule.sentiment,
          confidence: 0.85,
          reason: `Matched keyword: ${keyword}`,
          suggested_next_action: rule.classification === 'UNSUBSCRIBE' ? 'Mark as opted out' : 'Review manually',
          should_notify: ['HOT', 'WARM', 'OBJECTION'].includes(rule.classification),
          should_pause_campaign: ['UNSUBSCRIBE', 'NOT_INTERESTED', 'HOT', 'WARM'].includes(rule.classification),
        };
      }
    }
  }

  return null;
}
