import { beforeEach, describe, expect, it, vi } from "vitest";

import type { IProject } from "../domain/project";
import type { IProjectRepository } from "../domain/project-repository";

const mocks = vi.hoisted(() => {
  return {
    unstableCache: vi.fn((resolver: () => Promise<IProject[]>) => resolver),
    createProjectRepository: vi.fn(),
    createPublicProjectRepository: vi.fn(),
  };
});

vi.mock("next/cache", () => ({
  unstable_cache: mocks.unstableCache,
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock("./projects-repository-factory", () => ({
  createProjectRepository: mocks.createProjectRepository,
}));

vi.mock("./projects-public-repository-factory", () => ({
  createPublicProjectRepository: mocks.createPublicProjectRepository,
}));

const makeRepository = (): IProjectRepository => ({
  listPublished: vi.fn(),
  listAdmin: vi.fn(),
  getById: vi.fn(),
  getBySlug: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  setPublished: vi.fn(),
});

const projectsStub: IProject[] = [
  {
    id: "project-1",
    slug: "demo-project",
    title: "Demo Project",
    description: "Demo",
    stack: ["Next.js"],
    imageUrl: null,
    projectUrl: null,
    repoUrl: null,
    isPublished: true,
    sortOrder: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    updatedBy: "admin@example.com",
  },
];

describe("createProjectsModule.listPublishedProjectsCached", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("uses shared cache metadata for published projects feed", async () => {
    const privateRepository = makeRepository();
    const publicRepository = makeRepository();

    vi.mocked(publicRepository.listPublished).mockResolvedValue(projectsStub);
    mocks.createProjectRepository.mockResolvedValue(privateRepository);
    mocks.createPublicProjectRepository.mockReturnValue(publicRepository);

    const { createProjectsModule } = await import("./projects-module");

    const projectsModule = await createProjectsModule();
    const projects = await projectsModule.listPublishedProjectsCached();

    expect(projects).toEqual(projectsStub);
    expect(mocks.unstableCache).toHaveBeenCalledWith(
      expect.any(Function),
      ["projects:published:list"],
      {
        tags: ["projects:published"],
        revalidate: 30,
      }
    );
    expect(publicRepository.listPublished).toHaveBeenCalledTimes(1);
  });

  it("falls back to uncached repository read when cache call fails", async () => {
    const privateRepository = makeRepository();
    const publicRepository = makeRepository();
    const cacheFailure = new Error("cache failed");
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(privateRepository.listPublished).mockResolvedValue(projectsStub);
    mocks.createProjectRepository.mockResolvedValue(privateRepository);
    mocks.createPublicProjectRepository.mockReturnValue(publicRepository);
    mocks.unstableCache.mockImplementationOnce(() => {
      return vi.fn().mockRejectedValue(cacheFailure);
    });

    const { createProjectsModule } = await import("./projects-module");

    const projectsModule = await createProjectsModule();
    const projects = await projectsModule.listPublishedProjectsCached();

    expect(projects).toEqual(projectsStub);
    expect(privateRepository.listPublished).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
  });
});
