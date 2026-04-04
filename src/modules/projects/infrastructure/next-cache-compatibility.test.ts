import { beforeEach, describe, expect, it, vi } from "vitest";

import type { IProject } from "../domain/project";
import type { IProjectRepository } from "../domain/project-repository";

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
    id: "project-compat-1",
    slug: "project-compat-1",
    title: "Compatibility Project",
    description: "Compatibility guard",
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

describe("Next.js 14.2.16 cache compatibility guard", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("works when only next/cache primitives available in 14.2.16 are provided", async () => {
    const unstableCache = vi.fn((resolver: () => Promise<IProject[]>) => resolver);
    const revalidateTag = vi.fn();
    const revalidatePath = vi.fn();

    vi.doMock("next/cache", () => ({
      unstable_cache: unstableCache,
      revalidateTag,
      revalidatePath,
    }));

    const privateRepository = makeRepository();
    const publicRepository = makeRepository();
    vi.mocked(privateRepository.listPublished).mockResolvedValue(projectsStub);
    vi.mocked(publicRepository.listPublished).mockResolvedValue(projectsStub);

    vi.doMock("./projects-repository-factory", () => ({
      createProjectRepository: vi.fn().mockResolvedValue(privateRepository),
    }));

    vi.doMock("./projects-public-repository-factory", () => ({
      createPublicProjectRepository: vi.fn().mockReturnValue(publicRepository),
    }));

    const { revalidatePublishedProjectsFeedCache } = await import("./cache");
    revalidatePublishedProjectsFeedCache();

    expect(revalidateTag).toHaveBeenCalledWith("projects:published");
    expect(revalidatePath).toHaveBeenCalledWith("/");

    const { createProjectsModule } = await import("./projects-module");
    const projectsModule = await createProjectsModule();
    const publishedProjects = await projectsModule.listPublishedProjectsCached();

    expect(publishedProjects).toEqual(projectsStub);
    expect(unstableCache).toHaveBeenCalledWith(
      expect.any(Function),
      ["projects:published:list"],
      {
        tags: ["projects:published"],
        revalidate: 30,
      }
    );
  });
});
