'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function importProspects(data: { rows: any[], fieldMapping: Record<string, string>, options: any }) {
  const cookieStore = await cookies();
  const workspaceId = cookieStore.get('workspace_id')?.value;
  if (!workspaceId) throw new Error('Workspace not found');

  const { rows, fieldMapping, options } = data;
  let imported = 0;
  let skipped = 0;
  let rejected = 0;
  let flaggedForReview = 0;
  const errors: { row: number, reason: string }[] = [];

  const suppressions = await prisma.suppression.findMany({
    where: { workspaceId }
  });
  const suppressionList = new Set(suppressions.map(s => s.email?.toLowerCase()).filter(Boolean));

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    const mappedRow: any = {};
    for (const [csvKey, dbKey] of Object.entries(fieldMapping)) {
      if (dbKey !== 'skip' && row[csvKey]) {
        mappedRow[dbKey] = row[csvKey];
      }
    }

    if (!mappedRow.company_name) {
      rejected++;
      errors.push({ row: i + 1, reason: 'Missing required field: company_name' });
      continue;
    }

    const email = mappedRow.email?.toLowerCase();
    if (email) {
      if (suppressionList.has(email)) {
        skipped++;
        continue;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        rejected++;
        errors.push({ row: i + 1, reason: `Invalid email format: ${email}` });
        continue;
      }
    }

    try {
      if (options.skipDuplicates && email) {
        const existing = await prisma.prospect.findFirst({
          where: { workspaceId, businessEmail: email }
        });
        if (existing) {
          skipped++;
          continue;
        }
      }

      await prisma.prospect.create({
        data: {
          workspaceId,
          companyName: mappedRow.company_name,
          businessEmail: mappedRow.email,
          contactFirstName: mappedRow.first_name,
          contactLastName: mappedRow.last_name,
          jobTitle: mappedRow.job_title,
          researchStatus: options.markUncertain ? 'REVIEW_REQUIRED' : 'NEW',
          country: options.defaultCountry || mappedRow.country,
        }
      });
      imported++;
      if (options.markUncertain) flaggedForReview++;
    } catch (e: any) {
      rejected++;
      errors.push({ row: i + 1, reason: e.message });
    }
  }

  revalidatePath('/prospects');
  
  return {
    imported,
    skipped,
    rejected,
    flaggedForReview,
    errors
  };
}
