export interface ScoringRule {
  id: string;
  factor: string;
  evidenceType?: string; // maps to EvidenceType enum
  condition: string; // human-readable condition description
  points: number;
  category: 'fit' | 'activity' | 'urgency' | 'problem';
  requiresVerification: boolean;
}

export const DEFAULT_SCORING_RULES: ScoringRule[] = [
  // Positive signals
  { id: 'active_listing', factor: 'Active listing or current rental stock', evidenceType: 'ACTIVE_LISTING', condition: 'Has active listings', points: 15, category: 'activity', requiresVerification: true },
  { id: 'multiple_listings', factor: '3+ active listings', evidenceType: 'ACTIVE_LISTING', condition: 'Has 3 or more active listings', points: 10, category: 'activity', requiresVerification: true },
  { id: 'website_form', factor: 'Website inquiry form present', evidenceType: 'WEBSITE_FORM', condition: 'Has contact/inquiry form', points: 10, category: 'fit', requiresVerification: true },
  { id: 'no_acknowledgment', factor: 'No visible instant acknowledgment', evidenceType: 'NO_INSTANT_ACKNOWLEDGMENT', condition: 'No auto-reply or acknowledgment', points: 10, category: 'problem', requiresVerification: true },
  { id: 'no_booking', factor: 'No booking/viewing link', evidenceType: 'NO_BOOKING_LINK', condition: 'No online booking available', points: 10, category: 'problem', requiresVerification: true },
  { id: 'no_missed_call', factor: 'No missed-call response', evidenceType: 'MISSED_CALL_GAP', condition: 'No missed-call text-back', points: 10, category: 'problem', requiresVerification: true },
  { id: 'small_team', factor: 'Independent or small team', evidenceType: 'SMALL_TEAM', condition: 'Team size <= 5', points: 10, category: 'fit', requiresVerification: true },
  { id: 'high_value', factor: 'Higher-value property/service', evidenceType: 'HIGH_VALUE_PROPERTY', condition: 'High-value listings', points: 10, category: 'urgency', requiresVerification: true },
  { id: 'has_email', factor: 'Public business email', condition: 'Has business email', points: 5, category: 'fit', requiresVerification: false },
  { id: 'has_phone', factor: 'Public business phone', condition: 'Has business phone', points: 5, category: 'fit', requiresVerification: false },
  { id: 'recent_marketing', factor: 'Recent marketing activity', evidenceType: 'RECENT_MARKETING', condition: 'Marketing within 30 days', points: 5, category: 'activity', requiresVerification: true },
  { id: 'recent_reviews', factor: 'Recent reviews', evidenceType: 'RECENT_REVIEW', condition: 'Reviews within 30 days', points: 5, category: 'activity', requiresVerification: true },
  // Negative signals
  { id: 'large_corp', factor: 'Large corporate structure', condition: 'Team size > 50 or corporate indicators', points: -10, category: 'fit', requiresVerification: false },
  { id: 'has_isa', factor: 'Dedicated ISA/call center', condition: 'Has dedicated inside sales', points: -10, category: 'fit', requiresVerification: false },
  { id: 'no_activity', factor: 'No current activity', condition: 'No recent listings or marketing', points: -20, category: 'activity', requiresVerification: false },
  { id: 'disqualified', factor: 'Unsubscribed/bounced/complained/disqualified', condition: 'Bad contact status', points: -30, category: 'fit', requiresVerification: false },
];
