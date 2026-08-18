import { z } from 'zod';

export const createCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required').trim(),
  targetCountry: z.string().trim().optional(),
  targetSegment: z.string().trim().optional(),
  offer: z.string().trim().optional(),
  dailyLimit: z.number().int().min(1).max(200).default(20),
  maxPerDomainPerDay: z.number().int().min(1).max(10).default(2),
  sendingWindowStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').default('09:00'),
  sendingWindowEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').default('17:00'),
  sendingDays: z.string().default('MON,TUE,WED,THU,FRI'),
  timezoneMode: z.string().trim().optional(),
  approvalRequired: z.boolean().default(true),
});

export const updateCampaignSchema = createCampaignSchema.partial().extend({
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED']).optional(),
});

export const campaignFilterSchema = z.object({
  search: z.string().optional(),
  status: z.array(z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED'])).optional(),
  targetCountry: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(25),
  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type CampaignFilterInput = z.infer<typeof campaignFilterSchema>;
