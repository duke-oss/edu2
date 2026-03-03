import Link from "next/link";
import { Suspense } from "react";
import { createAdminClient } from "@/lib/supabase";
import { BookOpen, Clock, User, ChevronRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CourseFilters from "./CourseFilters";
import { getCourseThumbnailRenderProps } from "@/lib/courseThumbnail";

export const dynamic = "force-dynamic";

const levelColor: Record<string, string> = {
  입문: "bg-emerald-50 text-emerald-700 border-emerald-200",
  초급: "bg-sky-50 text-sky-700 border-sky-200",
  중급: "bg-amber-50 text-amber-700 border-amber-200",
  고급: "bg-rose-50 text-rose-700 border-rose-200",
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; level?: string; category?: string; price?: string }>;
}) {
  const { search, level, category, price } = await searchParams;
  const db = createAdminClient();

  let query = db
    .from("courses")
    .select("id, title, description, category, level, instructor, total_duration, thumbnail, badge, price, free, students")
    .order("created_at", { ascending: true });

  if (search) query = query.ilike("title", `%${search}%`);
  if (level) query = query.eq("level", level);
  if (category) query = query.eq("category", category);
  if (price === "free") query = query.eq("free", true);
  if (price === "paid") query = query.eq("free", false);

  const { data, error } = await query;
  if (error) console.error("[courses page] fetch error:", error.message);

  const { data: lessonCounts } = await db.from("lessons").select("course_id");

  const countMap: Record<string, number> = {};
  for (const l of lessonCounts ?? []) countMap[l.course_id] = (countMap[l.course_id] ?? 0) + 1;

  const courses = (data ?? []).map((c) => ({ ...c, lessonCount: countMap[c.id] ?? 0 }));
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,197,94,0.14),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.14),transparent_35%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <p className="text-primary font-semibold text-sm mb-2 inline-flex items-center gap-1.5">
            <Sparkles size={14} /> Sellernote Academy
          </p>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">온라인 강의</h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl leading-relaxed">
            수입 무역 실무를 입문부터 고급까지 체계적으로 학습하세요. 실무에 바로 적용 가능한 강의만 선별했습니다.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Suspense>
          <CourseFilters />
        </Suspense>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-14">
        {courses.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card text-center py-20 text-muted-foreground">
            <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium text-foreground">검색 결과가 없습니다</p>
            <p className="text-sm mt-1">검색어 또는 필터 조건을 변경해보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => {
              const thumb = getCourseThumbnailRenderProps(course.thumbnail, course.title);
              return (
                <Link key={course.id} href={`/courses/${course.id}`} className="block h-full group">
                  <Card className="overflow-hidden h-full flex flex-col rounded-2xl border-border/80 hover:shadow-lg transition-all duration-300 py-0">
                    <div
                      className={`h-44 relative p-5 flex items-end ${thumb.className}`}
                      style={thumb.style}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="relative w-full flex items-center justify-between">
                        <Badge className="bg-white/90 text-foreground hover:bg-white border-0">{course.category}</Badge>
                        <Badge className="bg-black/50 text-white border-0">{course.free ? "무료" : "유료"}</Badge>
                      </div>
                    </div>

                    <CardContent className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${levelColor[course.level] ?? "border-border"}`}
                        >
                          {course.level}
                        </span>
                        <span className="text-xs text-muted-foreground">수강생 {course.students}</span>
                      </div>

                      <h2 className="font-bold text-lg leading-snug mb-2 line-clamp-2">{course.title}</h2>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-grow line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <BookOpen size={13} /> {course.lessonCount}강
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} /> {course.total_duration}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 truncate ml-2">
                          <User size={13} /> {course.instructor}
                        </span>
                      </div>

                      <div className="inline-flex items-center text-primary text-sm font-semibold gap-1 mt-4">
                        강의 상세 보기 <ChevronRight size={15} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
