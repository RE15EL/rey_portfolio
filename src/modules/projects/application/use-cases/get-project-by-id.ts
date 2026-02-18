import type { IProjectRepository } from "../../domain/project-repository";

export class GetProjectByIdUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  execute(id: string) {
    return this.repository.getById(id);
  }
}
