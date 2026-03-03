import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const body = await req.json();
  const name = body?.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "이름을 입력해주세요" }, { status: 400 });
  }

  const db = createAdminClient();
  const { error } = await db
    .from("users")
    .update({ name })
    .eq("id", session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
