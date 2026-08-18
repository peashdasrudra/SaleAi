import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock DB
let suppressions: Set<string> = new Set();

const db = {
  addSuppression: async (type: 'email' | 'domain', value: string) => {
    suppressions.add(`${type}:${value.toLowerCase()}`);
  },
  removeSuppression: async (type: 'email' | 'domain', value: string) => {
    suppressions.delete(`${type}:${value.toLowerCase()}`);
  },
  isSuppressed: async (email: string) => {
    const normalizedEmail = email.toLowerCase();
    const domain = normalizedEmail.split('@')[1];
    return suppressions.has(`email:${normalizedEmail}`) || suppressions.has(`domain:${domain}`);
  },
  bulkCheck: async (emails: string[]) => {
    const results = [];
    for (const email of emails) {
      const normalizedEmail = email.toLowerCase();
      const domain = normalizedEmail.split('@')[1];
      const suppressed = suppressions.has(`email:${normalizedEmail}`) || suppressions.has(`domain:${domain}`);
      results.push({ email, suppressed });
    }
    return results;
  }
};

describe('Suppression', () => {
  beforeEach(() => {
    suppressions.clear();
  });

  it('adds email suppression', async () => {
    await db.addSuppression('email', 'bad@example.com');
    const result = await db.isSuppressed('bad@example.com');
    expect(result).toBe(true);
  });

  it('adds domain suppression', async () => {
    await db.addSuppression('domain', 'spam.com');
    const result = await db.isSuppressed('user@spam.com');
    expect(result).toBe(true);
  });

  it('blocks sending for suppressed emails', async () => {
    await db.addSuppression('email', 'block@example.com');
    const safeToSend = !(await db.isSuppressed('block@example.com'));
    expect(safeToSend).toBe(false);
  });

  it('removes suppression', async () => {
    await db.addSuppression('email', 'temp@example.com');
    await db.removeSuppression('email', 'temp@example.com');
    const result = await db.isSuppressed('temp@example.com');
    expect(result).toBe(false);
  });

  it('performs bulk check correctly', async () => {
    await db.addSuppression('email', 'bad@example.com');
    await db.addSuppression('domain', 'spam.com');
    
    const results = await db.bulkCheck([
      'good@example.com',
      'bad@example.com',
      'user@spam.com'
    ]);
    
    expect(results).toEqual([
      { email: 'good@example.com', suppressed: false },
      { email: 'bad@example.com', suppressed: true },
      { email: 'user@spam.com', suppressed: true }
    ]);
  });
});
