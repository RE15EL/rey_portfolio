import { unstable_cache } from "next/cache";

import { CreateProjectUseCase } from "../application/use-cases/create-project";
import { DeleteProjectUseCase } from "../application/use-cases/delete-project";
import { GetProjectByIdUseCase } from "../application/use-cases/get-project-by-id";
import { ListAdminProjectsUseCase } from "../application/use-cases/list-admin-projects";
import { ListPublishedProjectsUseCase } from "../application/use-cases/list-published-projects";
import type { IProject } from "../domain/project";
import { SetProjectPublishedUseCase } from "../application/use-cases/set-project-published";
import { UpdateProjectUseCase } from "../application/use-cases/update-project";
import {
  PROJECTS_PUBLISHED_REVALIDATE_SECONDS,
  PROJECTS_PUBLISHED_TAG,
} from "./cache";
import { createPublicProjectRepository } from "./projects-public-repository-factory";
import { createProjectRepository } from "./projects-repository-factory";

const listPublishedProjectsWithSharedCache = unstable_cache(
  async (): Promise<IProject[]> => {
    const repository = createPublicProjectRepository();
    const listPublishedProjects = new ListPublishedProjectsUseCase(repository);

    return listPublishedProjects.execute();
  },
  ["projects:published:list"],
  {
    tags: [PROJECTS_PUBLISHED_TAG],
    revalidate: PROJECTS_PUBLISHED_REVALIDATE_SECONDS,
  }
);

export const createProjectsModule = async () => {
  const repository = await createProjectRepository();
  const listPublishedProjects = new ListPublishedProjectsUseCase(repository);

  return {
    repository,
    listPublishedProjects,
    listPublishedProjectsCached: async (): Promise<IProject[]> => {
      try {
        return await listPublishedProjectsWithSharedCache();
      } catch (error) {
        console.error("Falling back to uncached published projects", error);

        return listPublishedProjects.execute();
      }
    },
    listAdminProjects: new ListAdminProjectsUseCase(repository),
    getProjectById: new GetProjectByIdUseCase(repository),
    createProject: new CreateProjectUseCase(repository),
    updateProject: new UpdateProjectUseCase(repository),
    deleteProject: new DeleteProjectUseCase(repository),
    setProjectPublished: new SetProjectPublishedUseCase(repository),
  };
};
