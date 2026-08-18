import { z } from 'zod';

export const addEvidenceSchema = z.object({
  prospectId: z.string().min(1, 'Prospect ID is required'),
  evidenceType: z.enum(['PRICING_PAGE', 'TEAM_PAGE', 'NEWS_ARTICLE', 'JOB_POSTING', 'SOCIAL_POST', 'OTHER']),
  evidenceText: z.string().min(5, 'Evidence text must be at least 5 characters').trim(),
  evidenceUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  observedAt: z.coerce.date().default(() => new Date()),
  confidence: z.number().min(0).max(100).default(50),
  verifiedByUser: z.boolean().default(false),
});

export const updateEvidenceSchema = z.object({
  verifiedByUser: z.boolean().optional(),
  confidence: z.number().min(0).max(100).optional(),
  evidenceText: z.string().min(5).trim().optional(),
});

export type AddEvidenceInput = z.infer<typeof addEvidenceSchema>;
export type UpdateEvidenceInput = z.infer<typeof updateEvidenceSchema>;
