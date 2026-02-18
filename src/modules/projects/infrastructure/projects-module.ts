import { createServerSupabaseClient } from "@/lib/supabase/server";

import { CreateProjectUseCase } from "../application/use-cases/create-project";
import { GetProjectByIdUseCase } from "../application/use-cases/get-project-by-id";
import { ListAdminProjectsUseCase } from "../application/use-cases/list-admin-projects";
import { ListPublishedProjectsUseCase } from "../application/use-cases/list-published-projects";
import { SetProjectPublishedUseCase } from "../application/use-cases/set-project-published";
import { UpdateProjectUseCase } from "../application/use-cases/update-project";
import { SupabaseProjectRepository } from "./supabase-project-repository";

export const createProjectsModule = async () => {
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseProjectRepository(supabase);

  return {
    repository,
    listPublishedProjects: new ListPublishedProjectsUseCase(repository),
    listAdminProjects: new ListAdminProjectsUseCase(repository),
    getProjectById: new GetProjectByIdUseCase(repository),
    createProject: new CreateProjectUseCase(repository),
    updateProject: new UpdateProjectUseCase(repository),
    setProjectPublished: new SetProjectPublishedUseCase(repository),
  };
};
