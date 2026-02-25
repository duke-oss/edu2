import { notFound } from "next/navigation";
import Link from "next/link";
import { getCourse } from "@/app/data/courses";
import {
  BookOpen, Clock, Users, Play,
  GraduationCap, Award, ChevronRight,
} from "lucide-react";

const levelBadge: Record<string, string> = {
  입문: "badge-success",
  중급: "badge-warning",
  고급: "badge-error",
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getCourse(id);
  if (!course) notFound();

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero */}
      <div className={`relative bg-gradient-to-br ${course.thumbnail} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-white">
          {/* Breadcrumb */}
          <div className="breadcrumbs text-xs text-white/60 mb-6 p-0">
            <ul>
              <li><Link href="/courses" className="hover:text-white transition-colors">강의 목록</Link></li>
              <li className="text-white/80">{course.title}</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className={`badge ${levelBadge[course.level]} border-0`}>
              {course.level}
            </span>
            <span className={`badge border-0 font-bold ${course.badge === "LIVE" ? "bg-error text-error-content" : "bg-black/30 text-white"}`}>
              {course.badge === "LIVE" ? "🔴 LIVE" : "VOD"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 leading-tight max-w-2xl">
            {course.title}
          </h1>
          <p className="text-white/75 text-base leading-relaxed max-w-2xl mb-7">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><GraduationCap size={14} /> {course.instructor}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {course.totalDuration}</span>
            <span className="flex items-center gap-1.5"><Users size={14} /> 수강생 {course.students}</span>
            <span className="flex items-center gap-1.5"><BookOpen size={14} /> {course.lessons.length}개 강의</span>
          </div>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Curriculum */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black mb-5">커리큘럼</h2>
            <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-base-200 border-b border-base-300 flex items-center justify-between">
                <span className="text-sm font-bold">전체 {course.lessons.length}강</span>
                <span className="text-xs text-base-content/50">{course.totalDuration}</span>
              </div>
              {course.lessons.map((lesson, i) => (
                <div
                  key={lesson.id}
                  className={`flex items-start gap-4 px-5 py-4 ${i !== 0 ? "border-t border-base-200" : ""}`}
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{lesson.title}</p>
                    {lesson.description && (
                      <p className="text-xs text-base-content/50 mt-0.5 leading-relaxed">{lesson.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-base-content/50 flex items-center gap-1 shrink-0 mt-0.5">
                    <Clock size={11} /> {lesson.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Card */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="card bg-base-100 border border-base-200 shadow-sm sticky top-24">
              {/* Thumbnail preview */}
              <figure className={`h-32 bg-gradient-to-br ${course.thumbnail} flex items-center justify-center rounded-t-2xl`}>
                <Play size={36} className="text-white/50" />
              </figure>
              <div className="card-body gap-4">
                {/* Price */}
                <div>
                  <span className={`text-3xl font-black ${course.free ? "text-primary" : ""}`}>
                    {course.price}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  href={`/courses/${course.id}/player`}
                  className="btn btn-primary btn-block gap-2"
                >
                  <Play size={15} /> 수강 시작하기
                </Link>

                {/* Meta */}
                <div className="space-y-2 text-sm border-t border-base-200 pt-4">
                  <div className="flex items-center gap-2 text-base-content/60">
                    <BookOpen size={14} className="text-base-content/30 shrink-0" />
                    총 {course.lessons.length}개 강의
                  </div>
                  <div className="flex items-center gap-2 text-base-content/60">
                    <Clock size={14} className="text-base-content/30 shrink-0" />
                    {course.totalDuration}
                  </div>
                  <div className="flex items-center gap-2 text-base-content/60">
                    <Users size={14} className="text-base-content/30 shrink-0" />
                    수강생 {course.students}
                  </div>
                  <div className="flex items-center gap-2 text-base-content/60">
                    <Award size={14} className="text-base-content/30 shrink-0" />
                    난이도: {course.level}
                  </div>
                  <div className="flex items-center gap-2 text-base-content/60">
                    <GraduationCap size={14} className="text-base-content/30 shrink-0" />
                    강사: {course.instructor}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
