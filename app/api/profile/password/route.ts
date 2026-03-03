import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const body = await req.json();
  const { currentPassword, newPassword } = body ?? {};

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "모든 항목을 입력해주세요" }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "새 비밀번호는 8자 이상이어야 합니다" }, { status: 400 });
  }

  const db = createAdminClient();
  const { data: user } = await db
    .from("users")
    .select("password")
    .eq("id", session.user.id)
    .single();

  if (!user?.password) {
    return NextResponse.json(
      { error: "소셜 로그인 계정은 비밀번호를 변경할 수 없습니다" },
      { status: 400 }
    );
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return NextResponse.json({ error: "현재 비밀번호가 올바르지 않습니다" }, { status: 400 });
  }

  const hash = await bcrypt.hash(newPassword, 12);
  const { error } = await db
    .from("users")
    .update({ password: hash })
    .eq("id", session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
