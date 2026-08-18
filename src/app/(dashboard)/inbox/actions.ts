'use server';

import { revalidatePath } from 'next/cache';

export async function getReplies(filters?: { classification?: string; sentiment?: string; reviewed?: boolean }) {
  // Mock data for inbox
  return [
    {
      id: 'reply_1',
      prospectName: 'John Doe',
      prospectEmail: 'john@example.com',
      company: 'Acme Corp',
      subject: 'Re: Quick question about Acme Corp',
      content: 'This sounds interesting. Can we jump on a call next Tuesday?',
      classification: 'HOT',
      sentiment: 'POSITIVE',
      confidence: 92,
      suggestedAction: 'Create task to schedule a call',
      receivedAt: new Date().toISOString(),
      originalSentAt: new Date(Date.now() - 86400000).toISOString(),
      originalEmailHtml: '<p>Hi John,</p><p>Quick question...</p>',
      isReviewed: false,
    }
  ];
}

export async function getReplyById(id: string) {
  const replies = await getReplies();
  return replies.find((r) => r.id === id);
}

export async function updateReplyClassification(id: string, classification: string, sentiment: string) {
  revalidatePath('/inbox');
}

export async function markAsReviewed(id: string) {
  revalidatePath('/inbox');
}

export async function createTaskFromReply(replyId: string, taskData: any) {
  // create task in CRM/DB
  revalidatePath('/inbox');
}
