import { z } from 'zod';

export const csvFieldMappingSchema = z.object({
  company_name: z.string().min(1, 'Company name mapping is required'),
  contact_name: z.string().optional(),
  job_title: z.string().optional(),
  business_email: z.string().optional(),
  website: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  source_url: z.string().optional(),
  phone: z.string().optional(),
  specialty: z.string().optional(),
  active_listing_url: z.string().optional(),
  active_listing_price: z.string().optional(),
  notes: z.string().optional(),
}).catchall(z.string());

export const csvImportOptionsSchema = z.object({
  fieldMapping: csvFieldMappingSchema,
  skipDuplicates: z.boolean().default(true),
  markForReview: z.boolean().default(true),
  defaultCountry: z.enum(['US', 'UK', 'OTHER']),
  defaultSourceType: z.enum(['WEBSITE_SCRAPE', 'CSV', 'MANUAL', 'API', 'OTHER']).default('CSV'),
});

export const csvRowSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').trim(),
  businessEmail: z.string().email('Invalid email format').optional().or(z.literal('')),
}).catchall(z.any());

export type CsvFieldMappingInput = z.infer<typeof csvFieldMappingSchema>;
export type CsvImportOptionsInput = z.infer<typeof csvImportOptionsSchema>;
export type CsvRowInput = z.infer<typeof csvRowSchema>;
