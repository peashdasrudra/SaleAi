import { describe, it, expect } from 'vitest';

function validateEmail(email: string) {
  if (!email) return false;
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!regex.test(email)) return false;
  if (email.includes('..')) return false;
  return true;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function extractDomain(email: string) {
  if (!email || !email.includes('@')) return '';
  return email.split('@')[1].toLowerCase().trim();
}

const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];

function isBusinessEmail(email: string) {
  const domain = extractDomain(email);
  return domain && !freeProviders.includes(domain);
}

describe('Email Validator', () => {
  it('validates correct email formats', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
  });

  it('rejects invalid formats', () => {
    expect(validateEmail('no-at-sign.com')).toBe(false);
    expect(validateEmail('no-domain@.com')).toBe(false);
    expect(validateEmail('double..dot@example.com')).toBe(false);
    expect(validateEmail('spaces in@example.com')).toBe(false);
  });

  it('normalizes emails (lowercase, trim)', () => {
    expect(normalizeEmail('  TEST@Example.com ')).toBe('test@example.com');
  });

  it('detects free providers', () => {
    expect(isBusinessEmail('user@gmail.com')).toBe(false);
    expect(isBusinessEmail('user@yahoo.com')).toBe(false);
  });

  it('detects business emails', () => {
    expect(isBusinessEmail('user@company.com')).toBe(true);
    expect(isBusinessEmail('ceo@startup.io')).toBe(true);
  });

  it('extracts domain correctly', () => {
    expect(extractDomain('user@company.com')).toBe('company.com');
  });
});
