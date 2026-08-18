import { z } from 'zod';

export const createProspectSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').trim(),
  contactFirstName: z.string().trim().optional(),
  contactLastName: z.string().trim().optional(),
  contactFullName: z.string().trim().optional(),
  jobTitle: z.string().trim().optional(),
  businessEmail: z.string().email('Invalid email format').optional().or(z.literal('')),
  publicBusinessPhone: z.string().trim().optional(),
  country: z.enum(['US', 'UK', 'OTHER'], {
    required_error: 'Country is required',
  }),
  stateOrCounty: z.string().trim().optional(),
  city: z.string().trim().optional(),
  postcode: z.string().trim().optional(),
  website: z.string().url('Invalid URL format').optional().or(z.literal('')),
  sourceType: z.enum(['WEBSITE_SCRAPE', 'CSV', 'MANUAL', 'API', 'OTHER'], {
    required_error: 'Source type is required',
  }),
  sourceUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  dataProvenanceNote: z.string().trim().optional(),
  businessType: z.string().trim().optional(),
  specialty: z.string().trim().optional(),
  teamSize: z.string().trim().optional(),
  serviceArea: z.string().trim().optional(),
  activeListingCount: z.number().int().nonnegative().optional(),
  activeListingUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  activeListingPrice: z.number().nonnegative().optional(),
  latestActivityDate: z.coerce.date().optional(),
  latestReviewDate: z.coerce.date().optional(),
  estimatedBudgetBand: z.string().trim().optional(),
  decisionMakerConfidence: z.number().min(0).max(100).optional(),
  personalizationNotes: z.string().trim().optional(),
  doNotContact: z.boolean().optional().default(false),
});

export const updateProspectSchema = createProspectSchema.partial().extend({
  researchStatus: z.enum(['UNSEARCHED', 'SEARCHING', 'COMPLETED', 'FAILED']).optional(),
  contactStatus: z.enum(['NEW', 'CONTACTED', 'REPLIED', 'NOT_INTERESTED', 'MEETING_BOOKED', 'CUSTOMER']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  totalScore: z.number().nonnegative().optional(),
  aiSummary: z.string().trim().optional(),
  emailStatus: z.enum(['NONE', 'DRAFTED', 'APPROVED', 'SENT', 'BOUNCED', 'OPENED', 'CLICKED']).optional(),
});

export const prospectFilterSchema = z.object({
  search: z.string().optional(),
  country: z.array(z.enum(['US', 'UK', 'OTHER'])).optional(),
  city: z.string().optional(),
  priority: z.array(z.enum(['LOW', 'MEDIUM', 'HIGH'])).optional(),
  contactStatus: z.array(z.enum(['NEW', 'CONTACTED', 'REPLIED', 'NOT_INTERESTED', 'MEETING_BOOKED', 'CUSTOMER'])).optional(),
  researchStatus: z.array(z.enum(['UNSEARCHED', 'SEARCHING', 'COMPLETED', 'FAILED'])).optional(),
  emailStatus: z.array(z.enum(['NONE', 'DRAFTED', 'APPROVED', 'SENT', 'BOUNCED', 'OPENED', 'CLICKED'])).optional(),
  sourceType: z.array(z.enum(['WEBSITE_SCRAPE', 'CSV', 'MANUAL', 'API', 'OTHER'])).optional(),
  scoreMin: z.coerce.number().optional(),
  scoreMax: z.coerce.number().optional(),
  doNotContact: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(25),
  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
});

export type CreateProspectInput = z.infer<typeof createProspectSchema>;
export type UpdateProspectInput = z.infer<typeof updateProspectSchema>;
export type ProspectFilterInput = z.infer<typeof prospectFilterSchema>;
