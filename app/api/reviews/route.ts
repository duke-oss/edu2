import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const courseId = req.nextUrl.searchParams.get("courseId");
  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from("reviews")
    .select("id, rating, content, created_at, users(name)")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { courseId, rating, content } = await req.json();
  if (!courseId || !rating || !content?.trim()) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "평점은 1~5 사이여야 합니다." }, { status: 400 });
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
    return NextResponse.json({ error: "수강 중인 강의만 후기를 작성할 수 있습니다." }, { status: 403 });
  }

  // Check at least 1 lesson watched
  const { data: progress } = await db
    .from("lesson_progress")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .limit(1);

  if (!progress || progress.length === 0) {
    return NextResponse.json({ error: "강의를 1강 이상 수강한 후 후기를 작성할 수 있습니다." }, { status: 403 });
  }

  const { error } = await db.from("reviews").insert({
    user_id: userId,
    course_id: courseId,
    rating,
    content: content.trim(),
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "이미 후기를 작성하셨습니다." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
