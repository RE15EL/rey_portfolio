import { InvalidProjectDataError, ProjectNotFoundError } from "../../domain/errors";
import type {
  IProject,
  IUpdateProjectInput,
} from "../../domain/project";
import type { IProjectRepository } from "../../domain/project-repository";
import { slugify } from "../slugify";
import {
  ensureValidDescription,
  ensureValidLinks,
  ensureValidTitle,
  normalizeStack,
} from "../validate-project-input";

export class UpdateProjectUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(input: IUpdateProjectInput): Promise<IProject> {
    const existing = await this.repository.getById(input.id);
    if (!existing) {
      throw new ProjectNotFoundError(input.id);
    }

    if (input.title !== undefined) {
      ensureValidTitle(input.title);
    }

    if (input.description !== undefined) {
      ensureValidDescription(input.description);
    }

    ensureValidLinks(input.projectUrl, input.repoUrl);

    const rawSlug = input.slug ?? input.title ?? existing.slug;
    const slug = slugify(rawSlug);
    if (!slug) {
      throw new InvalidProjectDataError("Slug could not be generated");
    }

    return this.repository.update({
      ...input,
      slug,
      title: input.title?.trim(),
      description: input.description?.trim(),
      stack: input.stack ? normalizeStack(input.stack) : undefined,
      imageUrl: input.imageUrl?.trim(),
      projectUrl: input.projectUrl?.trim(),
      repoUrl: input.repoUrl?.trim(),
    });
  }
}
