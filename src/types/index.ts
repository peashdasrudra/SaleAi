/**
 * LeadPilot — Shared TypeScript Types
 * These mirror the Prisma schema enums and provide utility types used across the app.
 * After `prisma generate`, prefer importing enums from @prisma/client directly.
 */

// ─── Prospect Enums ──────────────────────────────────────────────────────────

export const EMAIL_STATUS = {
  UNKNOWN: 'UNKNOWN',
  VALIDATED: 'VALIDATED',
  INVALID: 'INVALID',
  BOUNCED: 'BOUNCED',
  UNSUBSCRIBED: 'UNSUBSCRIBED',
  COMPLAINED: 'COMPLAINED',
} as const;
export type EmailStatusType = (typeof EMAIL_STATUS)[keyof typeof EMAIL_STATUS];

export const COUNTRY = {
  US: 'US',
  UK: 'UK',
  OTHER: 'OTHER',
} as const;
export type CountryType = (typeof COUNTRY)[keyof typeof COUNTRY];

export const SOURCE_TYPE = {
  MANUAL: 'MANUAL',
  CSV: 'CSV',
  OFFICIAL_API: 'OFFICIAL_API',
  OFFICIAL_DIRECTORY: 'OFFICIAL_DIRECTORY',
  USER_RESEARCH: 'USER_RESEARCH',
} as const;
export type SourceTypeType = (typeof SOURCE_TYPE)[keyof typeof SOURCE_TYPE];

export const RESEARCH_STATUS = {
  NEW: 'NEW',
  QUEUED: 'QUEUED',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW_REQUIRED: 'REVIEW_REQUIRED',
  COMPLETE: 'COMPLETE',
  FAILED: 'FAILED',
} as const;
export type ResearchStatusType = (typeof RESEARCH_STATUS)[keyof typeof RESEARCH_STATUS];

export const CONTACT_STATUS = {
  NOT_CONTACTED: 'NOT_CONTACTED',
  APPROVED: 'APPROVED',
  QUEUED: 'QUEUED',
  SENT: 'SENT',
  REPLIED: 'REPLIED',
  QUALIFIED: 'QUALIFIED',
  NOT_INTERESTED: 'NOT_INTERESTED',
  UNSUBSCRIBED: 'UNSUBSCRIBED',
  BOUNCED: 'BOUNCED',
  CONVERTED: 'CONVERTED',
} as const;
export type ContactStatusType = (typeof CONTACT_STATUS)[keyof typeof CONTACT_STATUS];

export const PRIORITY = {
  A: 'A',
  B: 'B',
  C: 'C',
  DISQUALIFIED: 'DISQUALIFIED',
} as const;
export type PriorityType = (typeof PRIORITY)[keyof typeof PRIORITY];

export const EVIDENCE_TYPE = {
  WEBSITE_FORM: 'WEBSITE_FORM',
  NO_INSTANT_ACKNOWLEDGMENT: 'NO_INSTANT_ACKNOWLEDGMENT',
  NO_BOOKING_LINK: 'NO_BOOKING_LINK',
  MISSED_CALL_GAP: 'MISSED_CALL_GAP',
  ACTIVE_LISTING: 'ACTIVE_LISTING',
  RECENT_MARKETING: 'RECENT_MARKETING',
  RECENT_REVIEW: 'RECENT_REVIEW',
  SMALL_TEAM: 'SMALL_TEAM',
  HIGH_VALUE_PROPERTY: 'HIGH_VALUE_PROPERTY',
  OTHER: 'OTHER',
} as const;
export type EvidenceTypeType = (typeof EVIDENCE_TYPE)[keyof typeof EVIDENCE_TYPE];

// ─── Campaign Enums ──────────────────────────────────────────────────────────

export const CAMPAIGN_STATUS = {
  DRAFT: 'DRAFT',
  REVIEW: 'REVIEW',
  APPROVED: 'APPROVED',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED',
} as const;
export type CampaignStatusType = (typeof CAMPAIGN_STATUS)[keyof typeof CAMPAIGN_STATUS];

export const SEQUENCE_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  WAITING_APPROVAL: 'WAITING_APPROVAL',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  STOPPED: 'STOPPED',
} as const;
export type SequenceStatusType = (typeof SEQUENCE_STATUS)[keyof typeof SEQUENCE_STATUS];

// ─── Email Enums ─────────────────────────────────────────────────────────────

export const TEMPLATE_TYPE = {
  INITIAL: 'INITIAL',
  FOLLOW_UP_1: 'FOLLOW_UP_1',
  FOLLOW_UP_2: 'FOLLOW_UP_2',
  BREAKUP: 'BREAKUP',
  REPLY: 'REPLY',
} as const;
export type TemplateTypeType = (typeof TEMPLATE_TYPE)[keyof typeof TEMPLATE_TYPE];

export const APPROVAL_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EDITED: 'EDITED',
} as const;
export type ApprovalStatusType = (typeof APPROVAL_STATUS)[keyof typeof APPROVAL_STATUS];

export const DELIVERY_STATUS = {
  QUEUED: 'QUEUED',
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  OPENED: 'OPENED',
  CLICKED: 'CLICKED',
  BOUNCED: 'BOUNCED',
  COMPLAINED: 'COMPLAINED',
  FAILED: 'FAILED',
} as const;
export type DeliveryStatusType = (typeof DELIVERY_STATUS)[keyof typeof DELIVERY_STATUS];

export const REPLY_STATUS = {
  NO_REPLY: 'NO_REPLY',
  REPLIED: 'REPLIED',
  POSITIVE: 'POSITIVE',
  NEUTRAL: 'NEUTRAL',
  NEGATIVE: 'NEGATIVE',
  UNSUBSCRIBE: 'UNSUBSCRIBE',
} as const;
export type ReplyStatusType = (typeof REPLY_STATUS)[keyof typeof REPLY_STATUS];

// ─── Reply Classification ────────────────────────────────────────────────────

export const CLASSIFICATION = {
  HOT: 'HOT',
  WARM: 'WARM',
  CURIOUS: 'CURIOUS',
  NEUTRAL: 'NEUTRAL',
  OBJECTION: 'OBJECTION',
  NOT_INTERESTED: 'NOT_INTERESTED',
  UNSUBSCRIBE: 'UNSUBSCRIBE',
  OUT_OF_OFFICE: 'OUT_OF_OFFICE',
  SPAM: 'SPAM',
  UNKNOWN: 'UNKNOWN',
} as const;
export type ClassificationType = (typeof CLASSIFICATION)[keyof typeof CLASSIFICATION];

export const SENTIMENT = {
  POSITIVE: 'POSITIVE',
  NEUTRAL: 'NEUTRAL',
  NEGATIVE: 'NEGATIVE',
} as const;
export type SentimentType = (typeof SENTIMENT)[keyof typeof SENTIMENT];

// ─── Notification Enums ──────────────────────────────────────────────────────

export const NOTIFICATION_TYPE = {
  REPLY: 'REPLY',
  HOT_LEAD: 'HOT_LEAD',
  UNSUBSCRIBE: 'UNSUBSCRIBE',
  BOUNCE: 'BOUNCE',
  CAMPAIGN_ERROR: 'CAMPAIGN_ERROR',
  DAILY_REPORT: 'DAILY_REPORT',
} as const;
export type NotificationTypeEnum = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export const NOTIFICATION_CHANNEL = {
  IN_APP: 'IN_APP',
  EMAIL: 'EMAIL',
  TELEGRAM: 'TELEGRAM',
  SLACK: 'SLACK',
} as const;
export type NotificationChannelType = (typeof NOTIFICATION_CHANNEL)[keyof typeof NOTIFICATION_CHANNEL];

export const SUPPRESSION_REASON = {
  UNSUBSCRIBE: 'UNSUBSCRIBE',
  HARD_BOUNCE: 'HARD_BOUNCE',
  COMPLAINT: 'COMPLAINT',
  MANUAL: 'MANUAL',
  DUPLICATE: 'DUPLICATE',
} as const;
export type SuppressionReasonType = (typeof SUPPRESSION_REASON)[keyof typeof SUPPRESSION_REASON];

export const TASK_STATUS = {
  OPEN: 'OPEN',
  DONE: 'DONE',
  SNOOZED: 'SNOOZED',
} as const;
export type TaskStatusType = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

// ─── API Response Types ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

// ─── Filter Types ────────────────────────────────────────────────────────────

export interface ProspectFilters {
  search?: string;
  country?: CountryType[];
  city?: string;
  priority?: PriorityType[];
  contactStatus?: ContactStatusType[];
  researchStatus?: ResearchStatusType[];
  emailStatus?: EmailStatusType[];
  sourceType?: SourceTypeType[];
  campaignId?: string;
  classification?: ClassificationType[];
  scoreMin?: number;
  scoreMax?: number;
  doNotContact?: boolean;
}

export interface CampaignFilters {
  search?: string;
  status?: CampaignStatusType[];
  targetCountry?: CountryType;
}

export interface ReplyFilters {
  search?: string;
  classification?: ClassificationType[];
  sentiment?: SentimentType[];
  humanReviewed?: boolean;
  campaignId?: string;
}

// ─── Dashboard Types ─────────────────────────────────────────────────────────

export interface DashboardStats {
  totalProspects: number;
  priorityACounts: number;
  priorityBCounts: number;
  priorityCCounts: number;
  readyForReview: number;
  emailsAwaitingApproval: number;
  sentToday: number;
  repliesToday: number;
  hotLeads: number;
  meetingsBooked: number;
  optOuts: number;
  bounceRate: number;
  replyRate: number;
  campaignsRunning: number;
}

export interface ActivityItem {
  id: string;
  type: 'email_sent' | 'reply_received' | 'prospect_added' | 'campaign_launched' | 'score_updated' | 'email_approved';
  description: string;
  prospectId?: string;
  prospectName?: string;
  campaignId?: string;
  timestamp: string;
}

// ─── Table Types ─────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
}

// ─── AI Types ────────────────────────────────────────────────────────────────

export interface GeneratedEmailOutput {
  subject: string;
  body_text: string;
  body_html: string;
  personalization_facts: string[];
  confidence: number;
  risk_flags: string[];
  angle: string;
  cta: string;
  suggested_next_step: string;
}

export interface RiskCheckOutput {
  safe_to_send: boolean;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  issues: string[];
  required_edits: string[];
}

export interface ReplyClassificationOutput {
  classification: ClassificationType;
  sentiment: SentimentType;
  confidence: number;
  reason: string;
  suggested_next_action: string;
  should_notify: boolean;
  should_pause_campaign: boolean;
}

// ─── Notification Payload ────────────────────────────────────────────────────

export interface NotificationPayload {
  id: string;
  type: NotificationTypeEnum;
  channel: NotificationChannelType;
  title: string;
  message: string;
  prospectName?: string;
  companyName?: string;
  classification?: ClassificationType;
  dashboardUrl?: string;
  createdAt: string;
  read: boolean;
}
