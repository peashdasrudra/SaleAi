import { describe, it, expect } from 'vitest';

function getUSStateTimezone(state: string) {
  const map: Record<string, string> = {
    CA: 'America/Los_Angeles',
    NY: 'America/New_York',
    TX: 'America/Chicago',
  };
  return map[state.toUpperCase()] || 'America/New_York';
}

function getUKTimezone() {
  return 'Europe/London';
}

function isWithinSendingWindow(date: Date, tz: string, startHour = 9, endHour = 17) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    hour12: false
  });
  const hour = parseInt(formatter.format(date), 10);
  return hour >= startHour && hour < endHour;
}

describe('Timezone Utils', () => {
  it('maps US states to timezones', () => {
    expect(getUSStateTimezone('CA')).toBe('America/Los_Angeles');
    expect(getUSStateTimezone('NY')).toBe('America/New_York');
    expect(getUSStateTimezone('TX')).toBe('America/Chicago');
  });

  it('maps UK to Europe/London', () => {
    expect(getUKTimezone()).toBe('Europe/London');
  });

  it('checks if time is within sending window (9am-5pm)', () => {
    // Assume input date is UTC
    // 2026-08-19T14:00:00Z -> 10:00 AM EDT (America/New_York) -> Within Window
    const date1 = new Date('2026-08-19T14:00:00Z');
    expect(isWithinSendingWindow(date1, 'America/New_York')).toBe(true);
    
    // 2026-08-19T08:00:00Z -> 04:00 AM EDT -> Outside Window
    const date2 = new Date('2026-08-19T08:00:00Z');
    expect(isWithinSendingWindow(date2, 'America/New_York')).toBe(false);
  });
});
