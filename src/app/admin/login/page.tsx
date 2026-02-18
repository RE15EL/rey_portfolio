import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getAdminUser } from "@/lib/auth/get-admin-user";

export default async function AdminLoginPage() {
  const admin = await getAdminUser();

  if (admin) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4">
      <AdminLoginForm />
    </main>
  );
}
