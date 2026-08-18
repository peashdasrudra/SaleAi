import { Job } from 'bullmq';
import { prisma } from '@/lib/db';

export default async function importProcessor(job: Job) {
  const { workspaceId, rows, options } = job.data;
  let imported = 0, skipped = 0, rejected = 0, errors = [];

  const batchSize = 50;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    
    for (const row of batch) {
      try {
        if (!row.email) {
          rejected++;
          errors.push({ row, error: 'Missing email' });
          continue;
        }

        const normalizedEmail = row.email.toLowerCase().trim();
        
        // Check duplicate
        const existing = await prisma.prospect.findFirst({
          where: { workspaceId, businessEmail: normalizedEmail }
        });

        if (existing) {
          skipped++;
          continue;
        }

        // Create prospect
        await prisma.prospect.create({
          data: {
            workspaceId,
            businessEmail: normalizedEmail,
            contactFirstName: row.firstName,
            contactLastName: row.lastName,
            companyName: row.company || 'Unknown',
            jobTitle: row.title,
            dataProvenanceNote: row.linkedinUrl ? `LinkedIn: ${row.linkedinUrl}` : undefined,
            contactStatus: 'NOT_CONTACTED',
          }
        });
        
        imported++;
      } catch (err: any) {
        rejected++;
        errors.push({ row, error: err.message });
      }
    }
    
    await job.updateProgress(Math.floor(((i + batch.length) / rows.length) * 100));
  }

  return { imported, skipped, rejected, errors };
}
