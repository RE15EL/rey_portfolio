import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

interface IAdminContext {
  userId: string;
  email: string;
}

export const getAdminApiContext = async (): Promise<IAdminContext | null> => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const { data: adminRow, error } = await supabase
    .from("admin_users")
    .select("email, is_active")
    .eq("email", user.email)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !adminRow) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email,
  };
};

export const buildUnauthorizedResponse = async () => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
};
