import { EmailProvider } from './provider-interface';
import { ResendProvider } from './resend-provider';

export function createEmailProvider(): EmailProvider {
  const provider = process.env.EMAIL_PROVIDER || 'resend';
  
  switch (provider) {
    case 'resend':
      return new ResendProvider({
        apiKey: process.env.RESEND_API_KEY || '',
        fromEmail: process.env.RESEND_FROM_EMAIL || 'hello@example.com',
        webhookSecret: process.env.RESEND_WEBHOOK_SECRET,
      });
    default:
      throw new Error(`Unknown email provider: ${provider}`);
  }
}
