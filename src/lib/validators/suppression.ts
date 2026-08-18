import { z } from 'zod';

export const addSuppressionSchema = z.object({
  email: z.string().email('Invalid email format').transform((val) => val.toLowerCase()).optional().or(z.literal('')),
  domain: z.string().trim().transform((val) => val.toLowerCase()).optional().or(z.literal('')),
  phone: z.string().trim().optional(),
  reason: z.enum(['UNSUBSCRIBE', 'HARD_BOUNCE', 'COMPLAINT', 'MANUAL', 'DUPLICATE']),
  source: z.string().trim().optional(),
}).refine(
  (data) => (data.email && data.email.length > 0) || (data.domain && data.domain.length > 0) || (data.phone && data.phone.length > 0),
  {
    message: 'At least one of email, domain, or phone is required',
    path: ['email'],
  }
);

export const checkSuppressionSchema = z.object({
  email: z.string().trim().transform((val) => val.toLowerCase()).optional().or(z.literal('')),
  domain: z.string().trim().transform((val) => val.toLowerCase()).optional().or(z.literal('')),
});

export type AddSuppressionInput = z.infer<typeof addSuppressionSchema>;
export type CheckSuppressionInput = z.infer<typeof checkSuppressionSchema>;
