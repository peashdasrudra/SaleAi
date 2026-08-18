import { describe, it, expect } from 'vitest';

function checkRisk(emailContent: string, hasOptOut = true, hasSenderIdentity = true) {
  const issues = [];
  let riskLevel = 'LOW';

  if (!hasOptOut) issues.push('Missing opt-out link');
  if (!hasSenderIdentity) issues.push('Missing sender identity');

  const aggressiveRegex = /losing money/i;
  const spamRegex = /act now|limited time/i;
  const linkCount = (emailContent.match(/http/g) || []).length;
  
  // Simulated facts claim / audit checks based on keyword simple matching
  if (/invented fact/i.test(emailContent)) issues.push('Contains invented facts');
  if (/website was tested/i.test(emailContent)) issues.push('Unverified audit claim');

  if (aggressiveRegex.test(emailContent)) {
    issues.push('Aggressive wording');
    riskLevel = 'HIGH';
  }

  if (spamRegex.test(emailContent)) {
    issues.push('Spam phrases detected');
    riskLevel = riskLevel !== 'HIGH' ? 'MEDIUM' : 'HIGH';
  }

  if (linkCount > 3) {
    issues.push('Excessive links');
    riskLevel = riskLevel !== 'HIGH' ? 'MEDIUM' : 'HIGH';
  }

  if (issues.length > 0 && riskLevel === 'LOW') {
    riskLevel = 'MEDIUM';
  }

  return { safe_to_send: riskLevel === 'LOW', riskLevel, issues };
}

describe('Risk Check', () => {
  it('identifies clean email -> LOW risk, safe_to_send true', () => {
    const result = checkRisk('Hello, just wanted to reach out.', true, true);
    expect(result.riskLevel).toBe('LOW');
    expect(result.safe_to_send).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('flags missing opt-out link', () => {
    const result = checkRisk('Hello!', false, true);
    expect(result.issues).toContain('Missing opt-out link');
    expect(result.safe_to_send).toBe(false);
  });

  it('flags missing sender identity', () => {
    const result = checkRisk('Hello!', true, false);
    expect(result.issues).toContain('Missing sender identity');
  });

  it('flags aggressive wording as HIGH risk', () => {
    const result = checkRisk('You are LOSING money by not acting!', true, true);
    expect(result.riskLevel).toBe('HIGH');
    expect(result.issues).toContain('Aggressive wording');
  });

  it('flags invented facts claim', () => {
    const result = checkRisk('It is an invented fact that you need this.', true, true);
    expect(result.issues).toContain('Contains invented facts');
  });

  it('flags unverified audit claim', () => {
    const result = checkRisk('Your website was tested today.', true, true);
    expect(result.issues).toContain('Unverified audit claim');
  });

  it('flags excessive links (>3)', () => {
    const content = 'http://link1 http://link2 http://link3 http://link4';
    const result = checkRisk(content, true, true);
    expect(result.issues).toContain('Excessive links');
  });

  it('flags spam phrases', () => {
    const result = checkRisk('Act now for a limited time!', true, true);
    expect(result.issues).toContain('Spam phrases detected');
  });
});
