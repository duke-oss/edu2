import Link from "next/link";
import { createAdminClient } from "@/lib/supabase";
import { BookOpen, Clock, User, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const levelColor: Record<string, string> = {
  입문: "bg-green-50 text-green-700 border-green-200",
  초급: "bg-blue-50 text-blue-700 border-blue-200",
  중급: "bg-orange-50 text-orange-700 border-orange-200",
  고급: "bg-red-50 text-red-700 border-red-200",
};

export default async function CoursesPage() {
  const db = createAdminClient();

  const { data, error } = await db
    .from("courses")
    .select("id, title, description, category, level, instructor, total_duration, thumbnail, badge, price, free, students")
    .order("created_at", { ascending: true });

  if (error) console.error("[courses page] fetch error:", error.message);

  const { data: lessonCounts } = await db
    .from("lessons")
    .select("course_id");

  const countMap: Record<string, number> = {};
  for (const l of lessonCounts ?? []) {
    countMap[l.course_id] = (countMap[l.course_id] ?? 0) + 1;
  }

  const courses = (data ?? []).map((c) => ({
    ...c,
    lessonCount: countMap[c.id] ?? 0,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-muted/40 border-b border-border py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-primary font-semibold text-sm mb-2">수입 소싱 교육</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">강의 목록</h1>
          <p className="text-muted-foreground text-lg">
            수입 소싱의 모든 것. 입문부터 고급까지 단계별로 배워보세요.
          </p>
        </div>
      </section>

      {/* Course Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`} className="block h-full">
              <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow gap-0 py-0">
                {/* Thumbnail */}
                <div className={`h-36 bg-gradient-to-br ${course.thumbnail} flex items-end p-5`}>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                    {course.category}
                  </span>
                </div>

                {/* Content */}
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${levelColor[course.level] ?? ""}`}>
                      {course.level}
                    </span>
                  </div>

                  <h2 className="font-bold text-lg mb-2 leading-snug">{course.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-grow line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <BookOpen size={13} />
                        {course.lessonCount}강
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {course.total_duration}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <User size={13} />
                      {course.instructor}
                    </span>
                  </div>

                  <div className="flex items-center text-primary text-sm font-semibold gap-1 mt-4">
                    강의 보기 <ChevronRight size={15} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
