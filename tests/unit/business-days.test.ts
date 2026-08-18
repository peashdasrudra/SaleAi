import { describe, it, expect } from 'vitest';

function isBusinessDay(date: Date, allowedDays = [1, 2, 3, 4, 5]) {
  const day = date.getDay();
  return allowedDays.includes(day);
}

function addBusinessDays(date: Date, days: number, allowedDays = [1, 2, 3, 4, 5]) {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    if (isBusinessDay(result, allowedDays)) {
      added++;
    }
  }
  return result;
}

function getNextBusinessDay(date: Date, allowedDays = [1, 2, 3, 4, 5]) {
  return addBusinessDays(date, 1, allowedDays);
}

describe('Business Days', () => {
  it('adds 3 business days from Monday -> Thursday', () => {
    const monday = new Date('2023-10-02T12:00:00Z'); // Monday
    const thursday = addBusinessDays(monday, 3);
    expect(thursday.getDay()).toBe(4); // Thursday
  });

  it('adds 1 business day from Friday -> Monday', () => {
    const friday = new Date('2023-10-06T12:00:00Z'); // Friday
    const monday = addBusinessDays(friday, 1);
    expect(monday.getDay()).toBe(1); // Monday
  });

  it('adds 5 business days across a weekend', () => {
    const wednesday = new Date('2023-10-04T12:00:00Z'); // Wednesday
    const nextWednesday = addBusinessDays(wednesday, 5);
    expect(nextWednesday.getDay()).toBe(3); // Wednesday
  });

  it('respects custom sending days (e.g. MON,WED,FRI only)', () => {
    const monday = new Date('2023-10-02T12:00:00Z'); // Monday
    // add 1 business day, allowed days: Mon (1), Wed (3), Fri (5)
    const nextDay = addBusinessDays(monday, 1, [1, 3, 5]);
    expect(nextDay.getDay()).toBe(3); // Wednesday
  });

  it('checks if a day is a business day', () => {
    const saturday = new Date('2023-10-07T12:00:00Z');
    expect(isBusinessDay(saturday)).toBe(false);
    
    const monday = new Date('2023-10-02T12:00:00Z');
    expect(isBusinessDay(monday)).toBe(true);
  });

  it('gets next business day correctly', () => {
    const friday = new Date('2023-10-06T12:00:00Z');
    const monday = getNextBusinessDay(friday);
    expect(monday.getDay()).toBe(1);
  });
});
