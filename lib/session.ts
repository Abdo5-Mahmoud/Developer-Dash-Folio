import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME, verifySession, type Session } from "@/lib/auth";

/**
 * Server-side session guard for API routes and server components.
 * proxy.ts does not match /api/* paths, so every admin API route
 * must call this before performing a mutation.
 */
export async function requireAdminSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}