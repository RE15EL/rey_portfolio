import { describe, expect, it, vi } from "vitest";

import {
  InvalidProjectDataError,
  ProjectAlreadyExistsError,
  ProjectUnprocessableDataError,
} from "@/modules/projects/domain/errors";
import type { IProject } from "@/modules/projects/domain/project";
import type { IProjectRepository } from "@/modules/projects/domain/project-repository";
import { CreateProjectUseCase } from "./create-project";

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

const projectStub: IProject = {
  id: "project-1",
  slug: "demo-project",
  title: "Demo Project",
  description: "Demo description",
  stack: ["Next.js"],
  imageUrl: null,
  projectUrl: null,
  repoUrl: null,
  isPublished: false,
  sortOrder: 0,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  updatedBy: "admin@example.com",
};

describe("CreateProjectUseCase", () => {
  it("creates a project with generated slug", async () => {
    const repository = makeRepository();
    vi.mocked(repository.getBySlug).mockResolvedValue(null);
    vi.mocked(repository.create).mockResolvedValue(projectStub);

    const useCase = new CreateProjectUseCase(repository);
    const created = await useCase.execute({
      title: "Demo Project",
      description: "Demo description",
      updatedBy: "admin@example.com",
    });

    expect(repository.getBySlug).toHaveBeenCalledWith("demo-project");
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ slug: "demo-project" })
    );
    expect(created).toEqual(projectStub);
  });

  it("throws when slug already exists", async () => {
    const repository = makeRepository();
    vi.mocked(repository.getBySlug).mockResolvedValue(projectStub);

    const useCase = new CreateProjectUseCase(repository);

    await expect(
      useCase.execute({
        title: "Demo Project",
        description: "Demo description",
        updatedBy: "admin@example.com",
      })
    ).rejects.toBeInstanceOf(ProjectAlreadyExistsError);
  });

  it("rejects malformed URLs before writing", async () => {
    const repository = makeRepository();
    const useCase = new CreateProjectUseCase(repository);

    await expect(
      useCase.execute({
        title: "Demo Project",
        description: "Demo description",
        projectUrl: "notaurl",
        updatedBy: "admin@example.com",
      })
    ).rejects.toBeInstanceOf(ProjectUnprocessableDataError);

    expect(repository.getBySlug).not.toHaveBeenCalled();
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("rejects unsafe sort order before writing", async () => {
    const repository = makeRepository();
    const useCase = new CreateProjectUseCase(repository);

    await expect(
      useCase.execute({
        title: "Demo Project",
        description: "Demo description",
        sortOrder: 1.1,
        updatedBy: "admin@example.com",
      })
    ).rejects.toBeInstanceOf(ProjectUnprocessableDataError);

    expect(repository.getBySlug).not.toHaveBeenCalled();
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("rejects invalid slug and does not attempt writes", async () => {
    const repository = makeRepository();
    const useCase = new CreateProjectUseCase(repository);

    await expect(
      useCase.execute({
        title: "Demo Project",
        slug: "!!!",
        description: "Demo description",
        updatedBy: "admin@example.com",
      })
    ).rejects.toBeInstanceOf(InvalidProjectDataError);

    expect(repository.getBySlug).not.toHaveBeenCalled();
    expect(repository.create).not.toHaveBeenCalled();
  });
});
