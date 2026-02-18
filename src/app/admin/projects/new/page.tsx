import { AdminProjectForm } from "@/components/admin/admin-project-form";
import { requireAdminPageUser } from "@/lib/auth/require-admin";

export default async function NewProjectPage() {
  await requireAdminPageUser();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-20 text-golden-100">
      <h1 className="mb-6 text-3xl font-bold">Nuevo proyecto</h1>
      <div className="rounded-xl border border-golden-100/30 bg-dark-300/80 p-6">
        <AdminProjectForm mode="create" />
      </div>
    </main>
  );
}
