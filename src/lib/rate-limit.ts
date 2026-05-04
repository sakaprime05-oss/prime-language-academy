type Bucket = {
  count: number;
  resetAt: number;
};

const globalBuckets = globalThis as unknown as {
  __plaRateLimit?: Map<string, Bucket>;
};

const buckets = globalBuckets.__plaRateLimit || new Map<string, Bucket>();
if (!globalBuckets.__plaRateLimit) globalBuckets.__plaRateLimit = buckets;

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { ok: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

export function rateLimitKey(scope: string, identifier: string | null | undefined) {
  return `${scope}:${String(identifier || "anonymous").toLowerCase().trim()}`;
}
