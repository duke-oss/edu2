import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const db = createAdminClient();

  const { data, error } = await db
    .from("inquiries")
    .select("id, title, category, content, created_at, users(name, email)")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "문의를 찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json(data);
}
