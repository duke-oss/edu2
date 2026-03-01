import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase";
import {
  BookOpen, Clock, Users, Play,
  GraduationCap, Award, ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const db = createAdminClient();
  const { data, error } = await db
    .from("courses")
    .select("*, lessons(id, title, duration, video_id, description, sort_order)")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const lessons = (data.lessons ?? []).sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
  );

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <div className={`relative bg-gradient-to-br ${data.thumbnail} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-white">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-white/60 mb-6">
            <Link href="/courses" className="hover:text-white transition-colors">강의 목록</Link>
            <ChevronRight size={12} />
            <span className="text-white/80">{data.title}</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
              {data.level}
            </Badge>
            <Badge className={`border-0 ${data.badge === "LIVE" ? "bg-red-500 text-white" : "bg-black/30 text-white"}`}>
              {data.badge === "LIVE" ? "🔴 LIVE" : "VOD"}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 leading-tight max-w-2xl">
            {data.title}
          </h1>
          <p className="text-white/75 text-base leading-relaxed max-w-2xl mb-7">
            {data.description}
          </p>

          <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><GraduationCap size={14} /> {data.instructor}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {data.total_duration}</span>
            <span className="flex items-center gap-1.5"><Users size={14} /> 수강생 {data.students}</span>
            <span className="flex items-center gap-1.5"><BookOpen size={14} /> {lessons.length}개 강의</span>
          </div>
        </div>
      </div>

      {/* ── Content + Sidebar ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Curriculum ── */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black mb-5">커리큘럼</h2>
            <Card>
              <div className="px-5 py-3 bg-muted/50 border-b border-border flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">전체 {lessons.length}강</span>
                <span className="text-xs text-muted-foreground">{data.total_duration}</span>
              </div>
              {lessons.map((lesson: { id: string; title: string; duration: string; description?: string }, i: number) => (
                <div
                  key={`${lesson.id}-${i}`}
                  className={`flex items-start gap-4 px-5 py-4 ${i !== 0 ? "border-t border-border" : ""}`}
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{lesson.title}</p>
                    {lesson.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{lesson.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0 mt-0.5">
                    <Clock size={11} /> {lesson.duration}
                  </span>
                </div>
              ))}
            </Card>
          </div>

          {/* ── Purchase Card ── */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24">
              <Card>
                <CardContent className="pt-5">
                  {/* Thumbnail preview */}
                  <div className={`w-full h-32 bg-gradient-to-br ${data.thumbnail} rounded-lg mb-5 flex items-center justify-center`}>
                    <Play size={36} className="text-white/50" />
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <span className={`text-3xl font-black ${data.free ? "text-primary" : "text-foreground"}`}>
                      {data.price}
                    </span>
                  </div>

                  {/* CTA */}
                  <Button asChild className="w-full mb-5">
                    <Link href={`/courses/${data.id}/player`} className="gap-2">
                      <Play size={15} /> 수강 시작하기
                    </Link>
                  </Button>

                  {/* Meta */}
                  <Separator className="mb-4" />
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen size={14} className="shrink-0" />
                      총 {lessons.length}개 강의
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={14} className="shrink-0" />
                      {data.total_duration}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users size={14} className="shrink-0" />
                      수강생 {data.students}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Award size={14} className="shrink-0" />
                      난이도: {data.level}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap size={14} className="shrink-0" />
                      강사: {data.instructor}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
