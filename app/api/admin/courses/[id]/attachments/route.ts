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
    .from("course_attachments")
    .select("*")
    .eq("course_id", id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const { name, file_url, lesson_id, file_size } = body;

  if (!name?.trim() || !file_url?.trim()) {
    return NextResponse.json({ error: "이름과 파일 URL을 입력해주세요." }, { status: 400 });
  }

  const db = createAdminClient();
  const { error } = await db.from("course_attachments").insert({
    course_id: id,
    lesson_id: lesson_id || null,
    name: name.trim(),
    file_url: file_url.trim(),
    file_size: file_size ? Number(file_size) : null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
