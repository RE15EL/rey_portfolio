import type { IProjectRepository } from "../../domain/project-repository";

export class ListAdminProjectsUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  execute() {
    return this.repository.listAdmin();
  }
}
