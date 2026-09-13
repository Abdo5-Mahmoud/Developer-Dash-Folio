import jwt, { type JwtPayload } from "jsonwebtoken";

import { UserModel, type UserRole } from "@/lib/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import { comparePassword } from "./bcrypt";

export const SESSION_COOKIE_NAME = "devfolio_admin_session";
const SESSION_DURATION = "8h";

export type Session = {
  email: string;
  userId: string;
  role: UserRole;
  expiresAt: number;
};

function getAuthSecret() {
  if (!process.env.AUTH_SECRET) {
    throw new Error("Missing AUTH_SECRET environment variable");
  }
  return process.env.AUTH_SECRET;
}

export async function authenticateOwner(
  email: string,
  password: string,
): Promise<{ id: string; email: string; role: UserRole } | null> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) return null;

  await connectToDatabase();
  const user = await UserModel.findOne({
    email: normalizedEmail,
    role: "owner",
  }).lean();

  if (!user) return null;

  const validPassword = await comparePassword(password, user.passwordHash);
  if (!validPassword) return null;

  return { id: user._id.toString(), email: user.email, role: user.role };
}

export async function validateAdminCredentials(
  email: string,
  password: string,
) {
  return Boolean(await authenticateOwner(email, password));
}

export function createSession(user: {
  id: string;
  email: string;
  role: UserRole;
}) {
  return jwt.sign(
    {
      email: user.email.trim().toLowerCase(),
      userId: user.id,
      role: user.role,
    },
    getAuthSecret(),
    { algorithm: "HS256", expiresIn: SESSION_DURATION },
  );
}

export async function verifySession(
  sessionToken: string | undefined,
): Promise<Session | null> {
  if (!sessionToken) return null;

  try {
    const payload = jwt.verify(sessionToken, getAuthSecret(), {
      algorithms: ["HS256"],
    }) as JwtPayload & {
      email?: unknown;
      userId?: unknown;
      role?: unknown;
    };
    const email = payload.email;
    const userId = payload.userId;
    const role = payload.role;
    const expiresAt = payload.exp;

    if (
      typeof email !== "string" ||
      typeof userId !== "string" ||
      role !== "owner" ||
      typeof expiresAt !== "number" ||
      !userId.trim()
    ) {
      return null;
    }

    return { email, userId, role, expiresAt: expiresAt * 1000 };
  } catch {
    return null;
  }
}

export const DEFAULT_LOGIN_REDIRECT = "/admin/dashboard";

export function sanitizeRedirectPath(
  value: string | FormDataEntryValue | null | undefined,
) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return DEFAULT_LOGIN_REDIRECT;
  }

  if (value === "/admin" || value === "/admin/") {
    return DEFAULT_LOGIN_REDIRECT;
  }

  return value;
}

export const sessionCookie = {
  httpOnly: true,
  maxAge: 60 * 60 * 8,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
