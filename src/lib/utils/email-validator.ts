export const FREE_EMAIL_PROVIDERS = new Set([
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'mail.com',
  'protonmail.com',
  'zoho.com',
  'yandex.com'
]);

export function validateEmail(email: string): { valid: boolean; reason?: string } {
  if (!email) return { valid: false, reason: 'Email is empty' };
  
  if (/\s/.test(email)) return { valid: false, reason: 'Contains spaces' };
  
  if (/\.\./.test(email)) return { valid: false, reason: 'Contains consecutive dots' };
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(email)) return { valid: false, reason: 'Invalid format' };
  
  const domain = extractEmailDomain(email);
  if (!domain || domain.split('.').length < 2) {
    return { valid: false, reason: 'Invalid TLD' };
  }
  
  const tld = domain.split('.').pop();
  if (tld && tld.length < 2) return { valid: false, reason: 'TLD must be at least 2 characters' };

  return { valid: true };
}

export function normalizeEmail(email: string): string {
  let normalized = email.trim().toLowerCase();
  
  const parts = normalized.split('@');
  if (parts.length === 2) {
    let [local, domain] = parts;
    if (domain === 'gmail.com') {
      local = local.replace(/\./g, ''); // Remove dots for gmail
      local = local.split('+')[0]; // Remove subaddressing
    }
    normalized = `${local}@${domain}`;
  }
  
  return normalized;
}

export function extractEmailDomain(email: string): string {
  const parts = email.split('@');
  return parts.length === 2 ? parts[1].toLowerCase() : '';
}

export function isBusinessEmail(email: string): boolean {
  const domain = extractEmailDomain(email);
  return domain.length > 0 && !FREE_EMAIL_PROVIDERS.has(domain);
}
