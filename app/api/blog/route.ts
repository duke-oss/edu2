import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? "20");
  const category = searchParams.get("category");

  const db = createAdminClient();
  let query = db
    .from("blog_posts")
    .select("id, title, slug, category, excerpt, author, read_time, thumbnail, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (category && category !== "전체") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
