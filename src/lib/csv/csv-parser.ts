import Papa from 'papaparse';

export interface CreateProspectInput {
  companyName: string;
  businessEmail: string;
  contactFirstName?: string;
  contactLastName?: string;
  publicBusinessPhone?: string;
  website?: string;
  city?: string;
  country: string;
  linkedinUrl?: string;
  teamSize?: string;
}

export function parseCSV(fileContent: string) {
  const result = Papa.parse<Record<string, string>>(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  return {
    headers: result.meta.fields || [],
    rows: result.data,
    errors: result.errors,
  };
}

export function detectHeaders(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  
  const lowerHeaders = headers.map(h => h.toLowerCase().trim());
  
  headers.forEach((original, index) => {
    const lower = lowerHeaders[index];
    
    if (lower.includes('company') || lower.includes('organization') || lower.includes('business name')) mapping['companyName'] = original;
    else if (lower.includes('email') || lower.includes('e-mail')) mapping['businessEmail'] = original;
    else if (lower === 'first name' || lower.includes('first')) mapping['contactFirstName'] = original;
    else if (lower === 'last name' || lower.includes('last')) mapping['contactLastName'] = original;
    else if (lower.includes('phone') || lower.includes('mobile')) mapping['publicBusinessPhone'] = original;
    else if (lower.includes('website') || lower.includes('url')) mapping['website'] = original;
    else if (lower.includes('city')) mapping['city'] = original;
    else if (lower.includes('country')) mapping['country'] = original;
    else if (lower.includes('linkedin')) mapping['linkedinUrl'] = original;
    else if (lower.includes('size') || lower.includes('employees')) mapping['teamSize'] = original;
  });

  return mapping;
}

export function validateAndMapRows(
  rows: Record<string, string>[], 
  fieldMapping: Record<string, string>, 
  defaultCountry: string
) {
  const validRows: CreateProspectInput[] = [];
  const invalidRows: { row: number; errors: string[] }[] = [];
  const warnings: string[] = [];

  const reverseMapping = Object.entries(fieldMapping).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  rows.forEach((row, index) => {
    const rowNum = index + 1;
    const errors: string[] = [];

    const getField = (field: string) => {
      const colName = reverseMapping[field];
      return colName ? row[colName]?.trim() : undefined;
    };

    const companyName = getField('companyName');
    const businessEmail = getField('businessEmail');

    if (!companyName) errors.push('Company Name is required');
    if (!businessEmail) errors.push('Business Email is required');
    else if (!/^\S+@\S+\.\S+$/.test(businessEmail)) errors.push('Invalid email format');

    if (errors.length > 0) {
      invalidRows.push({ row: rowNum, errors });
    } else {
      validRows.push({
        companyName: companyName!,
        businessEmail: businessEmail!,
        contactFirstName: getField('contactFirstName'),
        contactLastName: getField('contactLastName'),
        publicBusinessPhone: getField('publicBusinessPhone'),
        website: getField('website'),
        city: getField('city'),
        country: getField('country') || defaultCountry,
        linkedinUrl: getField('linkedinUrl'),
        teamSize: getField('teamSize'),
      });
    }
  });

  return { validRows, invalidRows, warnings };
}
