import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@/auth";
import { requireAdmin } from "@/lib/admin";

const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// 목록 조회 (어드민 전용)
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });

  const { data, error } = await db
    .from("inquiries")
    .select("id, title, category, created_at, users(name, email)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  return NextResponse.json(data);
}

// 문의 작성
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { title, password, category, content } = await req.json();
  if (!title || !password || !category || !content) {
    return NextResponse.json({ error: "모든 항목을 입력해주세요." }, { status: 400 });
  }

  const { error } = await db.from("inquiries").insert({
    user_id: session.user.id,
    title,
    password_hash: await bcrypt.hash(password, 6),
    category,
    content,
  });

  if (error) return NextResponse.json({ error: "저장 중 오류가 발생했습니다." }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
