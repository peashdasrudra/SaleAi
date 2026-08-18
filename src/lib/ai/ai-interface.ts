export interface AIProvider {
  generateEmail(input: EmailGenerationInput): Promise<EmailGenerationOutput>;
  classifyReply(input: ReplyClassificationInput): Promise<ReplyClassificationOutput>;
  checkRisk(input: RiskCheckInput): Promise<RiskCheckOutput>;
  extractResearchFacts(input: ResearchInput): Promise<ResearchOutput>;
}

export interface EmailGenerationInput {
  prospect: { name: string; company: string; city?: string; role?: string; website?: string; country: string; };
  evidence: Array<{ type: string; text: string; url?: string; confidence: number; verified: boolean; }>;
  sender: { name: string; company: string; email: string; website?: string; address?: string; signature?: string; };
  offer: string;
  angle?: string;
  cta?: string;
  maxWords?: number;
  templateType: 'INITIAL' | 'FOLLOW_UP_1' | 'FOLLOW_UP_2' | 'BREAKUP';
  country: string;
  optOutRequired: boolean;
}

export interface EmailGenerationOutput {
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

export interface ReplyClassificationInput {
  replyBody: string;
  replySubject?: string;
  originalEmailSubject?: string;
  originalEmailBody?: string;
}

export interface ReplyClassificationOutput {
  classification: string; // HOT|WARM|CURIOUS|NEUTRAL|OBJECTION|NOT_INTERESTED|UNSUBSCRIBE|OUT_OF_OFFICE|SPAM|UNKNOWN
  sentiment: string; // POSITIVE|NEUTRAL|NEGATIVE
  confidence: number;
  reason: string;
  suggested_next_action: string;
  should_notify: boolean;
  should_pause_campaign: boolean;
}

export interface RiskCheckInput {
  subject: string;
  bodyText: string;
  bodyHtml: string;
  personalizationFacts: string[];
  prospectName: string;
  hasVerifiedEvidence: boolean;
  hasAuditRecord: boolean;
  senderIdentityPresent: boolean;
  optOutLinkPresent: boolean;
}

export interface RiskCheckOutput {
  safe_to_send: boolean;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  issues: string[];
  required_edits: string[];
}

export interface ResearchInput {
  companyName: string;
  website?: string;
  businessType?: string;
  pageContent?: string;
}

export interface ResearchOutput {
  facts: Array<{ type: string; text: string; confidence: number; }>;
  summary: string;
  suggestedEvidenceTypes: string[];
}
