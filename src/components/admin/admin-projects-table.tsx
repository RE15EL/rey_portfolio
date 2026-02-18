"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { IProject } from "@/modules/projects/domain/project";

interface IAdminProjectsTableProps {
  projects: IProject[];
}

export const AdminProjectsTable = ({ projects }: IAdminProjectsTableProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);

  const togglePublish = async (id: string, isPublished: boolean) => {
    setError(null);
    setWorkingId(id);

    const response = await fetch(`/api/admin/projects/${id}/publish`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isPublished: !isPublished }),
    });

    if (!response.ok) {
      const result = (await response.json()) as { error?: string };
      setError(result.error || "No fue posible actualizar el estado");
      setWorkingId(null);
      return;
    }

    setWorkingId(null);
    router.refresh();
  };

  if (!projects.length) {
    return (
      <div className="rounded-xl border border-golden-100/30 bg-dark-300/80 p-6">
        <p className="text-sm text-golden-100/80">No hay proyectos aun.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-300">{error}</p>}

      <div className="overflow-hidden rounded-xl border border-golden-100/30">
        <table className="w-full text-left text-sm">
          <thead className="bg-dark-300 text-golden-200">
            <tr>
              <th className="px-4 py-3">Titulo</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-dark-200/70">
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-golden-100/10">
                <td className="px-4 py-3 text-golden-100">{project.title}</td>
                <td className="px-4 py-3 text-golden-100/80">{project.slug}</td>
                <td className="px-4 py-3 text-golden-100/80">
                  {project.isPublished ? "Publicado" : "Oculto"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="rounded-md border border-golden-100/40 px-3 py-1 text-xs text-golden-100 hover:bg-dark-300"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      disabled={workingId === project.id}
                      onClick={() => togglePublish(project.id, project.isPublished)}
                      className="rounded-md bg-golden-200 px-3 py-1 text-xs font-semibold text-dark-300 hover:bg-golden-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {workingId === project.id
                        ? "Actualizando..."
                        : project.isPublished
                        ? "Despublicar"
                        : "Publicar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
