import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("users")
    .select("id, name, email, created_at, email_verified, image, password")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "조회 실패" }, { status: 500 });

  // Determine login method: if password exists → credentials, else → google
  const users = (data ?? []).map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    created_at: u.created_at,
    login_method: u.password ? "이메일" : "Google",
    image: u.image,
  }));

  return NextResponse.json(users);
}
