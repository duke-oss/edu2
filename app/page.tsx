import { createAdminClient } from "@/lib/supabase";
import HomePageClient from "./HomePageClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const db = createAdminClient();
  const { data } = await db
    .from("courses")
    .select("id, title, description, category, level, instructor, total_duration, thumbnail, badge, price, free, students")
    .order("created_at", { ascending: true });

  const courses = (data ?? []).map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category,
    level: c.level,
    instructor: c.instructor,
    totalDuration: c.total_duration,
    thumbnail: c.thumbnail,
    badge: c.badge,
    price: c.price,
    free: c.free ?? false,
    students: c.students,
  }));

  return <HomePageClient courses={courses} />;
}
