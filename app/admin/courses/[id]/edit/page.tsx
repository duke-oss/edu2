import { requireAdmin } from "@/lib/admin";
import { redirect, notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import CourseForm from "../../CourseForm";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  if (!session) redirect("/");

  const { id } = await params;
  const db = createAdminClient();

  const { data, error } = await db
    .from("courses")
    .select("*, lessons(id, title, duration, video_id, description, sort_order)")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const lessons = (data.lessons ?? [])
    .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
    .map((l: { id: string; title: string; duration: string; video_id: string | null; description: string | null; sort_order: number }) => ({
      id: l.id,
      title: l.title,
      duration: l.duration,
      video_id: l.video_id ?? "",
      description: l.description ?? "",
    }));

  const initialData = {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    level: data.level,
    instructor: data.instructor,
    total_duration: data.total_duration,
    thumbnail: data.thumbnail,
    badge: data.badge,
    price: data.price,
    free: data.free,
    students: data.students,
    lessons,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">강의 수정</h1>
      <p className="text-muted-foreground text-sm mb-8">{data.title}</p>
      <CourseForm mode="edit" initialData={initialData} />
    </div>
  );
}
