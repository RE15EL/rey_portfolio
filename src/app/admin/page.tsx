import Link from "next/link";

import { AdminProjectsTable } from "@/components/admin/admin-projects-table";
import { requireAdminPageUser } from "@/lib/auth/require-admin";
import { createProjectsModule } from "@/modules/projects/infrastructure/projects-module";

export default async function AdminHomePage() {
  const adminUser = await requireAdminPageUser();
  const projectsModule = await createProjectsModule();
  const projects = await projectsModule.listAdminProjects.execute();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-20 text-golden-100">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Admin</h1>
          <p className="text-sm text-golden-100/70">Sesion activa: {adminUser.email}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/projects/new"
            className="rounded-md bg-golden-200 px-4 py-2 text-sm font-semibold text-dark-300 hover:bg-golden-100"
          >
            Nuevo proyecto
          </Link>

          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="rounded-md border border-golden-100/40 px-4 py-2 text-sm text-golden-100 hover:bg-dark-300"
            >
              Cerrar sesion
            </button>
          </form>
        </div>
      </div>

      <AdminProjectsTable projects={projects} />
    </main>
  );
}
