import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  ProjectAlreadyExistsError,
  ProjectNotFoundError,
  ProjectUnprocessableDataError,
} from "@/modules/projects/domain/errors";
import { PATCH } from "./route";

const mocks = vi.hoisted(() => {
  return {
    getAdminApiContext: vi.fn(),
    buildUnauthorizedResponse: vi.fn(),
    createProjectsModule: vi.fn(),
    setPublishedExecute: vi.fn(),
  };
});

vi.mock("@/lib/auth/get-admin-api-context", () => ({
  getAdminApiContext: mocks.getAdminApiContext,
  buildUnauthorizedResponse: mocks.buildUnauthorizedResponse,
}));

vi.mock("@/modules/projects/infrastructure/projects-module", () => ({
  createProjectsModule: mocks.createProjectsModule,
}));

describe("PATCH /api/admin/projects/[id]/publish", () => {
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
        body: JSON.stringify({ isPublished: true }),
      }),
      { params: { id: "project-1" } }
    );

    expect(response.status).toBe(401);
    expect(mocks.createProjectsModule).not.toHaveBeenCalled();
  });

  it("returns 200 when publish toggle succeeds", async () => {
    const updated = { id: "project-1", isPublished: true };

    mocks.getAdminApiContext.mockResolvedValue({
      userId: "admin-id",
      email: "admin@example.com",
    });
    mocks.createProjectsModule.mockResolvedValue({
      setProjectPublished: {
        execute: mocks.setPublishedExecute.mockResolvedValue(updated),
      },
    });

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        body: JSON.stringify({ isPublished: true }),
      }),
      { params: { id: "project-1" } }
    );

    expect(response.status).toBe(200);
    expect(mocks.setPublishedExecute).toHaveBeenCalledWith(
      "project-1",
      true,
      "admin@example.com"
    );
  });

  it("maps not found to 404", async () => {
    mocks.getAdminApiContext.mockResolvedValue({
      userId: "admin-id",
      email: "admin@example.com",
    });
    mocks.createProjectsModule.mockResolvedValue({
      setProjectPublished: {
        execute: mocks.setPublishedExecute.mockRejectedValue(
          new ProjectNotFoundError("project-1")
        ),
      },
    });

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        body: JSON.stringify({ isPublished: true }),
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
      setProjectPublished: {
        execute: mocks.setPublishedExecute.mockRejectedValue(
          new ProjectAlreadyExistsError("duplicated")
        ),
      },
    });

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        body: JSON.stringify({ isPublished: true }),
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
      setProjectPublished: {
        execute: mocks.setPublishedExecute.mockRejectedValue(
          new ProjectUnprocessableDataError("Unprocessable")
        ),
      },
    });

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        body: JSON.stringify({ isPublished: true }),
      }),
      { params: { id: "project-1" } }
    );

    expect(response.status).toBe(422);
  });
});
