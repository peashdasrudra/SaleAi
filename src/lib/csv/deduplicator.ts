import prisma from '@/lib/db';
import { CreateProspectInput } from './csv-parser';

export async function findDuplicates(workspaceId: string, prospects: CreateProspectInput[]) {
  const unique: CreateProspectInput[] = [];
  const duplicates: { prospect: CreateProspectInput; existingId: string; matchType: 'email' | 'domain' | 'company' }[] = [];

  const existingProspects = await prisma.prospect.findMany({
    where: { workspaceId },
    select: { id: true, businessEmail: true, companyName: true, city: true },
  });

  for (const prospect of prospects) {
    let duplicateMatch = null;

    const prospectEmail = prospect.businessEmail.toLowerCase();
    const prospectDomain = extractDomain(prospectEmail);

    for (const existing of existingProspects) {
      if (existing.businessEmail && existing.businessEmail.toLowerCase() === prospectEmail) {
        duplicateMatch = { existingId: existing.id, matchType: 'email' as const };
        break;
      }
      
      if (existing.businessEmail) {
        const existingDomain = extractDomain(existing.businessEmail);
        if (existingDomain && existingDomain === prospectDomain && prospectDomain !== 'gmail.com' && prospectDomain !== 'yahoo.com') {
          duplicateMatch = { existingId: existing.id, matchType: 'domain' as const };
          break;
        }
      }

      if (
        existing.companyName.toLowerCase() === prospect.companyName.toLowerCase() &&
        existing.city?.toLowerCase() === prospect.city?.toLowerCase()
      ) {
        duplicateMatch = { existingId: existing.id, matchType: 'company' as const };
        break;
      }
    }

    if (duplicateMatch) {
      duplicates.push({ prospect, existingId: duplicateMatch.existingId, matchType: duplicateMatch.matchType });
    } else {
      unique.push(prospect);
    }
  }

  return { unique, duplicates };
}

export function extractDomain(email: string): string {
  const parts = email.split('@');
  if (parts.length === 2) {
    return parts[1].toLowerCase();
  }
  return '';
}

export function normalizeDomain(url: string): string {
  let domain = url.toLowerCase().trim();
  domain = domain.replace(/^https?:\/\//, '');
  domain = domain.replace(/^www\./, '');
  domain = domain.split('/')[0];
  return domain;
}
