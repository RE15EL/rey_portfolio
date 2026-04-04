import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  ProjectAlreadyExistsError,
  ProjectNotFoundError,
  ProjectUnprocessableDataError,
} from "@/modules/projects/domain/errors";
import { DELETE, PATCH } from "./route";

const mocks = vi.hoisted(() => {
  return {
    getAdminApiContext: vi.fn(),
    buildUnauthorizedResponse: vi.fn(),
    createProjectsModule: vi.fn(),
    deleteExecute: vi.fn(),
    updateExecute: vi.fn(),
  };
});

vi.mock("@/lib/auth/get-admin-api-context", () => ({
  getAdminApiContext: mocks.getAdminApiContext,
  buildUnauthorizedResponse: mocks.buildUnauthorizedResponse,
}));

vi.mock("@/modules/projects/infrastructure/projects-module", () => ({
  createProjectsModule: mocks.createProjectsModule,
}));

describe("DELETE /api/admin/projects/[id]", () => {
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

    const response = await DELETE(new Request("http://localhost"), {
      params: { id: "project-1" },
    });

    expect(response.status).toBe(401);
    expect(mocks.createProjectsModule).not.toHaveBeenCalled();
  });

  it("returns 204 when delete succeeds", async () => {
    mocks.getAdminApiContext.mockResolvedValue({
      userId: "admin-id",
      email: "admin@example.com",
    });
    mocks.createProjectsModule.mockResolvedValue({
      deleteProject: {
        execute: mocks.deleteExecute.mockResolvedValue(undefined),
      },
    });

    const response = await DELETE(new Request("http://localhost"), {
      params: { id: "project-1" },
    });

    expect(response.status).toBe(204);
    expect(mocks.deleteExecute).toHaveBeenCalledWith(
      "project-1",
      "admin@example.com"
    );
  });

  it("maps not found to 404", async () => {
    mocks.getAdminApiContext.mockResolvedValue({
      userId: "admin-id",
      email: "admin@example.com",
    });
    mocks.createProjectsModule.mockResolvedValue({
      deleteProject: {
        execute: mocks.deleteExecute.mockRejectedValue(
          new ProjectNotFoundError("project-1")
        ),
      },
    });

    const response = await DELETE(new Request("http://localhost"), {
      params: { id: "project-1" },
    });

    expect(response.status).toBe(404);
  });

  it("maps conflict errors to 409", async () => {
    mocks.getAdminApiContext.mockResolvedValue({
      userId: "admin-id",
      email: "admin@example.com",
    });
    mocks.createProjectsModule.mockResolvedValue({
      deleteProject: {
        execute: mocks.deleteExecute.mockRejectedValue(
          new ProjectAlreadyExistsError("duplicated")
        ),
      },
    });

    const response = await DELETE(new Request("http://localhost"), {
      params: { id: "project-1" },
    });

    expect(response.status).toBe(409);
  });

  it("maps unprocessable errors to 422", async () => {
    mocks.getAdminApiContext.mockResolvedValue({
      userId: "admin-id",
      email: "admin@example.com",
    });
    mocks.createProjectsModule.mockResolvedValue({
      deleteProject: {
        execute: mocks.deleteExecute.mockRejectedValue(
          new ProjectUnprocessableDataError("Unprocessable")
        ),
      },
    });

    const response = await DELETE(new Request("http://localhost"), {
      params: { id: "project-1" },
    });

    expect(response.status).toBe(422);
  });
});

describe("PATCH /api/admin/projects/[id]", () => {
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

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        body: JSON.stringify({ title: "Updated" }),
      }),
      { params: { id: "project-1" } }
    );

    expect(response.status).toBe(401);
    expect(mocks.createProjectsModule).not.toHaveBeenCalled();
  });

  it("returns 200 when update succeeds", async () => {
    const updated = {
      id: "project-1",
      slug: "project-1",
      title: "Updated",
    };

    mocks.getAdminApiContext.mockResolvedValue({
      userId: "admin-id",
      email: "admin@example.com",
    });
    mocks.createProjectsModule.mockResolvedValue({
      updateProject: {
        execute: mocks.updateExecute.mockResolvedValue(updated),
      },
    });

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        body: JSON.stringify({ title: "Updated" }),
      }),
      { params: { id: "project-1" } }
    );

    expect(response.status).toBe(200);
    expect(mocks.updateExecute).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "project-1",
        title: "Updated",
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
      updateProject: {
        execute: mocks.updateExecute.mockRejectedValue(
          new ProjectNotFoundError("project-1")
        ),
      },
    });

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        body: JSON.stringify({ title: "Updated" }),
      }),
      { params: { id: "project-1" } }
    );

    expect(response.status).toBe(404);
  });

  it("maps conflict errors to 409", async () => {
    mocks.getAdminApiContext.mockResolvedValue({
      userId: "admin-id",
      email: "admin@example.com",
    });
    mocks.createProjectsModule.mockResolvedValue({
      updateProject: {
        execute: mocks.updateExecute.mockRejectedValue(
          new ProjectAlreadyExistsError("duplicated")
        ),
      },
    });

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        body: JSON.stringify({ title: "Updated" }),
      }),
      { params: { id: "project-1" } }
    );

    expect(response.status).toBe(409);
  });

  it("maps unprocessable errors to 422", async () => {
    mocks.getAdminApiContext.mockResolvedValue({
      userId: "admin-id",
      email: "admin@example.com",
    });
    mocks.createProjectsModule.mockResolvedValue({
      updateProject: {
        execute: mocks.updateExecute.mockRejectedValue(
          new ProjectUnprocessableDataError("Unprocessable")
        ),
      },
    });

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        body: JSON.stringify({ title: "Updated" }),
      }),
      { params: { id: "project-1" } }
    );

    expect(response.status).toBe(422);
  });
});
