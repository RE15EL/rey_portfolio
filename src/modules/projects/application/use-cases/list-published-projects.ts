import type { IProjectRepository } from "../../domain/project-repository";

export class ListPublishedProjectsUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  execute() {
    return this.repository.listPublished();
  }
}
