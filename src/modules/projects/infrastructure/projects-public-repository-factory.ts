import { createClient } from "@supabase/supabase-js";

import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

import type { IProjectRepository } from "../domain/project-repository";
import { SupabaseProjectRepository } from "./supabase-project-repository";

export const createPublicProjectRepository = (): IProjectRepository => {
  const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey());

  return new SupabaseProjectRepository(supabase);
};
