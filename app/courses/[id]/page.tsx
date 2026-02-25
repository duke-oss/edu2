import { notFound } from "next/navigation";
import Link from "next/link";
import { getCourse } from "@/app/data/courses";
import {
  BookOpen, Clock, Users, Play,
  GraduationCap, Award, ChevronRight,
} from "lucide-react";

const levelColor: Record<string, string> = {
  입문: "bg-green-100 text-green-700",
  중급: "bg-blue-100 text-blue-700",
  고급: "bg-red-100 text-red-700",
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
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <div className={`relative bg-gradient-to-br ${course.thumbnail} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-white">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-white/60 mb-6">
            <Link href="/courses" className="hover:text-white transition-colors">강의 목록</Link>
            <ChevronRight size={12} />
            <span className="text-white/80">{course.title}</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${levelColor[course.level]} bg-opacity-90`}>
              {course.level}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${
              course.badge === "LIVE" ? "bg-red-500" : "bg-black/30"
            }`}>
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

      {/* ── Content + Sidebar ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Curriculum ── */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-gray-900 mb-5">커리큘럼</h2>
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">전체 {course.lessons.length}강</span>
                <span className="text-xs text-gray-400">{course.totalDuration}</span>
              </div>
              {course.lessons.map((lesson, i) => (
                <div
                  key={lesson.id}
                  className={`flex items-start gap-4 px-5 py-4 ${i !== 0 ? "border-t border-gray-100" : ""}`}
                >
                  <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900">{lesson.title}</p>
                    {lesson.description && (
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{lesson.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0 mt-0.5">
                    <Clock size={11} /> {lesson.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Purchase Card ── */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24 border border-gray-100 rounded-2xl p-6 shadow-sm">
              {/* Thumbnail preview */}
              <div className={`w-full h-32 bg-gradient-to-br ${course.thumbnail} rounded-xl mb-5 flex items-center justify-center`}>
                <Play size={36} className="text-white/50" />
              </div>

              {/* Price */}
              <div className="mb-5">
                <span className={`text-3xl font-black ${course.free ? "text-blue-600" : "text-gray-900"}`}>
                  {course.price}
                </span>
              </div>

              {/* CTA */}
              <Link
                href={`/courses/${course.id}/player`}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mb-5"
              >
                <Play size={15} /> 수강 시작하기
              </Link>

              {/* Meta */}
              <div className="space-y-2.5 text-sm border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2 text-gray-500">
                  <BookOpen size={14} className="text-gray-300 shrink-0" />
                  총 {course.lessons.length}개 강의
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock size={14} className="text-gray-300 shrink-0" />
                  {course.totalDuration}
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Users size={14} className="text-gray-300 shrink-0" />
                  수강생 {course.students}
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Award size={14} className="text-gray-300 shrink-0" />
                  난이도: {course.level}
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <GraduationCap size={14} className="text-gray-300 shrink-0" />
                  강사: {course.instructor}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
