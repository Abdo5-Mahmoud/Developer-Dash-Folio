import "node:crypto";

import {
  createHmac,
  scrypt as scryptCallback,
  timingSafeEqual,
  type ScryptOptions,
} from "node:crypto";

function scrypt(
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, keylen, options, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}

export const SESSION_COOKIE_NAME = "devfolio_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

export type Session = {
  email: string;
  expiresAt: number;
};

type AuthConfig = {
  email: string;
  passwordHash: string;
  secret: string;
};

function getAuthConfig(): AuthConfig {
  const { ADMIN_EMAIL, ADMIN_PASSWORD_HASH, AUTH_SECRET } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH || !AUTH_SECRET) {
    throw new Error(
      "Missing ADMIN_EMAIL, ADMIN_PASSWORD_HASH, or AUTH_SECRET environment variable",
    );
  }

  return {
    email: ADMIN_EMAIL,
    passwordHash: ADMIN_PASSWORD_HASH,
    secret: AUTH_SECRET,
  };
}

function encode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(left: Buffer, right: Buffer) {
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * Verifies a Node scrypt hash in this format:
 * scrypt$N$r$p$base64url-salt$base64url-derived-key
 */
async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, n, r, p, salt, derivedKey, ...extra] =
    storedHash.split("$");
  if (
    algorithm !== "scrypt" ||
    extra.length > 0 ||
    !n ||
    !r ||
    !p ||
    !salt ||
    !derivedKey
  ) {
    return false;
  }

  const cost = Number(n);
  const blockSize = Number(r);
  const parallelization = Number(p);
  const expected = Buffer.from(derivedKey, "base64url");
  if (
    !Number.isInteger(cost) ||
    !Number.isInteger(blockSize) ||
    !Number.isInteger(parallelization) ||
    cost < 2 ||
    blockSize < 1 ||
    parallelization < 1 ||
    expected.length === 0
  ) {
    return false;
  }

  const actual = await scrypt(
    password,
    Buffer.from(salt, "base64url"),
    expected.length,
    {
      N: cost,
      r: blockSize,
      p: parallelization,
    },
  );

  return safeEqual(actual, expected);
}

export async function validateAdminCredentials(
  email: string,
  password: string,
) {
  const config = getAuthConfig();
  const normalizedInput = email.trim().toLowerCase();
  const normalizedTarget = config.email.trim().toLowerCase();
  if (!safeEqual(Buffer.from(normalizedInput), Buffer.from(normalizedTarget))) return false;
  return verifyPassword(password, config.passwordHash);
}

export function createSession(email: string) {
  const { secret } = getAuthConfig();
  const payload = encode(
    JSON.stringify({
      email: email.trim().toLowerCase(),
      expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000,
    } satisfies Session),
  );
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySession(
  sessionToken: string | undefined,
): Session | null {
  if (!sessionToken) return null;

  const [payload, signature, ...extra] = sessionToken.split(".");
  if (!payload || !signature || extra.length > 0) return null;

  try {
    const { secret, email } = getAuthConfig();
    const expectedSignature = sign(payload, secret);
    if (!safeEqual(Buffer.from(signature), Buffer.from(expectedSignature)))
      return null;

    const session = JSON.parse(decode(payload)) as Session;
    if (
      typeof session.email !== "string" ||
      typeof session.expiresAt !== "number" ||
      session.expiresAt <= Date.now() ||
      !safeEqual(
        Buffer.from(session.email.trim().toLowerCase()),
        Buffer.from(email.trim().toLowerCase()),
      )
    ) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export const DEFAULT_LOGIN_REDIRECT = "/admin/dashboard";

/**
 * Accepts only relative same-origin paths ("/foo", "/foo?bar=1").
 * Anything else falls back to the dashboard.
 */
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
  maxAge: SESSION_DURATION_SECONDS,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
