import { CreateProjectUseCase } from "../application/use-cases/create-project";
import { DeleteProjectUseCase } from "../application/use-cases/delete-project";
import { GetProjectByIdUseCase } from "../application/use-cases/get-project-by-id";
import { ListAdminProjectsUseCase } from "../application/use-cases/list-admin-projects";
import { ListPublishedProjectsUseCase } from "../application/use-cases/list-published-projects";
import { SetProjectPublishedUseCase } from "../application/use-cases/set-project-published";
import { UpdateProjectUseCase } from "../application/use-cases/update-project";
import { createProjectRepository } from "./projects-repository-factory";

export const createProjectsModule = async () => {
  const repository = await createProjectRepository();

  return {
    repository,
    listPublishedProjects: new ListPublishedProjectsUseCase(repository),
    listAdminProjects: new ListAdminProjectsUseCase(repository),
    getProjectById: new GetProjectByIdUseCase(repository),
    createProject: new CreateProjectUseCase(repository),
    updateProject: new UpdateProjectUseCase(repository),
    deleteProject: new DeleteProjectUseCase(repository),
    setProjectPublished: new SetProjectPublishedUseCase(repository),
  };
};
