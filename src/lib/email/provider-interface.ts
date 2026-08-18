export interface EmailProviderConfig {
  apiKey: string;
  fromEmail: string;
  replyToEmail?: string;
  webhookSecret?: string;
}

export interface SendEmailInput {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
  headers?: Record<string, string>;
  tags?: Array<{ name: string; value: string }>;
  idempotencyKey?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailWebhookEvent {
  type: 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained' | 'failed';
  messageId: string;
  email: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  bounceType?: 'hard' | 'soft';
}

export interface InboundEmail {
  from: string;
  to: string;
  subject: string;
  textBody?: string;
  htmlBody?: string;
  headers: Record<string, string>;
  messageId?: string;
  inReplyTo?: string;
  references?: string;
}

export interface EmailProvider {
  send(input: SendEmailInput): Promise<SendEmailResult>;
  verifyWebhookSignature(payload: string, headers: Record<string, string>): boolean;
  parseWebhookEvent(payload: any): EmailWebhookEvent;
  parseInboundEmail(payload: any): InboundEmail;
}
