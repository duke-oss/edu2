import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// 강의 시청 완료 기록
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const { courseId, lessonId } = await req.json();
  if (!courseId || !lessonId) {
    return NextResponse.json({ error: "courseId, lessonId 필요" }, { status: 400 });
  }

  const db = createAdminClient();
  await db.from("lesson_progress").upsert(
    { user_id: session.user.id, course_id: courseId, lesson_id: lessonId },
    { onConflict: "user_id,course_id,lesson_id" }
  );

  return NextResponse.json({ ok: true });
}
