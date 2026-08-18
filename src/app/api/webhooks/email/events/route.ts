import { NextResponse } from 'next/server';
import { webhookQueue } from '@/workers/queues';

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('x-webhook-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Mock signature verification
    // if (!verifyWebhookSignature(signature, body)) throw ...

    const body = await req.json();

    // Mock parse
    const event = {
      eventType: body.event,
      messageId: body.message_id,
      email: body.email,
      timestamp: body.timestamp,
      metadata: body.metadata
    };

    await webhookQueue.add('email-event', event, {
      jobId: `webhook-${body.event_id}` // Idempotency
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
