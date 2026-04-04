import { describe, expect, it, vi } from "vitest";

import { ProjectNotFoundError } from "@/modules/projects/domain/errors";
import type { IProject } from "@/modules/projects/domain/project";
import type { IProjectRepository } from "@/modules/projects/domain/project-repository";
import { SetProjectPublishedUseCase } from "./set-project-published";

const makeRepository = (): IProjectRepository => ({
  listPublished: vi.fn(),
  listAdmin: vi.fn(),
  getById: vi.fn(),
  getBySlug: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  setPublished: vi.fn(),
});

const existingProject: IProject = {
  id: "project-1",
  slug: "existing-project",
  title: "Existing Project",
  description: "Existing description",
  stack: ["React"],
  imageUrl: null,
  projectUrl: null,
  repoUrl: null,
  isPublished: false,
  sortOrder: 0,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  updatedBy: "admin@example.com",
};

describe("SetProjectPublishedUseCase", () => {
  it("throws when project is missing", async () => {
    const repository = makeRepository();
    vi.mocked(repository.getById).mockResolvedValue(null);

    const useCase = new SetProjectPublishedUseCase(repository);

    await expect(
      useCase.execute("missing-id", true, "admin@example.com")
    ).rejects.toBeInstanceOf(ProjectNotFoundError);
  });

  it("updates publish status for existing project", async () => {
    const repository = makeRepository();
    vi.mocked(repository.getById).mockResolvedValue(existingProject);
    vi.mocked(repository.setPublished).mockResolvedValue({
      ...existingProject,
      isPublished: true,
    });

    const useCase = new SetProjectPublishedUseCase(repository);
    await useCase.execute(existingProject.id, true, "admin@example.com");

    expect(repository.setPublished).toHaveBeenCalledWith(
      existingProject.id,
      true,
      "admin@example.com"
    );
  });
});
