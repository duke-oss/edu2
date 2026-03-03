import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { courseId } = await req.json();
  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  const db = createAdminClient();
  const userId = session.user.id;

  // Check enrollment
  const { data: enrollment } = await db
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (!enrollment) {
    return NextResponse.json({ error: "수강 중인 강의가 아닙니다." }, { status: 403 });
  }

  // Check 100% completion
  const [{ data: lessons }, { data: watched }] = await Promise.all([
    db.from("lessons").select("id").eq("course_id", courseId),
    db.from("lesson_progress").select("lesson_id").eq("user_id", userId).eq("course_id", courseId),
  ]);

  const totalLessons = lessons?.length ?? 0;
  const watchedCount = watched?.length ?? 0;

  if (totalLessons === 0 || watchedCount < totalLessons) {
    return NextResponse.json({ error: "모든 강의를 완료해야 수료증을 받을 수 있습니다." }, { status: 400 });
  }

  // Upsert certificate
  const { data: cert, error } = await db
    .from("certificates")
    .upsert(
      { user_id: userId, course_id: courseId },
      { onConflict: "user_id,course_id" }
    )
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: cert.id });
}
