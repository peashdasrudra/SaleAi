import { Resend } from 'resend';
import { Webhook } from 'svix';
import {
  EmailProvider,
  EmailProviderConfig,
  SendEmailInput,
  SendEmailResult,
  EmailWebhookEvent,
  InboundEmail
} from './provider-interface';

export class ResendProvider implements EmailProvider {
  private resend: Resend;
  private webhookSecret?: string;

  constructor(config: EmailProviderConfig) {
    this.resend = new Resend(config.apiKey);
    this.webhookSecret = config.webhookSecret;
  }

  async send(input: SendEmailInput): Promise<SendEmailResult> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: input.from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text || '',
        replyTo: input.replyTo,
        headers: {
          ...input.headers,
          'List-Unsubscribe': `<mailto:unsubscribe@${input.from.split('@')[1]}>`,
        },
        tags: input.tags,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, messageId: data?.id };
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error occurred' };
    }
  }

  verifyWebhookSignature(payload: string, headers: Record<string, string>): boolean {
    if (!this.webhookSecret) {
      throw new Error('Webhook secret is not configured');
    }

    try {
      const wh = new Webhook(this.webhookSecret);
      wh.verify(payload, headers);
      return true;
    } catch (error) {
      return false;
    }
  }

  parseWebhookEvent(payload: any): EmailWebhookEvent {
    const typeMap: Record<string, EmailWebhookEvent['type']> = {
      'email.delivered': 'delivered',
      'email.opened': 'opened',
      'email.clicked': 'clicked',
      'email.bounced': 'bounced',
      'email.complained': 'complained',
      'email.delivery_delayed': 'failed',
    };

    const eventType = typeMap[payload.type] || 'failed';
    const isHardBounce = payload.data?.bounce?.type === 'hard';

    return {
      type: eventType,
      messageId: payload.data?.email_id || '',
      email: payload.data?.to?.[0] || '',
      timestamp: new Date(payload.created_at || Date.now()),
      metadata: payload.data,
      bounceType: eventType === 'bounced' ? (isHardBounce ? 'hard' : 'soft') : undefined,
    };
  }

  parseInboundEmail(payload: any): InboundEmail {
    return {
      from: payload.from || '',
      to: payload.to || '',
      subject: payload.subject || '',
      textBody: payload.text || '',
      htmlBody: payload.html || '',
      headers: payload.headers || {},
      messageId: payload.messageId,
      inReplyTo: payload.inReplyTo,
      references: payload.references,
    };
  }
}
