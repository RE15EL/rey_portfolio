import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  ProjectAlreadyExistsError,
  ProjectNotFoundError,
  ProjectUnprocessableDataError,
} from "@/modules/projects/domain/errors";
import { GET, POST } from "./route";

const mocks = vi.hoisted(() => {
  return {
    getAdminApiContext: vi.fn(),
    buildUnauthorizedResponse: vi.fn(),
    createProjectsModule: vi.fn(),
    listAdminExecute: vi.fn(),
    createExecute: vi.fn(),
  };
});

vi.mock("@/lib/auth/get-admin-api-context", () => ({
  getAdminApiContext: mocks.getAdminApiContext,
  buildUnauthorizedResponse: mocks.buildUnauthorizedResponse,
}));

vi.mock("@/modules/projects/infrastructure/projects-module", () => ({
  createProjectsModule: mocks.createProjectsModule,
}));

describe("GET /api/admin/projects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns unauthorized response when caller is not admin", async () => {
    const unauthorizedResponse = Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );

    mocks.getAdminApiContext.mockResolvedValue(null);
    mocks.buildUnauthorizedResponse.mockResolvedValue(unauthorizedResponse);

    const response = await GET();

    expect(response.status).toBe(401);
    expect(mocks.createProjectsModule).not.toHaveBeenCalled();
  });

  it("returns admin projects with stable response contract", async () => {
    const projects = [{ id: "project-1", title: "Project" }];

    mocks.getAdminApiContext.mockResolvedValue({
      userId: "admin-id",
      email: "admin@example.com",
    });
    mocks.createProjectsModule.mockResolvedValue({
      listAdminProjects: {
        execute: mocks.listAdminExecute.mockResolvedValue(projects),
      },
    });

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ data: projects });
  });
});

describe("POST /api/admin/projects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns unauthorized response when caller is not admin", async () => {
    const unauthorizedResponse = Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );

    mocks.getAdminApiContext.mockResolvedValue(null);
    mocks.buildUnauthorizedResponse.mockResolvedValue(unauthorizedResponse);

    const response = await POST(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ title: "Demo", description: "Demo" }),
      })
    );

    expect(response.status).toBe(401);
    expect(mocks.createProjectsModule).not.toHaveBeenCalled();
  });

  it("returns 201 when create succeeds", async () => {
    const created = { id: "project-1", slug: "demo" };

    mocks.getAdminApiContext.mockResolvedValue({
      userId: "admin-id",
      email: "admin@example.com",
    });
    mocks.createProjectsModule.mockResolvedValue({
      createProject: {
        execute: mocks.createExecute.mockResolvedValue(created),
      },
    });

    const response = await POST(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({
          title: "Demo",
          description: "Demo description",
          slug: "demo",
        }),
      })
    );

    expect(response.status).toBe(201);
    expect(mocks.createExecute).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Demo",
        description: "Demo description",
        slug: "demo",
        updatedBy: "admin@example.com",
      })
    );
  });

  it("maps not found to 404", async () => {
    mocks.getAdminApiContext.mockResolvedValue({
      userId: "admin-id",
      email: "admin@example.com",
    });
    mocks.createProjectsModule.mockResolvedValue({
      createProject: {
        execute: mocks.createExecute.mockRejectedValue(
          new ProjectNotFoundError("missing")
        ),
      },
    });

    const response = await POST(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ title: "Demo", description: "Demo" }),
      })
    );

    expect(response.status).toBe(404);
  });

  it("maps conflict errors to 409", async () => {
    mocks.getAdminApiContext.mockResolvedValue({
      userId: "admin-id",
      email: "admin@example.com",
    });
    mocks.createProjectsModule.mockResolvedValue({
      createProject: {
        execute: mocks.createExecute.mockRejectedValue(
          new ProjectAlreadyExistsError("demo")
        ),
      },
    });

    const response = await POST(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ title: "Demo", description: "Demo" }),
      })
    );

    expect(response.status).toBe(409);
  });

  it("maps unprocessable errors to 422", async () => {
    mocks.getAdminApiContext.mockResolvedValue({
      userId: "admin-id",
      email: "admin@example.com",
    });
    mocks.createProjectsModule.mockResolvedValue({
      createProject: {
        execute: mocks.createExecute.mockRejectedValue(
          new ProjectUnprocessableDataError("Unprocessable")
        ),
      },
    });

    const response = await POST(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ title: "Demo", description: "Demo" }),
      })
    );

    expect(response.status).toBe(422);
  });
});
