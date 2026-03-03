import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const lessonId = req.nextUrl.searchParams.get("lessonId");
  const db = createAdminClient();

  // Verify enrollment
  const { data: enrollment } = await db
    .from("enrollments")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("course_id", id)
    .maybeSingle();

  if (!enrollment) {
    return NextResponse.json({ error: "수강 중인 강의가 아닙니다." }, { status: 403 });
  }

  let query = db
    .from("course_attachments")
    .select("id, name, file_url, lesson_id, file_size")
    .eq("course_id", id);

  if (lessonId) {
    query = query.or(`lesson_id.eq.${lessonId},lesson_id.is.null`);
  }

  const { data } = await query.order("created_at", { ascending: true });
  return NextResponse.json(data ?? []);
}
