interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, TokenBucket>();
const LIMIT = 30; // 30 tokens maximum
const REFILL_RATE = 30 / 60000; // 30 tokens per minute (or 30/60000 per millisecond)
const PURGE_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  // Purge stale entries (>5 minutes idle) using forEach to avoid ES5 iteration compiler errors
  buckets.forEach((bucket, key) => {
    if (now - bucket.lastRefill > PURGE_THRESHOLD) {
      buckets.delete(key);
    }
  });

  let bucket = buckets.get(ip);

  if (!bucket) {
    bucket = { tokens: LIMIT - 1, lastRefill: now };
    buckets.set(ip, bucket);
    return true; // First request is allowed, tokens initialized to LIMIT - 1
  }

  // Refill tokens continuously based on time elapsed
  const elapsed = now - bucket.lastRefill;
  const refilledTokens = Math.min(LIMIT, bucket.tokens + elapsed * REFILL_RATE);

  if (refilledTokens >= 1) {
    bucket.tokens = refilledTokens - 1;
    bucket.lastRefill = now;
    buckets.set(ip, bucket);
    return true;
  }

  // Refilled tokens are updated but not decremented since the request is blocked
  bucket.tokens = refilledTokens;
  bucket.lastRefill = now;
  buckets.set(ip, bucket);
  return false;
}
