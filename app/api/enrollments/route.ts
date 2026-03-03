import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const body = await req.json();
  const courseId = body?.courseId;
  if (!courseId) {
    return NextResponse.json({ error: "courseId가 필요합니다" }, { status: 400 });
  }

  const db = createAdminClient();
  const { error } = await db
    .from("enrollments")
    .upsert(
      { user_id: session.user.id, course_id: courseId },
      { onConflict: "user_id,course_id" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
