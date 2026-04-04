import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST as adminCreateProject } from "@/app/api/admin/projects/route";
import { GET as getPublicProjects } from "./route";

const mocks = vi.hoisted(() => {
  return {
    getAdminApiContext: vi.fn(),
    buildUnauthorizedResponse: vi.fn(),
    createProjectsModule: vi.fn(),
    revalidatePublishedProjectsFeedCache: vi.fn(),
    state: {
      sourceProjects: [{ id: "project-1", title: "Initial Project" }],
      cachedProjects: [{ id: "project-1", title: "Initial Project" }],
      invalidated: false,
      refreshedReads: 0,
    },
  };
});

vi.mock("@/lib/auth/get-admin-api-context", () => ({
  getAdminApiContext: mocks.getAdminApiContext,
  buildUnauthorizedResponse: mocks.buildUnauthorizedResponse,
}));

vi.mock("@/modules/projects/infrastructure/cache", () => ({
  revalidatePublishedProjectsFeedCache: mocks.revalidatePublishedProjectsFeedCache,
}));

vi.mock("@/modules/projects/infrastructure/projects-module", () => ({
  createProjectsModule: mocks.createProjectsModule,
}));

describe("freshness after successful admin mutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.state.sourceProjects = [{ id: "project-1", title: "Initial Project" }];
    mocks.state.cachedProjects = [{ id: "project-1", title: "Initial Project" }];
    mocks.state.invalidated = false;
    mocks.state.refreshedReads = 0;

    mocks.getAdminApiContext.mockResolvedValue({
      userId: "admin-id",
      email: "admin@example.com",
    });

    mocks.revalidatePublishedProjectsFeedCache.mockImplementation(() => {
      mocks.state.invalidated = true;
    });

    mocks.createProjectsModule.mockImplementation(async () => {
      return {
        createProject: {
          execute: async (input: { title?: string }) => {
            const created = {
              id: "project-2",
              title: input.title || "Untitled",
            };

            mocks.state.sourceProjects = [...mocks.state.sourceProjects, created];

            return created;
          },
        },
        listPublishedProjectsCached: async () => {
          if (mocks.state.invalidated) {
            mocks.state.cachedProjects = [...mocks.state.sourceProjects];
            mocks.state.invalidated = false;
            mocks.state.refreshedReads += 1;
          }

          return [...mocks.state.cachedProjects];
        },
      };
    });
  });

  it("invalidates on successful admin mutation and serves refreshed data on next public read", async () => {
    const initialResponse = await getPublicProjects();
    await expect(initialResponse.json()).resolves.toEqual({
      data: [{ id: "project-1", title: "Initial Project" }],
    });

    const mutationResponse = await adminCreateProject(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({
          title: "New Project",
          description: "Now visible in feed",
        }),
      })
    );

    expect(mutationResponse.status).toBe(201);
    expect(mocks.revalidatePublishedProjectsFeedCache).toHaveBeenCalledTimes(1);

    const refreshedResponse = await getPublicProjects();

    await expect(refreshedResponse.json()).resolves.toEqual({
      data: [
        { id: "project-1", title: "Initial Project" },
        { id: "project-2", title: "New Project" },
      ],
    });
    expect(mocks.state.refreshedReads).toBe(1);
  });
});
