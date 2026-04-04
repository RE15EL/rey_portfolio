import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { IProjectRepository } from "../domain/project-repository";
import { SupabaseProjectRepository } from "./supabase-project-repository";

type ProjectsDataProvider = "supabase";

const DEFAULT_PROVIDER: ProjectsDataProvider = "supabase";

const getProjectsDataProvider = (): ProjectsDataProvider => {
  const configuredProvider = process.env.PROJECTS_DATA_PROVIDER?.trim().toLowerCase();

  if (!configuredProvider) {
    return DEFAULT_PROVIDER;
  }

  if (configuredProvider === "supabase") {
    return configuredProvider;
  }

  throw new Error(
    `Unsupported PROJECTS_DATA_PROVIDER: ${configuredProvider}`
  );
};

export const createProjectRepository = async (): Promise<IProjectRepository> => {
  const provider = getProjectsDataProvider();

  switch (provider) {
    case "supabase": {
      const supabase = await createServerSupabaseClient();

      return new SupabaseProjectRepository(supabase);
    }
    default:
      throw new Error(`Unsupported projects data provider: ${provider}`);
  }
};
