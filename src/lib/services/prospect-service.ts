import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

export interface CreateProspectInput {
  companyName: string;
  companyDomain?: string;
  contactFullName?: string;
  contactFirstName?: string;
  contactLastName?: string;
  businessEmail?: string;
  linkedInUrl?: string;
  city?: string;
  country?: string;
  sourceType?: string;
  doNotContact?: boolean;
}

export interface UpdateProspectInput extends Partial<CreateProspectInput> {
  researchStatus?: any;
  contactStatus?: any;
  priority?: any;
  emailStatus?: any;
  totalScore?: number;
}

export interface ProspectFilterInput {
  search?: string;
  country?: string[];
  priority?: string[];
  contactStatus?: string[];
  researchStatus?: string[];
  emailStatus?: string[];
  sourceType?: string[];
  scoreMin?: number;
  scoreMax?: number;
  doNotContact?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export async function createProspect(workspaceId: string, data: CreateProspectInput) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const normalizedEmail = data.businessEmail ? data.businessEmail.toLowerCase().trim() : undefined;

  return prisma.prospect.create({
    data: {
      ...data,
      businessEmail: normalizedEmail,
      workspaceId,
      researchStatus: 'NEW',
      contactStatus: 'NOT_CONTACTED',
      priority: 'C',
      emailStatus: 'UNKNOWN',
    },
  });
}

export async function getProspects(workspaceId: string, filters: ProspectFilterInput) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const page = filters.page || 1;
  const pageSize = filters.pageSize || 50;
  const skip = (page - 1) * pageSize;

  const where: Prisma.ProspectWhereInput = {
    workspaceId,
  };

  if (filters.search) {
    where.OR = [
      { companyName: { contains: filters.search, mode: 'insensitive' } },
      { contactFullName: { contains: filters.search, mode: 'insensitive' } },
      { businessEmail: { contains: filters.search, mode: 'insensitive' } },
      { city: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.country?.length) where.country = { in: filters.country };
  if (filters.priority?.length) where.priority = { in: filters.priority };
  if (filters.contactStatus?.length) where.contactStatus = { in: filters.contactStatus };
  if (filters.researchStatus?.length) where.researchStatus = { in: filters.researchStatus };
  if (filters.emailStatus?.length) where.emailStatus = { in: filters.emailStatus };
  if (filters.sourceType?.length) where.sourceType = { in: filters.sourceType };

  if (filters.scoreMin !== undefined || filters.scoreMax !== undefined) {
    where.totalScore = {};
    if (filters.scoreMin !== undefined) where.totalScore.gte = filters.scoreMin;
    if (filters.scoreMax !== undefined) where.totalScore.lte = filters.scoreMax;
  }

  if (filters.doNotContact !== undefined) {
    where.doNotContact = filters.doNotContact;
  }

  const orderBy = {
    [filters.sortBy || 'totalScore']: filters.sortOrder || 'desc',
  };

  const [prospects, total] = await Promise.all([
    prisma.prospect.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
    }),
    prisma.prospect.count({ where }),
  ]);

  return {
    prospects,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getProspectById(workspaceId: string, id: string) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const prospect = await prisma.prospect.findUnique({
    where: { id, workspaceId },
    include: {
      evidences: true,
      scoreBreakdowns: true,
      audits: true,
      generatedEmails: {
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
      emailMessages: {
        take: 10,
        orderBy: { createdAt: 'desc' },
      },
      replies: true,
      campaignProspects: {
        include: { campaign: true },
      },
      tasks: true,
    },
  });

  if (!prospect) {
    throw new Error('Prospect not found or you do not have permission to access it');
  }

  return prospect;
}

export async function updateProspect(workspaceId: string, id: string, data: UpdateProspectInput) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const existing = await prisma.prospect.findUnique({
    where: { id, workspaceId },
  });

  if (!existing) {
    throw new Error('Prospect not found');
  }

  if (data.businessEmail) {
    data.businessEmail = data.businessEmail.toLowerCase().trim();
  }

  return prisma.prospect.update({
    where: { id },
    data,
  });
}

export async function deleteProspect(workspaceId: string, id: string) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const existing = await prisma.prospect.findUnique({
    where: { id, workspaceId },
  });

  if (!existing) {
    throw new Error('Prospect not found');
  }

  return prisma.prospect.delete({
    where: { id },
  });
}

export async function getProspectStats(workspaceId: string) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const [byPriority, byContactStatus, byResearchStatus] = await Promise.all([
    prisma.prospect.groupBy({
      by: ['priority'],
      where: { workspaceId },
      _count: true,
    }),
    prisma.prospect.groupBy({
      by: ['contactStatus'],
      where: { workspaceId },
      _count: true,
    }),
    prisma.prospect.groupBy({
      by: ['researchStatus'],
      where: { workspaceId },
      _count: true,
    }),
  ]);

  return {
    priority: byPriority,
    contactStatus: byContactStatus,
    researchStatus: byResearchStatus,
  };
}

export async function bulkUpdateProspects(workspaceId: string, ids: string[], data: Partial<UpdateProspectInput>) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const result = await prisma.prospect.updateMany({
    where: {
      workspaceId,
      id: { in: ids },
    },
    data,
  });

  return result;
}

export async function checkDuplicates(workspaceId: string, email?: string, domain?: string, companyName?: string) {
  if (!workspaceId) throw new Error('Workspace ID is required');

  const OR: Prisma.ProspectWhereInput[] = [];

  if (email) {
    OR.push({ businessEmail: email.toLowerCase().trim() });
  }

  if (domain) {
    OR.push({ companyDomain: domain.toLowerCase().trim() });
  }

  if (companyName) {
    OR.push({ companyName: { equals: companyName, mode: 'insensitive' } });
  }

  if (OR.length === 0) {
    return [];
  }

  const duplicates = await prisma.prospect.findMany({
    where: {
      workspaceId,
      OR,
    },
  });

  return duplicates;
}
