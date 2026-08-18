export function getProspectTimezone(prospect: any): string {
  // Mock implementation
  if (prospect.country === 'UK') return 'Europe/London';
  return 'America/New_York'; // Default
}

export function isWithinSendingWindow(timezone: string, windowStart: string, windowEnd: string, sendingDays: string[]): boolean {
  // Mock logic
  return true;
}

export function getNextSendTime(timezone: string, windowStart: string, windowEnd: string, sendingDays: string[], minDelayDays: number = 0): Date {
  return new Date();
}

export function toUTC(date: Date, timezone: string): Date {
  return new Date(date.getTime()); // Mock
}

export function fromUTC(date: Date, timezone: string): Date {
  return new Date(date.getTime()); // Mock
}
