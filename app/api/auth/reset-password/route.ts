import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
  }

  const db = createAdminClient();

  const { data: record } = await db
    .from("verification_tokens")
    .select("identifier, expires")
    .eq("token", token)
    .maybeSingle();

  if (!record || !record.identifier.startsWith("reset:")) {
    return NextResponse.json({ error: "유효하지 않은 링크입니다." }, { status: 400 });
  }

  if (new Date(record.expires) < new Date()) {
    return NextResponse.json({ error: "링크가 만료되었습니다. 다시 요청해주세요." }, { status: 400 });
  }

  const email = record.identifier.replace("reset:", "");
  const hashedPassword = await bcrypt.hash(password, 12);

  const { error } = await db
    .from("users")
    .update({ password: hashedPassword })
    .eq("email", email);

  if (error) {
    return NextResponse.json({ error: "비밀번호 변경 중 오류가 발생했습니다." }, { status: 500 });
  }

  // Delete the used token
  await db.from("verification_tokens").delete().eq("token", token);

  return NextResponse.json({ ok: true });
}
