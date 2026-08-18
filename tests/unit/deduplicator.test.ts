import { describe, it, expect } from 'vitest';

function extractDomain(email: string): string {
  if (!email || !email.includes('@')) return '';
  let domain = email.split('@')[1].toLowerCase().trim();
  domain = domain.replace(/^(www\.)?/, '');
  return domain;
}

function isDuplicate(prospect: any, existingProspects: any[]): boolean {
  for (const existing of existingProspects) {
    // Exact email match
    if (prospect.email && existing.email && prospect.email.toLowerCase() === existing.email.toLowerCase()) {
      return true;
    }
    
    // Domain match (business rules could vary, but checking domain match here)
    const pDomain = extractDomain(prospect.email);
    const eDomain = extractDomain(existing.email);
    if (pDomain && eDomain && pDomain === eDomain) {
      return true;
    }

    // Company + City match
    if (prospect.company && existing.company && 
        prospect.company.toLowerCase() === existing.company.toLowerCase() &&
        prospect.city && existing.city &&
        prospect.city.toLowerCase() === existing.city.toLowerCase()) {
      return true;
    }
  }
  return false;
}

describe('Deduplicator', () => {
  it('detects exact email match', () => {
    const existing = [{ email: 'john@acme.com' }];
    expect(isDuplicate({ email: 'john@acme.com' }, existing)).toBe(true);
  });

  it('detects case-insensitive email match', () => {
    const existing = [{ email: 'JOHN@acme.com' }];
    expect(isDuplicate({ email: 'john@acme.com' }, existing)).toBe(true);
  });

  it('detects domain match', () => {
    const existing = [{ email: 'alice@acme.com' }];
    expect(isDuplicate({ email: 'bob@acme.com' }, existing)).toBe(true);
  });

  it('detects company name + city match', () => {
    const existing = [{ company: 'Acme Corp', city: 'London' }];
    expect(isDuplicate({ company: 'Acme Corp', city: 'London' }, existing)).toBe(true);
  });

  it('returns false for no match (different companies)', () => {
    const existing = [{ email: 'john@acme.com', company: 'Acme', city: 'London' }];
    expect(isDuplicate({ email: 'alice@other.com', company: 'Other', city: 'Paris' }, existing)).toBe(false);
  });

  it('extracts and normalizes domain from email', () => {
    expect(extractDomain('user@www.example.com')).toBe('example.com');
    expect(extractDomain('user@EXAMPLE.COM')).toBe('example.com');
  });
});
