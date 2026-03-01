import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("courses")
    .select("*, lessons(id, title, duration, video_id, description, sort_order)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "조회 실패" }, { status: 500 });

  const courses = (data ?? []).map((c) => ({
    ...c,
    lessons: (c.lessons ?? []).sort(
      (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
    ),
  }));

  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { lessons, ...courseData } = body;

  if (!courseData.id || !courseData.title) {
    return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });
  }

  const db = createAdminClient();

  const { error: courseError } = await db.from("courses").insert({
    id: courseData.id,
    title: courseData.title,
    description: courseData.description,
    category: courseData.category,
    level: courseData.level,
    instructor: courseData.instructor,
    total_duration: courseData.total_duration,
    thumbnail: courseData.thumbnail,
    badge: courseData.badge,
    price: courseData.price,
    free: courseData.free ?? false,
    students: courseData.students ?? "0명",
  });

  if (courseError) {
    return NextResponse.json({ error: courseError.message }, { status: 500 });
  }

  if (lessons && lessons.length > 0) {
    const lessonRows = lessons.map(
      (l: { id: string; title: string; duration: string; video_id?: string; description?: string }, i: number) => ({
        id: l.id,
        course_id: courseData.id,
        title: l.title,
        duration: l.duration,
        video_id: l.video_id ?? null,
        description: l.description ?? null,
        sort_order: i + 1,
      })
    );

    const { error: lessonError } = await db.from("lessons").insert(lessonRows);
    if (lessonError) {
      return NextResponse.json({ error: lessonError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
