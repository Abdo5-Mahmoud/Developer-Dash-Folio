import { createHmac, randomBytes, scryptSync } from "node:crypto";

import {
  createSession,
  sanitizeRedirectPath,
  validateAdminCredentials,
  verifySession,
} from "@/lib/auth";

const TEST_EMAIL = "Admin@Example.com";
const TEST_PASSWORD = "StrongPass!123";
const TEST_SECRET = "unit-test-secret";

function buildPasswordHash(password: string) {
  const salt = randomBytes(16);
  const derivedKey = scryptSync(password, salt, 32, { N: 2, r: 8, p: 1 });

  return [
    "scrypt",
    "2",
    "8",
    "1",
    salt.toString("base64url"),
    derivedKey.toString("base64url"),
  ].join("$");
}

describe("authentication logic", () => {
  beforeEach(() => {
    process.env.ADMIN_EMAIL = TEST_EMAIL;
    process.env.AUTH_SECRET = TEST_SECRET;
    process.env.ADMIN_PASSWORD_HASH = buildPasswordHash(TEST_PASSWORD);
  });

  afterEach(() => {
    delete process.env.ADMIN_EMAIL;
    delete process.env.AUTH_SECRET;
    delete process.env.ADMIN_PASSWORD_HASH;
  });

  test("validateAdminCredentials accepts the correct email and password", async () => {
    await expect(
      validateAdminCredentials(" admin@example.com ", TEST_PASSWORD),
    ).resolves.toBe(true);
  });

  test("validateAdminCredentials rejects a bad password", async () => {
    await expect(
      validateAdminCredentials(TEST_EMAIL, "wrong-pass"),
    ).resolves.toBe(false);
  });

  test("validateAdminCredentials rejects a bad email", async () => {
    await expect(
      validateAdminCredentials("other@example.com", TEST_PASSWORD),
    ).resolves.toBe(false);
  });

  test("createSession produces a signed, expiring session token", () => {
    const sessionToken = createSession(" Admin@Example.com ");
    const [payload, signature] = sessionToken.split(".");

    expect(typeof sessionToken).toBe("string");
    expect(payload).toBeTruthy();
    expect(signature).toBeTruthy();

    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    expect(decoded.email).toBe("admin@example.com");
    expect(typeof decoded.expiresAt).toBe("number");
    expect(decoded.expiresAt).toBeGreaterThan(Date.now());
  });

  test("verifySession accepts a valid token", () => {
    const sessionToken = createSession(TEST_EMAIL);

    expect(verifySession(sessionToken)).toEqual(
      expect.objectContaining({
        email: "admin@example.com",
        expiresAt: expect.any(Number),
      }),
    );
  });

  test("verifySession rejects an expired session token", () => {
    const payload = Buffer.from(
      JSON.stringify({
        email: "admin@example.com",
        expiresAt: Date.now() - 1000,
      }),
    ).toString("base64url");
    const signature = createHmac("sha256", TEST_SECRET)
      .update(payload)
      .digest("base64url");

    expect(verifySession(`${payload}.${signature}`)).toBeNull();
  });

  test("verifySession rejects a tampered signature", () => {
    const sessionToken = createSession(TEST_EMAIL);
    const [payload] = sessionToken.split(".");

    expect(verifySession(`${payload}.tampered-signature`)).toBeNull();
  });

  test("verifySession rejects a malformed token", () => {
    expect(verifySession(undefined)).toBeNull();
    expect(verifySession("abc")).toBeNull();
    expect(verifySession("a.b.c")).toBeNull();
  });

  test("verifySession rejects tokens for a different configured admin email", () => {
    const payload = Buffer.from(
      JSON.stringify({
        email: "other@example.com",
        expiresAt: Date.now() + 60_000,
      }),
    ).toString("base64url");
    const signature = createHmac("sha256", TEST_SECRET)
      .update(payload)
      .digest("base64url");

    expect(verifySession(`${payload}.${signature}`)).toBeNull();
  });

  test("sanitizeRedirectPath keeps safe relative paths", () => {
    expect(sanitizeRedirectPath("/admin/dashboard")).toBe("/admin/dashboard");
    expect(sanitizeRedirectPath("/projects?tab=all")).toBe("/projects?tab=all");
  });

  test("sanitizeRedirectPath falls back for unsafe redirects and admin roots", () => {
    expect(sanitizeRedirectPath("https://evil.example")).toBe(
      "/admin/dashboard",
    );
    expect(sanitizeRedirectPath("//evil.example")).toBe("/admin/dashboard");
    expect(sanitizeRedirectPath("/admin")).toBe("/admin/dashboard");
    expect(sanitizeRedirectPath("/admin/")).toBe("/admin/dashboard");
    expect(sanitizeRedirectPath(null)).toBe("/admin/dashboard");
  });
});
