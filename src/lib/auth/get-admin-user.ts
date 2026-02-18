import { createServerSupabaseClient } from "@/lib/supabase/server";

interface IAdminUser {
  id: string;
  email: string;
}

export const getAdminUser = async (): Promise<IAdminUser | null> => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const { data: adminRow, error } = await supabase
    .from("admin_users")
    .select("id, email, is_active")
    .eq("email", user.email)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !adminRow) {
    return null;
  }

  return {
    id: adminRow.id,
    email: adminRow.email,
  };
};
