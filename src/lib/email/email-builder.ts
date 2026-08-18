interface Workspace {
  id: string;
  name: string;
  businessAddress?: string;
  domain?: string;
}

interface Prospect {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export function buildUnsubscribeUrl(prospectId: string, email: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const encodedEmail = encodeURIComponent(email);
  return `${baseUrl}/unsubscribe?p=${prospectId}&e=${encodedEmail}`;
}

export function buildEmailFooter(workspace: Workspace, prospectId: string, email: string): string {
  const unsubscribeUrl = buildUnsubscribeUrl(prospectId, email);
  
  return `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #666;">
      <p>
        ${workspace.name}<br />
        ${workspace.businessAddress || ''}
      </p>
      <p>
        If you no longer wish to receive these emails, you can <a href="${unsubscribeUrl}">unsubscribe here</a>.
      </p>
    </div>
  `;
}

export function buildEmail(
  generatedHtml: string,
  prospect: Prospect,
  workspace: Workspace,
  metadata?: {
    campaignId?: string;
    stepNumber?: number;
    inReplyTo?: string;
    references?: string;
  }
) {
  const footer = buildEmailFooter(workspace, prospect.id, prospect.email);
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: sans-serif; font-size: 14px; line-height: 1.5; color: #333;">
        ${generatedHtml}
        ${footer}
      </body>
    </html>
  `;

  const headers: Record<string, string> = {};
  if (metadata?.inReplyTo) {
    headers['In-Reply-To'] = metadata.inReplyTo;
  }
  if (metadata?.references) {
    headers['References'] = metadata.references;
  }

  const tags = [];
  if (metadata?.campaignId) {
    tags.push({ name: 'campaign_id', value: metadata.campaignId });
  }
  tags.push({ name: 'prospect_id', value: prospect.id });
  if (metadata?.stepNumber !== undefined) {
    tags.push({ name: 'step_number', value: metadata.stepNumber.toString() });
  }

  return {
    html: fullHtml,
    headers,
    tags,
  };
}
