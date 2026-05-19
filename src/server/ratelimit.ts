type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 60_000;
const MAX_HITS = 20;
const buckets = new Map<string, Bucket>();

export type RateLimitResult = { allowed: boolean; remaining: number; resetIn: number };

export function rateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_HITS - 1, resetIn: WINDOW_MS };
  }
  if (b.count >= MAX_HITS) {
    return { allowed: false, remaining: 0, resetIn: b.resetAt - now };
  }
  b.count++;
  return { allowed: true, remaining: MAX_HITS - b.count, resetIn: b.resetAt - now };
}

// Opportunistic cleanup to avoid Map growth on hot Lambdas
let lastSweep = 0;
setInterval(() => {
  const now = Date.now();
  if (now - lastSweep < 5 * 60_000) return;
  lastSweep = now;
  for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k);
}, 60_000).unref?.();
