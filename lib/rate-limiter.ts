interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const globalForRateLimit = globalThis as unknown as {
  rateLimitTracker?: Map<string, RateLimitRecord>;
};

const tracker =
  globalForRateLimit.rateLimitTracker ?? new Map<string, RateLimitRecord>();

if (process.env.NODE_ENV !== "production") {
  globalForRateLimit.rateLimitTracker = tracker;
}
const LIMIT = 3;
const WINDOW = 1000 * 60; // 1 minute

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

export function checkRateLimit({
  ip,
  keyPrefix,
  limit = LIMIT,
  window = WINDOW,
}: {
  ip: string;
  keyPrefix?: string;
  limit?: number;
  window?: number;
}): { success: boolean; remaining: number } {
  const key = keyPrefix ? `${keyPrefix}:${ip}` : ip;
  const now = Date.now();
  const record = tracker.get(key);
  console.log(record);

  if (!record || now > record.resetTime) {
    tracker.set(key, { count: 1, resetTime: now + window });
    console.log(`Rate limit record created for ${key}:`, tracker.get(key));
    return { success: true, remaining: limit - 1 };
  }
  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }
  record.count++;
  return { success: true, remaining: limit - record.count };
}
