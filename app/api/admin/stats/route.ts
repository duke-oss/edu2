import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createAdminClient();

  const [usersResult, coursesResult, inquiriesResult] = await Promise.all([
    db.from("users").select("id", { count: "exact", head: true }),
    db.from("courses").select("id", { count: "exact", head: true }),
    db.from("inquiries").select("id", { count: "exact", head: true }),
  ]);

  return NextResponse.json({
    users: usersResult.count ?? 0,
    courses: coursesResult.count ?? 0,
    inquiries: inquiriesResult.count ?? 0,
  });
}
