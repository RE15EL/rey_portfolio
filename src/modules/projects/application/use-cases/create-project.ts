import {
  InvalidProjectDataError,
  ProjectAlreadyExistsError,
} from "../../domain/errors";
import type {
  ICreateProjectInput,
  IProject,
} from "../../domain/project";
import type { IProjectRepository } from "../../domain/project-repository";
import { slugify } from "../slugify";
import {
  ensureValidDescription,
  ensureValidLinks,
  ensureValidTitle,
  normalizeStack,
} from "../validate-project-input";

export class CreateProjectUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(input: ICreateProjectInput): Promise<IProject> {
    ensureValidTitle(input.title);
    ensureValidDescription(input.description);
    ensureValidLinks(input.projectUrl, input.repoUrl);

    const slug = slugify(input.slug || input.title);
    if (!slug) {
      throw new InvalidProjectDataError("Slug could not be generated");
    }

    const existing = await this.repository.getBySlug(slug);
    if (existing) {
      throw new ProjectAlreadyExistsError(slug);
    }

    return this.repository.create({
      ...input,
      slug,
      title: input.title.trim(),
      description: input.description.trim(),
      stack: normalizeStack(input.stack),
      imageUrl: input.imageUrl?.trim(),
      projectUrl: input.projectUrl?.trim(),
      repoUrl: input.repoUrl?.trim(),
      sortOrder: input.sortOrder ?? 0,
      isPublished: input.isPublished ?? false,
    });
  }
}
