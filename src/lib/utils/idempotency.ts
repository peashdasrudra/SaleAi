import crypto from 'crypto';

// In-memory cache for idempotency keys (TTL based)
const idempotencyCache = new Map<string, number>();

export function generateIdempotencyKey(...parts: string[]): string {
  const hash = crypto.createHash('sha256');
  hash.update(parts.join('|'));
  return hash.digest('hex');
}

export function checkIdempotency(key: string): boolean {
  const expiry = idempotencyCache.get(key);
  if (!expiry) return false;
  
  if (Date.now() > expiry) {
    idempotencyCache.delete(key);
    return false;
  }
  
  return true;
}

export function recordIdempotency(key: string, ttlMs: number = 3600000): void { // Default 1 hour
  idempotencyCache.set(key, Date.now() + ttlMs);
}
