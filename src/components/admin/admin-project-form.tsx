"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { IProject } from "@/modules/projects/domain/project";

interface IAdminProjectFormProps {
  mode: "create" | "edit";
  project?: IProject;
}

const parseStack = (value: string) => {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const AdminProjectForm = ({ mode, project }: IAdminProjectFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaults = useMemo(
    () => ({
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      description: project?.description ?? "",
      stack: project?.stack.join(", ") ?? "",
      imageUrl: project?.imageUrl ?? "",
      projectUrl: project?.projectUrl ?? "",
      repoUrl: project?.repoUrl ?? "",
      sortOrder: String(project?.sortOrder ?? 0),
      isPublished: project?.isPublished ?? false,
    }),
    [project]
  );

  const submitLabel = mode === "create" ? "Crear proyecto" : "Guardar cambios";

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") || ""),
      slug: String(formData.get("slug") || ""),
      description: String(formData.get("description") || ""),
      stack: parseStack(String(formData.get("stack") || "")),
      imageUrl: String(formData.get("imageUrl") || ""),
      projectUrl: String(formData.get("projectUrl") || ""),
      repoUrl: String(formData.get("repoUrl") || ""),
      sortOrder: Number(formData.get("sortOrder") || 0),
      isPublished: formData.get("isPublished") === "on",
    };

    const endpoint =
      mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${project?.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const result = (await response.json()) as { error?: string };
      setError(result.error || "No fue posible guardar el proyecto");
      setIsSubmitting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Titulo</label>
        <input
          name="title"
          required
          defaultValue={defaults.title}
          className="w-full rounded-md border border-golden-100/30 bg-dark-200 px-3 py-2 text-sm outline-none ring-golden-200 focus:ring-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Slug</label>
        <input
          name="slug"
          defaultValue={defaults.slug}
          placeholder="se genera automaticamente desde el titulo"
          className="w-full rounded-md border border-golden-100/30 bg-dark-200 px-3 py-2 text-sm outline-none ring-golden-200 focus:ring-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Descripcion</label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={defaults.description}
          className="w-full rounded-md border border-golden-100/30 bg-dark-200 px-3 py-2 text-sm outline-none ring-golden-200 focus:ring-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Stack (coma separada)</label>
        <input
          name="stack"
          defaultValue={defaults.stack}
          placeholder="Next.js, TypeScript, Tailwind"
          className="w-full rounded-md border border-golden-100/30 bg-dark-200 px-3 py-2 text-sm outline-none ring-golden-200 focus:ring-2"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Image URL</label>
          <input
            name="imageUrl"
            defaultValue={defaults.imageUrl}
            className="w-full rounded-md border border-golden-100/30 bg-dark-200 px-3 py-2 text-sm outline-none ring-golden-200 focus:ring-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Sort order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={defaults.sortOrder}
            className="w-full rounded-md border border-golden-100/30 bg-dark-200 px-3 py-2 text-sm outline-none ring-golden-200 focus:ring-2"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Project URL</label>
          <input
            name="projectUrl"
            defaultValue={defaults.projectUrl}
            className="w-full rounded-md border border-golden-100/30 bg-dark-200 px-3 py-2 text-sm outline-none ring-golden-200 focus:ring-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Repo URL</label>
          <input
            name="repoUrl"
            defaultValue={defaults.repoUrl}
            className="w-full rounded-md border border-golden-100/30 bg-dark-200 px-3 py-2 text-sm outline-none ring-golden-200 focus:ring-2"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          name="isPublished"
          type="checkbox"
          defaultChecked={defaults.isPublished}
        />
        Publicado
      </label>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-golden-200 px-4 py-2 text-sm font-semibold text-dark-300 transition hover:bg-golden-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Guardando..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-md border border-golden-100/40 px-4 py-2 text-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
