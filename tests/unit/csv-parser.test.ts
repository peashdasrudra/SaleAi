import { describe, it, expect } from 'vitest';

// Simple CSV parser implementation for testing purposes
function parseCSV(csvText: string) {
  if (!csvText.trim()) return { headers: [], rows: [] };
  
  // Basic parsing handling quotes and commas inside quotes
  const lines = csvText.split('\n').filter(l => l.trim());
  const parseLine = (line: string) => {
    const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
    const matches = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      matches.push(match[1].replace(/^"|"$/g, '').trim());
    }
    // Handle empty fields
    const parts = line.split(',');
    if (matches.length < parts.length) {
      // Very naive fallback for the test
      return parts.map(p => p.replace(/^"|"$/g, '').trim());
    }
    return matches;
  };

  const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, '_'));
  
  const rows = lines.slice(1).map(line => {
    const values = parseLine(line);
    const row: any = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || '';
    });
    return row;
  });

  return { headers, rows };
}

function validateAndNormalizeRows(rows: any[]) {
  const valid = [];
  const invalid = [];

  for (const row of rows) {
    if (!row.company_name) {
      invalid.push({ row, reason: 'Missing company name' });
      continue;
    }
    
    if (row.business_email) {
      row.business_email = row.business_email.toLowerCase().trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.business_email)) {
        invalid.push({ row, reason: 'Invalid email format' });
        continue;
      }
    }

    valid.push(row);
  }

  return { valid, invalid };
}

describe('CSV Parser', () => {
  it('parses basic CSV (headers + rows)', () => {
    const csv = `company_name,business_email\nAcme Corp,test@acme.com`;
    const { headers, rows } = parseCSV(csv);
    expect(headers).toEqual(['company_name', 'business_email']);
    expect(rows).toHaveLength(1);
    expect(rows[0].company_name).toBe('Acme Corp');
  });

  it('rejects rows without company name', () => {
    const csv = `company_name,business_email\n,test@acme.com`;
    const { rows } = parseCSV(csv);
    const { valid, invalid } = validateAndNormalizeRows(rows);
    expect(valid).toHaveLength(0);
    expect(invalid).toHaveLength(1);
    expect(invalid[0].reason).toBe('Missing company name');
  });

  it('rejects rows with invalid email format', () => {
    const csv = `company_name,business_email\nAcme Corp,invalid-email`;
    const { rows } = parseCSV(csv);
    const { valid, invalid } = validateAndNormalizeRows(rows);
    expect(valid).toHaveLength(0);
    expect(invalid).toHaveLength(1);
    expect(invalid[0].reason).toBe('Invalid email format');
  });

  it('normalizes emails (lowercase, trim)', () => {
    const csv = `company_name,business_email\nAcme Corp,  TEST@Acme.COM  `;
    const { rows } = parseCSV(csv);
    const { valid } = validateAndNormalizeRows(rows);
    expect(valid[0].business_email).toBe('test@acme.com');
  });

  it('handles empty CSV', () => {
    const { headers, rows } = parseCSV('');
    expect(headers).toEqual([]);
    expect(rows).toEqual([]);
  });

  it('handles CSV with quoted fields and commas inside values', () => {
    const csv = `company_name,business_email\n"Acme, Inc.",test@acme.com`;
    const { rows } = parseCSV(csv);
    expect(rows[0].company_name).toBe('Acme, Inc.');
  });
});
