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

  const { data, error } = await db
    .from("courses")
    .select("*, lessons(id, title, duration, video_id, description, sort_order)")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

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
