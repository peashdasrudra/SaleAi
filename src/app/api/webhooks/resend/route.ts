import { NextRequest, NextResponse } from 'next/server';
import { createEmailProvider } from '@/lib/email/email-factory';
import { webhookQueue } from '@/workers/queues';
import { ResendProvider } from '@/lib/email/resend-provider';

export async function POST(request: NextRequest) {
  try {
    const provider = createEmailProvider();
    
    // We strictly use Resend logic here since the endpoint is /resend
    if (!(provider instanceof ResendProvider)) {
      return NextResponse.json({ error: 'Configured provider is not Resend' }, { status: 400 });
    }

    const payload = await request.text();
    const headers = {
      'svix-id': request.headers.get('svix-id') || '',
      'svix-timestamp': request.headers.get('svix-timestamp') || '',
      'svix-signature': request.headers.get('svix-signature') || ''
    };

    // Verify webhook
    const isValid = provider.verifyWebhookSignature(payload, headers);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const event = JSON.parse(payload);
    
    // Push the raw event to the webhook processing queue so we don't block the API
    await webhookQueue.add('process-resend-webhook', event);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
