import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const db = createAdminClient();

  const { data, error } = await db
    .from("courses")
    .select("*, lessons(id, title, duration, video_id, description, sort_order)")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "강의를 찾을 수 없습니다." }, { status: 404 });

  const course = {
    ...data,
    lessons: (data.lessons ?? []).sort(
      (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
    ),
  };

  return NextResponse.json(course);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const { lessons, ...courseData } = body;

  const db = createAdminClient();

  const { error: courseError } = await db
    .from("courses")
    .update({
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
      students: courseData.students,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (courseError) return NextResponse.json({ error: courseError.message }, { status: 500 });

  // Replace lessons: delete existing then insert new
  if (lessons !== undefined) {
    await db.from("lessons").delete().eq("course_id", id);

    if (lessons.length > 0) {
      const lessonRows = lessons.map(
        (l: { id: string; title: string; duration: string; video_id?: string; description?: string }, i: number) => ({
          id: l.id,
          course_id: id,
          title: l.title,
          duration: l.duration,
          video_id: l.video_id ?? null,
          description: l.description ?? null,
          sort_order: i + 1,
        })
      );

      const { error: lessonError } = await db.from("lessons").insert(lessonRows);
      if (lessonError) return NextResponse.json({ error: lessonError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const db = createAdminClient();

  const { error } = await db.from("courses").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
