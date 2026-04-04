import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

const mocks = vi.hoisted(() => {
  return {
    createProjectsModule: vi.fn(),
    listPublishedExecute: vi.fn(),
  };
});

vi.mock("@/modules/projects/infrastructure/projects-module", () => ({
  createProjectsModule: mocks.createProjectsModule,
}));

describe("GET /api/projects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns published projects with stable response contract", async () => {
    const projects = [{ id: "project-1", title: "Public Project" }];

    mocks.createProjectsModule.mockResolvedValue({
      listPublishedProjects: {
        execute: mocks.listPublishedExecute.mockResolvedValue(projects),
      },
    });

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ data: projects });
  });

  it("returns sanitized 500 when unexpected failures happen", async () => {
    mocks.createProjectsModule.mockResolvedValue({
      listPublishedProjects: {
        execute: mocks.listPublishedExecute.mockRejectedValue(
          new Error("raw db failure")
        ),
      },
    });

    const response = await GET();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Unexpected server error",
    });
  });
});
