export function normalizeDomain(input: string): string {
  if (!input) return '';
  let domain = input.toLowerCase().trim();
  
  // Remove protocol
  domain = domain.replace(/^https?:\/\//, '');
  
  // Remove www.
  domain = domain.replace(/^www\./, '');
  
  // Remove trailing slashes and paths
  domain = domain.split('/')[0];
  
  // Remove query string or fragments
  domain = domain.split('?')[0].split('#')[0];
  
  return domain;
}

export function extractDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return normalizeDomain(urlObj.hostname);
  } catch (e) {
    return normalizeDomain(url);
  }
}

export function extractDomainFromEmail(email: string): string {
  const parts = email.split('@');
  return parts.length === 2 ? normalizeDomain(parts[1]) : '';
}

export function areSameDomain(a: string, b: string): boolean {
  return normalizeDomain(a) === normalizeDomain(b);
}
