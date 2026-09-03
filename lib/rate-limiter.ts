interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const tracker = new Map<string, RateLimitRecord>();
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
  if (!record || now > record.resetTime) {
    tracker.set(key, { count: 1, resetTime: now + window });
    return { success: true, remaining: limit - 1 };
  }
  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }
  record.count++;
  return { success: true, remaining: limit - record.count };
}
