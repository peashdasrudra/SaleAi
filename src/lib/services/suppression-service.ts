import prisma from '@/lib/db';
import { Prisma, SuppressionReason } from '@prisma/client';

export interface AddSuppressionInput {
  email?: string;
  domain?: string;
  reason?: string;
}

export async function addSuppression(workspaceId: string, data: AddSuppressionInput) {
  if (!workspaceId) throw new Error('Workspace ID is required');
  if (!data.email && !data.domain) {
    throw new Error('Either email or domain is required');
  }

  let emailToSave = data.email ? data.email.toLowerCase().trim() : undefined;
  let domainToSave = data.domain ? data.domain.toLowerCase().trim() : undefined;

  if (emailToSave && !domainToSave) {
    const parts = emailToSave.split('@');
    if (parts.length === 2) {
      domainToSave = parts[1];
    }
  }

  const existing = await prisma.suppression.findFirst({
    where: {
      workspaceId,
      OR: [
        ...(emailToSave ? [{ email: emailToSave }] : []),
        ...(domainToSave ? [{ domain: domainToSave }] : []),
      ]
    }
  });

  const reason = (data.reason as SuppressionReason) || 'MANUAL';

  if (existing) {
    return prisma.suppression.update({
      where: { id: existing.id },
      data: {
        email: emailToSave || existing.email,
        domain: domainToSave || existing.domain,
        reason,
      },
    });
  }

  return prisma.suppression.create({
    data: {
      workspaceId,
      email: emailToSave,
      domain: domainToSave,
      reason,
    },
  });
}

export async function checkSuppression(workspaceId: string, email: string) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const normalizedEmail = email.toLowerCase().trim();
  const domain = normalizedEmail.split('@')[1];

  const suppression = await prisma.suppression.findFirst({
    where: {
      workspaceId,
      OR: [
        { email: normalizedEmail },
        ...(domain ? [{ domain }] : []),
      ],
    },
  });

  return {
    suppressed: !!suppression,
    reason: suppression?.reason,
  };
}

export async function getSuppressions(workspaceId: string, page: number = 1, pageSize: number = 50) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const skip = (page - 1) * pageSize;

  const [suppressions, total] = await Promise.all([
    prisma.suppression.findMany({
      where: { workspaceId },
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.suppression.count({ where: { workspaceId } }),
  ]);

  return {
    suppressions,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function removeSuppression(workspaceId: string, id: string) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const existing = await prisma.suppression.findUnique({
    where: { id, workspaceId },
  });

  if (!existing) {
    throw new Error('Suppression not found');
  }

  return prisma.suppression.delete({
    where: { id },
  });
}

export async function bulkCheckSuppression(workspaceId: string, emails: string[]) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const results: Record<string, boolean> = {};
  const domains = new Set<string>();
  const normalizedEmails = emails.map(e => {
    const eNorm = e.toLowerCase().trim();
    const d = eNorm.split('@')[1];
    if (d) domains.add(d);
    return eNorm;
  });

  const suppressions = await prisma.suppression.findMany({
    where: {
      workspaceId,
      OR: [
        { email: { in: normalizedEmails } },
        { domain: { in: Array.from(domains) } },
      ],
    },
  });

  const suppressedEmails = new Set(suppressions.map(s => s.email).filter(Boolean));
  const suppressedDomains = new Set(suppressions.map(s => s.domain).filter(Boolean));

  for (const email of emails) {
    const normEmail = email.toLowerCase().trim();
    const domain = normEmail.split('@')[1];
    results[email] = suppressedEmails.has(normEmail) || (domain && suppressedDomains.has(domain)) || false;
  }

  return results;
}
