import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";
import CoursePlayer from "../CoursePlayer";
import type { Course } from "@/app/data/courses";

export const dynamic = "force-dynamic";

export default async function CoursePlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [session, db] = [await auth(), createAdminClient()];

  // is_preview 컬럼은 마이그레이션 후 존재 — 없어도 안전하게 동작하도록
  // 기본 쿼리에서 제외하고 별도로 시도
  const { data, error } = await db
    .from("courses")
    .select("*, lessons(id, title, duration, video_id, description, sort_order)")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  // is_preview 컬럼이 있으면 추가 조회, 없으면 빈 배열로 폴백
  let previewMap: Record<string, boolean> = {};
  try {
    const { data: previewData } = await db
      .from("lessons")
      .select("id, is_preview")
      .eq("course_id", id);
    if (previewData) {
      for (const row of previewData) {
        previewMap[row.id] = row.is_preview ?? false;
      }
    }
  } catch {
    // 컬럼 미존재 시 무시 — 모든 강의가 isPreview: false 로 처리됨
  }

  const lessons = (data.lessons ?? [])
    .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
    .map((l: {
      id: string;
      title: string;
      duration: string;
      video_id: string | null;
      description: string | null;
    }) => ({
      id: l.id,
      title: l.title,
      duration: l.duration,
      videoId: l.video_id ?? undefined,
      description: l.description ?? undefined,
      isPreview: previewMap[l.id] ?? false,
    }));

  let isEnrolled = false;
  let watchedLessonIds: string[] = [];

  if (session?.user?.id) {
    const [{ data: enrollment }, { data: progress }] = await Promise.all([
      db
        .from("enrollments")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("course_id", id)
        .maybeSingle(),
      db
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", session.user.id)
        .eq("course_id", id),
    ]);

    isEnrolled = !!enrollment;
    watchedLessonIds = progress?.map((r) => r.lesson_id) ?? [];
  }

  const course: Course = {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    level: data.level as Course["level"],
    instructor: data.instructor,
    totalDuration: data.total_duration,
    thumbnail: data.thumbnail,
    badge: data.badge as Course["badge"],
    price: data.price,
    free: data.free,
    students: data.students,
    lessons,
  };

  return (
    <CoursePlayer
      course={course}
      watchedLessonIds={watchedLessonIds}
      userId={session?.user?.id ?? null}
      isEnrolled={isEnrolled}
    />
  );
}
