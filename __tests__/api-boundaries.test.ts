const mockRequireAdminSession = jest.fn();
const mockValidateAdminCredentials = jest.fn();
const mockCreateSession = jest.fn();
const mockParseProjectPayload = jest.fn();
const mockValidateProject = jest.fn();
const mockCreateProject = jest.fn();
const mockUpdateProject = jest.fn();
const mockDeleteProject = jest.fn();

jest.mock("@/lib/auth", () => ({
  SESSION_COOKIE_NAME: "devfolio_admin_session",
  sanitizeRedirectPath: (value: unknown) => {
    if (
      typeof value !== "string" ||
      !value.startsWith("/") ||
      value.startsWith("//") ||
      value === "/admin" ||
      value === "/admin/"
    ) {
      return "/admin/dashboard";
    }
    return value;
  },
  sessionCookie: {
    httpOnly: true,
    maxAge: 28800,
    path: "/",
    sameSite: "lax",
    secure: false,
  },
  createSession: (email: string) =>
    `session:${String(email).trim().toLowerCase()}`,
  validateAdminCredentials: (...args: unknown[]) =>
    mockValidateAdminCredentials(...args),
}));

jest.mock("@/lib/session", () => ({
  requireAdminSession: (...args: unknown[]) => mockRequireAdminSession(...args),
}));

jest.mock("@/features/projects/lib/projects", () => ({
  createProject: (...args: unknown[]) => mockCreateProject(...args),
  parseProjectPayload: (...args: unknown[]) => mockParseProjectPayload(...args),
  updateProject: (...args: unknown[]) => mockUpdateProject(...args),
  deleteProject: (...args: unknown[]) => mockDeleteProject(...args),
  validateProject: (...args: unknown[]) => mockValidateProject(...args),
}));

import { POST as loginRoutePOST } from "@/app/api/auth/login/route";
import {
  DELETE as deleteProjectRouteDELETE,
  PUT as updateProjectRoutePUT,
} from "@/app/api/projects/[id]/route";
import { POST as createProjectRoutePOST } from "@/app/api/projects/route";

describe("API boundary routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateSession.mockImplementation(
      (email: string) => `session:${String(email).trim().toLowerCase()}`,
    );
  });

  test("POST /api/auth/login redirects successfully with a session cookie", async () => {
    mockValidateAdminCredentials.mockResolvedValue(true);

    const form = new URLSearchParams({
      email: "admin@example.com",
      password: "secret",
      next: "/admin/dashboard",
    });

    const response = await loginRoutePOST(
      new Request("https://example.com/login", {
        method: "POST",
        body: form,
      }),
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://example.com/admin/dashboard",
    );
    expect(response.headers.get("set-cookie") ?? "").toContain(
      "devfolio_admin_session=",
    );
    expect(mockValidateAdminCredentials).toHaveBeenCalledWith(
      "admin@example.com",
      "secret",
    );
  });

  test("POST /api/auth/login redirects with invalid credentials", async () => {
    mockValidateAdminCredentials.mockResolvedValue(false);

    const response = await loginRoutePOST(
      new Request("https://example.com/login", {
        method: "POST",
        body: new URLSearchParams({
          email: "admin@example.com",
          password: "wrong-password",
        }),
      }),
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://example.com/login?error=invalid",
    );
  });

  test("POST /api/projects creates a project for an authenticated admin", async () => {
    mockRequireAdminSession.mockResolvedValue({
      email: "admin@example.com",
      expiresAt: Date.now() + 60_000,
    });
    mockParseProjectPayload.mockReturnValue({
      title: "Demo Project",
      summary: "Project summary",
      fullDescription: "Project long body",
      techStack: [{ technologyId: "ts", name: "TypeScript" }],
    });
    mockValidateProject.mockReturnValue({});
    mockCreateProject.mockResolvedValue({
      id: "project-1",
      title: "Demo Project",
      summary: "Project summary",
    });

    const response = await createProjectRoutePOST(
      new Request("https://example.com/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "Demo Project", status: "draft" }),
      }),
    );

    expect(response.status).toBe(201);
    expect(mockRequireAdminSession).toHaveBeenCalledTimes(1);
    expect(mockCreateProject).toHaveBeenCalledTimes(1);

    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.project).toMatchObject({
      id: "project-1",
      title: "Demo Project",
    });
  });

  test("POST /api/projects rejects unauthenticated requests", async () => {
    mockRequireAdminSession.mockResolvedValue(null);

    const response = await createProjectRoutePOST(
      new Request("https://example.com/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "Demo Project" }),
      }),
    );

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body).toEqual({ ok: false });
  });

  test("POST /api/projects rejects validation failures with 422", async () => {
    mockRequireAdminSession.mockResolvedValue({
      email: "admin@example.com",
      expiresAt: Date.now() + 60_000,
    });
    mockParseProjectPayload.mockReturnValue({
      title: "Demo Project",
      summary: "Project summary",
      fullDescription: "Body",
      techStack: [],
    });
    mockValidateProject.mockReturnValue({
      techStack: "At least one technology is required to publish.",
    });

    const response = await createProjectRoutePOST(
      new Request("https://example.com/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "Demo Project", status: "published" }),
      }),
    );

    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.errors).toMatchObject({
      techStack: "At least one technology is required to publish.",
    });
  });

  test("PUT /api/projects/[id] updates a project for an authenticated admin", async () => {
    mockRequireAdminSession.mockResolvedValue({
      email: "admin@example.com",
      expiresAt: Date.now() + 60_000,
    });
    mockParseProjectPayload.mockReturnValue({
      title: "Updated Project",
      summary: "Updated summary",
      fullDescription: "Updated body",
      techStack: [{ technologyId: "ts", name: "TypeScript" }],
    });
    mockValidateProject.mockReturnValue({});
    mockUpdateProject.mockResolvedValue({
      id: "project-1",
      title: "Updated Project",
    });

    const response = await updateProjectRoutePUT(
      new Request("https://example.com/api/projects/project-1", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "Updated Project", status: "draft" }),
      }),
      { params: Promise.resolve({ id: "project-1" }) },
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.project).toMatchObject({ id: "project-1" });
  });

  test("PUT /api/projects/[id] rejects unauthenticated requests", async () => {
    mockRequireAdminSession.mockResolvedValue(null);

    const response = await updateProjectRoutePUT(
      new Request("https://example.com/api/projects/project-1", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "Updated Project" }),
      }),
      { params: Promise.resolve({ id: "project-1" }) },
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ ok: false });
  });

  test("PUT /api/projects/[id] returns 422 when validation fails", async () => {
    mockRequireAdminSession.mockResolvedValue({
      email: "admin@example.com",
      expiresAt: Date.now() + 60_000,
    });
    mockParseProjectPayload.mockReturnValue({
      title: "Updated Project",
      summary: "Updated summary",
      fullDescription: "Updated body",
      techStack: [],
    });
    mockValidateProject.mockReturnValue({
      techStack: "At least one technology is required to publish.",
    });

    const response = await updateProjectRoutePUT(
      new Request("https://example.com/api/projects/project-1", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "Updated Project", status: "published" }),
      }),
      { params: Promise.resolve({ id: "project-1" }) },
    );

    expect(response.status).toBe(422);
    expect(await response.json()).toMatchObject({
      ok: false,
      errors: { techStack: "At least one technology is required to publish." },
    });
  });

  test("PUT /api/projects/[id] returns 404 when the project is missing", async () => {
    mockRequireAdminSession.mockResolvedValue({
      email: "admin@example.com",
      expiresAt: Date.now() + 60_000,
    });
    mockParseProjectPayload.mockReturnValue({
      title: "Updated Project",
      summary: "Updated summary",
      fullDescription: "Updated body",
      techStack: [{ technologyId: "ts", name: "TypeScript" }],
    });
    mockValidateProject.mockReturnValue({});
    mockUpdateProject.mockResolvedValue(null);

    const response = await updateProjectRoutePUT(
      new Request("https://example.com/api/projects/project-missing", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "Updated Project" }),
      }),
      { params: Promise.resolve({ id: "project-missing" }) },
    );

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ ok: false });
  });

  test("DELETE /api/projects/[id] deletes a project for an authenticated admin", async () => {
    mockRequireAdminSession.mockResolvedValue({
      email: "admin@example.com",
      expiresAt: Date.now() + 60_000,
    });
    mockDeleteProject.mockResolvedValue(true);

    const response = await deleteProjectRouteDELETE(
      new Request("https://example.com/api/projects/project-1", {
        method: "DELETE",
      }),
      { params: Promise.resolve({ id: "project-1" }) },
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  test("DELETE /api/projects/[id] rejects unauthenticated requests", async () => {
    mockRequireAdminSession.mockResolvedValue(null);

    const response = await deleteProjectRouteDELETE(
      new Request("https://example.com/api/projects/project-1", {
        method: "DELETE",
      }),
      { params: Promise.resolve({ id: "project-1" }) },
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ ok: false });
  });

  test("DELETE /api/projects/[id] returns 404 when the project is missing", async () => {
    mockRequireAdminSession.mockResolvedValue({
      email: "admin@example.com",
      expiresAt: Date.now() + 60_000,
    });
    mockDeleteProject.mockResolvedValue(false);

    const response = await deleteProjectRouteDELETE(
      new Request("https://example.com/api/projects/project-missing", {
        method: "DELETE",
      }),
      { params: Promise.resolve({ id: "project-missing" }) },
    );

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ ok: false });
  });
});
