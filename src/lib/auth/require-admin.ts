import { redirect } from "next/navigation";

import { getAdminUser } from "./get-admin-user";

export const requireAdminPageUser = async () => {
  const adminUser = await getAdminUser();

  if (!adminUser) {
    redirect("/admin/login");
  }

  return adminUser;
};
