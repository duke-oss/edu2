import { createAdminClient } from "@/lib/supabase";
import HomePageClient from "./HomePageClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const db = createAdminClient();

  const [{ data: coursesData }, { data: postsData }] = await Promise.all([
    db
      .from("courses")
      .select("id, title, description, category, level, instructor, total_duration, thumbnail, badge, price, free, students")
      .order("created_at", { ascending: true }),
    db
      .from("blog_posts")
      .select("id, title, slug, category, excerpt, read_time, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const courses = (coursesData ?? []).map((c) => ({
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

  const blogPosts = (postsData ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    excerpt: p.excerpt ?? "",
    readTime: p.read_time ?? "5분",
    date: new Date(p.created_at).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\. /g, ".").replace(/\.$/, ""),
  }));

  return <HomePageClient courses={courses} blogPosts={blogPosts} />;
}
