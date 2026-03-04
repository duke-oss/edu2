import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("blog_posts")
    .select("id, title, slug, category, published, author, read_time, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { title, slug, category, excerpt, content, published, author, read_time, thumbnail } = body;

  if (!title || !slug || !content) {
    return NextResponse.json({ error: "제목, 슬러그, 본문은 필수입니다." }, { status: 400 });
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from("blog_posts")
    .insert({
      title,
      slug: slug.trim().toLowerCase(),
      category: category ?? "무역 동향",
      excerpt: excerpt ?? null,
      content,
      published: published ?? false,
      author: author ?? "관리자",
      read_time: read_time ?? "5분",
      thumbnail: thumbnail ?? null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "이미 사용 중인 슬러그입니다." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
