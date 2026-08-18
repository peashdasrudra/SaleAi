import { z } from 'zod';

export const emailTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').trim(),
  templateType: z.enum(['INITIAL', 'FOLLOW_UP', 'REPLY', 'OTHER']),
  subjectTemplate: z.string().min(1, 'Subject template is required').trim(),
  bodyTemplate: z.string().min(1, 'Body template is required').trim(),
  version: z.number().int().positive().optional(),
});

export const generatedEmailSchema = z.object({
  prospectId: z.string().min(1, 'Prospect ID is required'),
  campaignId: z.string().min(1, 'Campaign ID is required'),
  templateId: z.string().optional(),
  subject: z.string().min(1, 'Subject is required').trim(),
  bodyHtml: z.string().min(1, 'Body HTML is required'),
  bodyText: z.string().min(1, 'Body text is required'),
  personalizationFacts: z.array(z.string()),
  riskFlags: z.array(z.string()),
  aiModel: z.string().optional(),
  promptVersion: z.string().optional(),
});

export const approveEmailSchema = z.object({
  approvalStatus: z.enum(['APPROVED', 'REJECTED', 'EDITED']),
  editedSubject: z.string().trim().optional(),
  editedBodyHtml: z.string().optional(),
  editedBodyText: z.string().optional(),
});

export const sendTestEmailSchema = z.object({
  to: z.string().email('Invalid email format').transform((val) => val.toLowerCase()),
  subject: z.string().min(1, 'Subject is required').trim(),
  bodyHtml: z.string().min(1, 'Body HTML is required'),
});

export type EmailTemplateInput = z.infer<typeof emailTemplateSchema>;
export type GeneratedEmailInput = z.infer<typeof generatedEmailSchema>;
export type ApproveEmailInput = z.infer<typeof approveEmailSchema>;
export type SendTestEmailInput = z.infer<typeof sendTestEmailSchema>;
