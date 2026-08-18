export const APP_NAME = 'LeadPilot';
export const COMPANY_NAME = 'AiExpertLabs';

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;

export const DEFAULT_DAILY_SEND_LIMIT = 20;
export const DEFAULT_PER_DOMAIN_LIMIT = 2;
export const DEFAULT_SENDING_WINDOW = { start: '09:00', end: '17:00' };
export const DEFAULT_SENDING_DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

export const MAX_INITIAL_EMAIL_WORDS = 120;
export const MAX_FOLLOWUP_EMAIL_WORDS = 80;

export const SCORE_RANGE = { min: 0, max: 100 };
export const PRIORITY_THRESHOLDS = { A: 75, B: 55, C: 30 };

export const US_TIMEZONES = ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles'];
export const UK_TIMEZONES = ['Europe/London'];

export const COMPLIANCE_WARNING = 'Only contact business prospects where your outreach has a lawful basis. Verify applicable US, UK, platform, privacy, and email-marketing rules before sending.';

export const DEFAULT_POSITIONING = 'I help independent real-estate agents and property teams respond faster to website, missed-call, and viewing inquiries with lightweight automation that works alongside their existing process.';

export const EMAIL_ANGLES = [
  { id: 'A', name: 'Speed to Lead', description: 'Focus on responding faster to inquiries' },
  { id: 'B', name: 'Missed Call Recovery', description: 'Focus on recovering missed calls via SMS' },
  { id: 'C', name: 'Booking Automation', description: 'Focus on automating viewing bookings' },
  { id: 'D', name: 'After-hours Response', description: 'Focus on responding to leads 24/7' },
  { id: 'E', name: 'Nurture Sequences', description: 'Focus on long-term follow-up' },
  { id: 'F', name: 'Team Efficiency', description: 'Focus on saving time for small teams' },
];

export const REPLY_KEYWORDS = {
  HOT: ['yes', 'interested', 'call me', 'details', 'pricing', 'more info', 'sure'],
  WARM: ['maybe', 'later', 'next month', 'send me', 'let me know'],
  OBJECTION: ['too expensive', 'using someone else', 'not right now', 'budget'],
  NOT_INTERESTED: ['no thanks', 'not interested', 'stop', 'remove'],
  UNSUBSCRIBE: ['unsubscribe', 'opt out', 'take me off'],
  OUT_OF_OFFICE: ['ooo', 'out of office', 'away', 'vacation', 'holiday'],
  WRONG_PERSON: ['wrong person', 'not me', 'reach out to'],
};
