import { notFound } from "next/navigation";

import { AdminProjectForm } from "@/components/admin/admin-project-form";
import { requireAdminPageUser } from "@/lib/auth/require-admin";
import { createProjectsModule } from "@/modules/projects/infrastructure/projects-module";

interface IPageProps {
  params: { id: string };
}

export default async function EditProjectPage({ params }: IPageProps) {
  await requireAdminPageUser();
  const { id } = params;

  const projectsModule = await createProjectsModule();
  const project = await projectsModule.getProjectById.execute(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-20 text-golden-100">
      <h1 className="mb-6 text-3xl font-bold">Editar proyecto</h1>
      <div className="rounded-xl border border-golden-100/30 bg-dark-300/80 p-6">
        <AdminProjectForm mode="edit" project={project} />
      </div>
    </main>
  );
}
