import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const mockLean = jest.fn<() => Promise<unknown>>();
const mockFindOne =
  jest.fn<(...args: unknown[]) => { lean: typeof mockLean }>();

jest.mock("@/lib/mongodb", () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock("@/lib/models/user", () => ({
  UserModel: { findOne: (...args: unknown[]) => mockFindOne(...args) },
}));

const {
  authenticateOwner,
  createSession,
  sanitizeRedirectPath,
  verifySession,
} = require("@/lib/auth") as typeof import("@/lib/auth");

const TEST_EMAIL = "Admin@Example.com";
const TEST_PASSWORD = "StrongPass!123";
const TEST_SECRET = "unit-test-secret";
const OWNER = {
  _id: { toString: () => "owner-1" },
  email: "admin@example.com",
  role: "owner" as const,
};

beforeEach(async () => {
  process.env.AUTH_SECRET = TEST_SECRET;
  mockLean.mockResolvedValue({
    ...OWNER,
    passwordHash: await bcrypt.hash(TEST_PASSWORD, 4),
  });
  mockFindOne.mockReturnValue({ lean: mockLean });
});

afterEach(() => {
  delete process.env.AUTH_SECRET;
  jest.clearAllMocks();
});

describe("Mongo owner authentication", () => {
  test("authenticates the owner with a bcrypt password", async () => {
    await expect(
      authenticateOwner(" admin@example.com ", TEST_PASSWORD),
    ).resolves.toMatchObject({ id: "owner-1", role: "owner" });
  });

  test("rejects a bad password and non-owner record", async () => {
    await expect(
      authenticateOwner(TEST_EMAIL, "wrong-pass"),
    ).resolves.toBeNull();

    mockLean.mockResolvedValue(null);
    await expect(
      authenticateOwner("other@example.com", TEST_PASSWORD),
    ).resolves.toBeNull();
  });
});

describe("JWT sessions", () => {
  test("creates and verifies an owner JWT", async () => {
    const token = await createSession({
      id: "owner-1",
      email: TEST_EMAIL,
      role: "owner",
    });
    await expect(verifySession(token)).resolves.toMatchObject({
      email: "admin@example.com",
      userId: "owner-1",
      role: "owner",
      expiresAt: expect.any(Number),
    });
  });

  test("rejects a tampered and malformed JWT", async () => {
    const token = await createSession({
      id: "owner-1",
      email: TEST_EMAIL,
      role: "owner",
    });
    const [header, payload] = token.split(".");

    await expect(
      verifySession(`${header}.${payload}.tampered`),
    ).resolves.toBeNull();
    await expect(verifySession(undefined)).resolves.toBeNull();
    await expect(verifySession("not-a-jwt")).resolves.toBeNull();
  });

  test("rejects an expired JWT", async () => {
    const token = jwt.sign(
      { email: "admin@example.com", userId: "owner-1", role: "owner" },
      TEST_SECRET,
      { algorithm: "HS256", expiresIn: -1 },
    );

    await expect(verifySession(token)).resolves.toBeNull();
  });
});

test("sanitizeRedirectPath keeps safe relative paths", () => {
  expect(sanitizeRedirectPath("/admin/dashboard")).toBe("/admin/dashboard");
  expect(sanitizeRedirectPath("/projects?tab=all")).toBe("/projects?tab=all");
});

test("sanitizeRedirectPath rejects unsafe redirects and admin roots", () => {
  expect(sanitizeRedirectPath("https://evil.example")).toBe("/admin/dashboard");
  expect(sanitizeRedirectPath("//evil.example")).toBe("/admin/dashboard");
  expect(sanitizeRedirectPath("/admin")).toBe("/admin/dashboard");
  expect(sanitizeRedirectPath("/admin/")).toBe("/admin/dashboard");
  expect(sanitizeRedirectPath(null)).toBe("/admin/dashboard");
});
