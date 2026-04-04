import { ProjectNotFoundError } from "../../domain/errors";
import type { IProjectRepository } from "../../domain/project-repository";

export class DeleteProjectUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(id: string, updatedBy: string): Promise<void> {
    const existing = await this.repository.getById(id);

    if (!existing) {
      throw new ProjectNotFoundError(id);
    }

    await this.repository.delete(id, updatedBy);
  }
}
