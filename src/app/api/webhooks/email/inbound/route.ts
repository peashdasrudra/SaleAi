import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { researchQueue } from '@/workers/queues'; // using research queue for classification

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const senderEmail = body.from_email || '';
    const inReplyTo = body.in_reply_to;

    const emailMessage = await prisma.emailMessage.findFirst({
      where: { providerMessageId: inReplyTo },
      include: { prospect: true, campaign: true }
    });

    if (!emailMessage) {
      return NextResponse.json({ error: 'Original message not found' }, { status: 404 });
    }

    const reply = await prisma.reply.create({
      data: {
        prospectId: emailMessage.prospectId,
        campaignId: emailMessage.campaignId,
        emailMessageId: emailMessage.id,
        senderEmail: senderEmail,
        subject: body.subject,
        bodyText: body.text_body || body.html_body,
        receivedAt: new Date(),
        classification: 'UNKNOWN'
      }
    });

    // Pause sequences
    await prisma.campaignProspect.updateMany({
      where: { prospectId: emailMessage.prospectId },
      data: { sequenceStatus: 'PAUSED' }
    });

    await researchQueue.add('classify-reply', {
      replyId: reply.id
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Inbound webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
