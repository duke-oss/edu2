import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";
import {
  BookOpen,
  Clock,
  Users,
  GraduationCap,
  Award,
  ChevronRight,
  BarChart3,
  Sparkles,
  PlayCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import EnrollButton from "./EnrollButton";
import ReviewSection from "./ReviewSection";
import { getCourseThumbnailRenderProps } from "@/lib/courseThumbnail";

export const dynamic = "force-dynamic";

type ReviewRow = {
  id: string;
  rating: number;
  content: string;
  created_at: string;
  users: { name?: string } | null;
};

const levelTone: Record<string, string> = {
  입문: "bg-emerald-50 text-emerald-700 border-emerald-200",
  초급: "bg-sky-50 text-sky-700 border-sky-200",
  중급: "bg-amber-50 text-amber-700 border-amber-200",
  고급: "bg-rose-50 text-rose-700 border-rose-200",
};

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ review?: string }>;
}) {
  const { id } = await params;
  const { review } = await searchParams;

  const [session, db] = [await auth(), createAdminClient()];

  const { data, error } = await db
    .from("courses")
    .select("*, lessons(id, title, duration, video_id, description, sort_order)")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  let enrolled = false;
  let watchedCount = 0;
  let myReviewId: string | null = null;

  if (session?.user?.id) {
    const [{ data: enrollment }, { data: watched }, { data: myReview }] = await Promise.all([
      db.from("enrollments").select("id").eq("user_id", session.user.id).eq("course_id", id).maybeSingle(),
      db.from("lesson_progress").select("id").eq("user_id", session.user.id).eq("course_id", id),
      db.from("reviews").select("id").eq("user_id", session.user.id).eq("course_id", id).maybeSingle(),
    ]);

    enrolled = !!enrollment;
    watchedCount = watched?.length ?? 0;
    myReviewId = myReview?.id ?? null;
  }

  const { data: reviews } = await db
    .from("reviews")
    .select("id, rating, content, created_at, users(name)")
    .eq("course_id", id)
    .order("created_at", { ascending: false });

  const lessons = (data.lessons ?? []).sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
  );
  const progressPct = lessons.length > 0 ? Math.round((watchedCount / lessons.length) * 100) : 0;
  const heroThumb = getCourseThumbnailRenderProps(data.thumbnail, data.title);

  return (
    <div className="min-h-screen bg-background">
      <section className={`relative overflow-hidden ${heroThumb.className}`} style={heroThumb.style}>
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-white">
          <div className="flex items-center gap-1.5 text-xs text-white/70 mb-6">
            <Link href="/courses" className="hover:text-white transition-colors">
              강의 목록
            </Link>
            <ChevronRight size={12} />
            <span className="truncate max-w-[70vw]">{data.title}</span>
          </div>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">{data.category}</Badge>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border bg-white/90 ${levelTone[data.level] ?? "text-foreground border-border"}`}>
              {data.level}
            </span>
            <Badge className={`border-0 ${data.badge === "LIVE" ? "bg-red-500 text-white" : "bg-black/40 text-white"}`}>
              {data.badge === "LIVE" ? "LIVE" : "VOD"}
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            {data.title}
          </h1>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-3xl mt-4">
            {data.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-w-3xl">
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-[11px] text-white/70 mb-1">강의 수</p>
              <p className="text-lg font-bold">{lessons.length}강</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-[11px] text-white/70 mb-1">총 시간</p>
              <p className="text-lg font-bold">{data.total_duration}</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-[11px] text-white/70 mb-1">수강생</p>
              <p className="text-lg font-bold">{data.students}</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-[11px] text-white/70 mb-1">강사</p>
              <p className="text-lg font-bold truncate">{data.instructor}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-5">
            <Card className="rounded-2xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-black inline-flex items-center gap-2">
                    <PlayCircle size={20} /> 커리큘럼
                  </h2>
                  <span className="text-sm text-muted-foreground">총 {lessons.length}강</span>
                </div>

                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="grid grid-cols-[auto_1fr_auto] gap-3 px-4 py-3 bg-muted/35 text-xs font-semibold text-muted-foreground">
                    <span>회차</span>
                    <span>강의명</span>
                    <span>시간</span>
                  </div>

                  {lessons.map((lesson: { id: string; title: string; duration: string; description?: string }, i: number) => (
                    <div
                      key={`${lesson.id}-${i}`}
                      className={`grid grid-cols-[auto_1fr_auto] gap-3 px-4 py-4 items-start ${i !== 0 ? "border-t border-border" : ""}`}
                    >
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">{lesson.title}</p>
                        </div>
                        {lesson.description && (
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{lesson.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground inline-flex items-center gap-1 whitespace-nowrap">
                          <Clock size={11} /> {lesson.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <ReviewSection
              courseId={id}
              initialReviews={(reviews ?? []) as ReviewRow[]}
              canReview={enrolled && watchedCount > 0}
              myReviewId={myReviewId}
              userId={session?.user?.id ?? null}
              openFormOnLoad={review === "write"}
            />
          </div>

          <aside className="space-y-4">
            <Card className="rounded-2xl sticky top-24">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">수강 가격</p>
                  <p className={`text-3xl font-black ${data.free ? "text-primary" : "text-foreground"}`}>{data.price}</p>
                </div>

                <EnrollButton courseId={data.id} enrolled={enrolled} loggedIn={!!session?.user?.id} />

                {enrolled && (
                  <div className="rounded-xl border border-border bg-muted/20 p-3 mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground inline-flex items-center gap-1">
                        <BarChart3 size={12} /> 내 학습 진도
                      </span>
                      <span className="font-semibold text-primary">{progressPct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${progressPct}%` }} />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5">
                      {watchedCount} / {lessons.length}강 완료
                    </p>
                  </div>
                )}

                <Separator className="mb-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground"><BookOpen size={14} /> 강의 수</span>
                    <span className="font-medium">총 {lessons.length}강</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Clock size={14} /> 총 시간</span>
                    <span className="font-medium">{data.total_duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Users size={14} /> 수강생</span>
                    <span className="font-medium">{data.students}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Award size={14} /> 난이도</span>
                    <span className="font-medium">{data.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground"><GraduationCap size={14} /> 강사</span>
                    <span className="font-medium">{data.instructor}</span>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-border bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground inline-flex items-center gap-1.5 w-full">
                  <Sparkles size={13} className="text-primary" />
                  구매 후 즉시 수강 가능, 완료 시 수강증 발급
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}
