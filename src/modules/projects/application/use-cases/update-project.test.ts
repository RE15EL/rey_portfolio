import { describe, expect, it, vi } from "vitest";

import {
  ProjectNotFoundError,
  ProjectUnprocessableDataError,
} from "@/modules/projects/domain/errors";
import type { IProject } from "@/modules/projects/domain/project";
import type { IProjectRepository } from "@/modules/projects/domain/project-repository";
import { UpdateProjectUseCase } from "./update-project";

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

describe("UpdateProjectUseCase", () => {
  it("throws when project does not exist", async () => {
    const repository = makeRepository();
    vi.mocked(repository.getById).mockResolvedValue(null);

    const useCase = new UpdateProjectUseCase(repository);

    await expect(
      useCase.execute({
        id: "missing-id",
        title: "New Title",
        updatedBy: "admin@example.com",
      })
    ).rejects.toBeInstanceOf(ProjectNotFoundError);
  });

  it("normalizes slug and forwards update payload", async () => {
    const repository = makeRepository();
    vi.mocked(repository.getById).mockResolvedValue(existingProject);
    vi.mocked(repository.update).mockResolvedValue({
      ...existingProject,
      slug: "new-title",
      title: "New Title",
    });

    const useCase = new UpdateProjectUseCase(repository);
    await useCase.execute({
      id: existingProject.id,
      title: "New Title",
      description: "Updated description",
      updatedBy: "admin@example.com",
    });

    expect(repository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: existingProject.id,
        slug: "new-title",
        title: "New Title",
      })
    );
  });

  it("rejects invalid sortOrder before repository update", async () => {
    const repository = makeRepository();
    vi.mocked(repository.getById).mockResolvedValue(existingProject);

    const useCase = new UpdateProjectUseCase(repository);

    await expect(
      useCase.execute({
        id: existingProject.id,
        sortOrder: 10000,
        updatedBy: "admin@example.com",
      })
    ).rejects.toBeInstanceOf(ProjectUnprocessableDataError);

    expect(repository.update).not.toHaveBeenCalled();
  });
});
