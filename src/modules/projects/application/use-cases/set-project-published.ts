import { ProjectNotFoundError } from "../../domain/errors";
import type { IProjectRepository } from "../../domain/project-repository";

export class SetProjectPublishedUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(id: string, isPublished: boolean, updatedBy: string) {
    const existing = await this.repository.getById(id);

    if (!existing) {
      throw new ProjectNotFoundError(id);
    }

    return this.repository.setPublished(id, isPublished, updatedBy);
  }
}
