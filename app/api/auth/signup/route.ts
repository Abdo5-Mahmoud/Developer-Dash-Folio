import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { UserModel } from "@/lib/models/user";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { success } = checkRateLimit({ ip, keyPrefix: "signup" });
  if (!success) {
    return Response.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.redirect(new URL("/signup?error=invalid", request.url), 303);
  }

  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof confirmPassword !== "string" ||
    !/^\S+@\S+\.\S+$/.test(email.trim()) ||
    password.length < 8 ||
    password !== confirmPassword
  ) {
    return NextResponse.redirect(new URL("/signup?error=invalid", request.url), 303);
  }

  try {
    await connectToDatabase();
    const ownerExists = await UserModel.exists({ role: "owner" });
    if (ownerExists) {
      return NextResponse.redirect(new URL("/login", request.url), 303);
    }

    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.hash(password, 12);
    await UserModel.create({
      email: email.trim().toLowerCase(),
      passwordHash,
      role: "owner",
    });

    return NextResponse.redirect(
      new URL("/login?created=1", request.url),
      303,
    );
  } catch {
    return NextResponse.redirect(
      new URL("/signup?error=unavailable", request.url),
      303,
    );
  }
}
