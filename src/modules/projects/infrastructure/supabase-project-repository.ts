import type { SupabaseClient } from "@supabase/supabase-js";

import {
  ProjectAlreadyExistsError,
  ProjectNotFoundError,
  ProjectUnprocessableDataError,
  ProjectsError,
} from "../domain/errors";
import type {
  ICreateProjectInput,
  IProject,
  IUpdateProjectInput,
} from "../domain/project";
import type { IProjectRepository } from "../domain/project-repository";

interface IProjectRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  stack: string[] | null;
  image_url: string | null;
  project_url: string | null;
  repo_url: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

interface ISupabaseError {
  code?: string;
  message: string;
  details?: string;
}

interface ITranslateErrorContext {
  operation: "create" | "update" | "delete" | "setPublished";
  projectId?: string;
  slug?: string;
}

const mapRowToProject = (row: IProjectRow): IProject => {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    stack: row.stack ?? [],
    imageUrl: row.image_url,
    projectUrl: row.project_url,
    repoUrl: row.repo_url,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
};

const extractSlugFromConflict = (error: ISupabaseError, fallback?: string) => {
  if (fallback) {
    return fallback;
  }

  const source = `${error.details ?? ""} ${error.message}`;
  const match = source.match(/\(slug\)=\(([^)]+)\)/i);

  return match?.[1] ?? "unknown";
};

const translatePersistenceError = (
  error: ISupabaseError,
  context: ITranslateErrorContext
) => {
  if (error.code === "23505") {
    return new ProjectAlreadyExistsError(
      extractSlugFromConflict(error, context.slug)
    );
  }

  if (["22P02", "22003", "23514"].includes(error.code ?? "")) {
    return new ProjectUnprocessableDataError("Project payload is not processable");
  }

  if (error.code === "PGRST116") {
    return new ProjectNotFoundError(context.projectId ?? "unknown");
  }

  return new ProjectsError(`Failed to ${context.operation} project`);
};

export class SupabaseProjectRepository implements IProjectRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async listPublished(): Promise<IProject[]> {
    const { data, error } = await this.supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      throw new ProjectsError("Failed to list published projects");
    }

    return (data as IProjectRow[]).map(mapRowToProject);
  }

  async listAdmin(): Promise<IProject[]> {
    const { data, error } = await this.supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      throw new ProjectsError("Failed to list projects");
    }

    return (data as IProjectRow[]).map(mapRowToProject);
  }

  async getById(id: string): Promise<IProject | null> {
    const { data, error } = await this.supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new ProjectsError("Failed to get project by id");
    }

    if (!data) {
      return null;
    }

    return mapRowToProject(data as IProjectRow);
  }

  async getBySlug(slug: string): Promise<IProject | null> {
    const { data, error } = await this.supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new ProjectsError("Failed to get project by slug");
    }

    if (!data) {
      return null;
    }

    return mapRowToProject(data as IProjectRow);
  }

  async create(input: ICreateProjectInput): Promise<IProject> {
    const { data, error } = await this.supabase
      .from("projects")
      .insert({
        slug: input.slug,
        title: input.title,
        description: input.description,
        stack: input.stack ?? [],
        image_url: input.imageUrl || null,
        project_url: input.projectUrl || null,
        repo_url: input.repoUrl || null,
        is_published: input.isPublished ?? false,
        sort_order: input.sortOrder ?? 0,
        updated_by: input.updatedBy,
      })
      .select("*")
      .single();

    if (error) {
      throw translatePersistenceError(error as ISupabaseError, {
        operation: "create",
        slug: input.slug,
      });
    }

    return mapRowToProject(data as IProjectRow);
  }

  async update(input: IUpdateProjectInput): Promise<IProject> {
    const payload: Record<string, unknown> = {
      updated_by: input.updatedBy,
    };

    if (input.slug !== undefined) payload.slug = input.slug;
    if (input.title !== undefined) payload.title = input.title;
    if (input.description !== undefined) payload.description = input.description;
    if (input.stack !== undefined) payload.stack = input.stack;
    if (input.imageUrl !== undefined) payload.image_url = input.imageUrl || null;
    if (input.projectUrl !== undefined) payload.project_url = input.projectUrl || null;
    if (input.repoUrl !== undefined) payload.repo_url = input.repoUrl || null;
    if (input.sortOrder !== undefined) payload.sort_order = input.sortOrder;

    const { data, error } = await this.supabase
      .from("projects")
      .update(payload)
      .eq("id", input.id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw translatePersistenceError(error as ISupabaseError, {
        operation: "update",
        projectId: input.id,
        slug: input.slug,
      });
    }

    if (!data) {
      throw new ProjectNotFoundError(input.id);
    }

    return mapRowToProject(data as IProjectRow);
  }

  async delete(id: string, _updatedBy: string): Promise<void> {
    void _updatedBy;

    const { data, error } = await this.supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      throw translatePersistenceError(error as ISupabaseError, {
        operation: "delete",
        projectId: id,
      });
    }

    if (!data) {
      throw new ProjectNotFoundError(id);
    }
  }

  async setPublished(
    id: string,
    isPublished: boolean,
    updatedBy: string
  ): Promise<IProject> {
    const { data, error } = await this.supabase
      .from("projects")
      .update({
        is_published: isPublished,
        updated_by: updatedBy,
      })
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw translatePersistenceError(error as ISupabaseError, {
        operation: "setPublished",
        projectId: id,
      });
    }

    if (!data) {
      throw new ProjectNotFoundError(id);
    }

    return mapRowToProject(data as IProjectRow);
  }
}
