import { NextResponse } from "next/server";

import {
  createSession,
  SESSION_COOKIE_NAME,
  sanitizeRedirectPath,
  sessionCookie,
  validateAdminCredentials,
} from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { success } = checkRateLimit({ ip, keyPrefix: "login" });

  if (!success) {
    return Response.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");
  const destination = sanitizeRedirectPath(formData.get("next"));

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.redirect(
      new URL("/login?error=invalid", request.url),
      303,
    );
  }

  try {
    const isValid = await validateAdminCredentials(email, password);

    if (!isValid) {
      return NextResponse.redirect(
        new URL("/login?error=invalid", request.url),
        303,
      );
    }

    const response = NextResponse.redirect(
      new URL(destination, request.url),
      303,
    );
    response.cookies.set(
      SESSION_COOKIE_NAME,
      createSession(email),
      sessionCookie,
    );
    return response;
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
