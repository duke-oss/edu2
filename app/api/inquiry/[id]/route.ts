import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

function getDb() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

// 비밀번호 검증 후 내용 반환
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { password } = await req.json();

  if (!password) {
    return NextResponse.json({ error: "비밀번호를 입력해주세요." }, { status: 400 });
  }

  const db = getDb();
  const { data, error } = await db
    .from("inquiries")
    .select("id, title, category, content, password_hash, created_at, users(name, email)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "문의를 찾을 수 없습니다." }, { status: 404 });
  }

  const isValid = await bcrypt.compare(password, data.password_hash);
  if (!isValid) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  // 비밀번호 해시 제외하고 반환
  const { password_hash: _, ...safe } = data;
  return NextResponse.json(safe);
}
