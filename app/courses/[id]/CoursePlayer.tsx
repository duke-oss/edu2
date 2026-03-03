"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Course } from "@/app/data/courses";
import {
  Play,
  Clock,
  ChevronRight,
  CheckCircle,
  Rocket,
  BookOpen,
  ArrowLeft,
  Award,
  Paperclip,
  Download,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  course: Course;
  watchedLessonIds: string[];
  userId: string | null;
};

export default function CoursePlayer({ course, watchedLessonIds, userId }: Props) {
  const router = useRouter();
  const [activeLesson, setActiveLesson] = useState(course.lessons[0] ?? null);
  const [watched, setWatched] = useState<Set<string>>(() => new Set(watchedLessonIds));
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<{ id: string; name: string; file_url: string }[]>([]);

  const totalLessons = course.lessons.length;
  const watchedCount = watched.size;
  const progressPct = totalLessons > 0 ? Math.round((watchedCount / totalLessons) * 100) : 0;
  const isComplete = progressPct === 100;

  const currentIndex = useMemo(
    () => (activeLesson ? course.lessons.indexOf(activeLesson) : -1),
    [activeLesson, course.lessons]
  );

  const issueCertificate = useCallback(async () => {
    if (!userId) return;
    const res = await fetch("/api/certificate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: course.id }),
    });
    if (res.ok) {
      const { id } = await res.json();
      setCertificateId(id);
    }
  }, [userId, course.id]);

  const markWatched = useCallback(
    async (lessonId: string) => {
      if (!userId || watched.has(lessonId)) return;

      const next = new Set([...watched, lessonId]);
      setWatched(next);

      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, lessonId }),
      });

      if (next.size === totalLessons && totalLessons > 0) {
        issueCertificate();
      }
    },
    [userId, watched, course.id, totalLessons, issueCertificate]
  );

  useEffect(() => {
    if (!userId || !activeLesson) return;

    fetch(`/api/courses/${course.id}/attachments?lessonId=${activeLesson.id}`)
      .then((r) => r.json())
      .then((data) => setAttachments(Array.isArray(data) ? data : []))
      .catch(() => setAttachments([]));
  }, [userId, course.id, activeLesson]);

  const handleSelectLesson = useCallback(
    (lesson: Course["lessons"][number]) => {
      if (activeLesson) markWatched(activeLesson.id);
      setActiveLesson(lesson);
    },
    [activeLesson, markWatched]
  );

  if (!activeLesson) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400">등록된 강의가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) router.back();
              else router.push(`/courses/${course.id}`);
            }}
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm hidden sm:block">돌아가기</span>
          </button>

          <div className="w-px h-4 bg-zinc-700 hidden sm:block" />

          <Link href="/" className="hidden sm:inline-flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <Rocket size={13} fill="currentColor" />
            </div>
            <span className="font-semibold text-sm">Sellernote</span>
          </Link>

          <ChevronRight size={14} className="text-zinc-600 shrink-0 hidden sm:block" />
          <span className="text-sm text-zinc-300 truncate max-w-[45vw] sm:max-w-[320px]">{course.title}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          <div className="hidden sm:block text-right">
            <p className="text-[11px] text-zinc-400">
              {watchedCount} / {totalLessons}강 완료
            </p>
            <div className="w-28 h-1.5 bg-zinc-700 rounded-full overflow-hidden mt-1">
              <motion.div
                className={`h-full rounded-full ${isComplete ? "bg-emerald-400" : "bg-primary"}`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
          <span className={`text-sm font-bold tabular-nums ${isComplete ? "text-emerald-400" : "text-primary"}`}>
            {progressPct}%
          </span>
        </div>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] min-h-[calc(100vh-64px)]">
        <main className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeLesson.id}-video`}
              className="w-full bg-black aspect-video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeLesson.videoId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${activeLesson.videoId}?autoplay=1`}
                  title={activeLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-zinc-900">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Play size={28} className="text-zinc-500 ml-1" />
                  </div>
                  <p className="text-zinc-400 text-sm">영상이 준비 중입니다.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.section
              key={`${activeLesson.id}-info`}
              className="p-6 lg:p-8 border-t border-zinc-800"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="max-w-4xl">
                {isComplete && (
                  <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 flex items-start gap-2.5">
                    <Sparkles size={16} className="text-emerald-300 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-200">축하합니다! 강의를 완강했어요.</p>
                      <p className="text-xs text-emerald-100/80 mt-0.5">수료증 확인 및 후기를 남기면 학습 이력이 더 풍성해집니다.</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-3">
                  <span className="inline-flex items-center gap-1"><BookOpen size={13} /> {course.category}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1"><Clock size={13} /> {activeLesson.duration}</span>
                  {watched.has(activeLesson.id) && (
                    <>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-emerald-300"><CheckCircle size={13} /> 시청 완료</span>
                    </>
                  )}
                </div>

                <h1 className="text-2xl font-bold mb-3">{activeLesson.title}</h1>
                {activeLesson.description && (
                  <p className="text-zinc-300 leading-relaxed">{activeLesson.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-2.5 mt-6">
                  {currentIndex > 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                      onClick={() => handleSelectLesson(course.lessons[currentIndex - 1])}
                    >
                      이전 강의
                    </Button>
                  )}

                  {currentIndex < totalLessons - 1 ? (
                    <Button
                      size="sm"
                      className="rounded-full gap-1"
                      onClick={() => handleSelectLesson(course.lessons[currentIndex + 1])}
                    >
                      다음 강의 <ChevronRight size={14} />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="rounded-full gap-1 bg-emerald-600 hover:bg-emerald-500"
                      onClick={() => markWatched(activeLesson.id)}
                      disabled={watched.has(activeLesson.id)}
                    >
                      <CheckCircle size={14} />
                      {watched.has(activeLesson.id) ? "완강 처리됨" : "완료 표시"}
                    </Button>
                  )}

                  {certificateId && (
                    <Link
                      href={`/certificate/${certificateId}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-400/20"
                    >
                      <Award size={13} /> 수료증 보기
                    </Link>
                  )}

                  {isComplete && (
                    <Link
                      href={`/courses/${course.id}?review=write#reviews`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-xs text-sky-300 hover:bg-sky-400/20"
                    >
                      후기 작성하러 가기
                    </Link>
                  )}
                </div>

                {attachments.length > 0 && (
                  <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
                    <p className="text-xs font-semibold text-zinc-300 inline-flex items-center gap-1.5 mb-2.5">
                      <Paperclip size={12} /> 강의 자료
                    </p>
                    <div className="space-y-2">
                      {attachments.map((att) => (
                        <a
                          key={att.id}
                          href={att.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors"
                        >
                          <Download size={13} className="text-primary" />
                          {att.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          </AnimatePresence>
        </main>

        <aside className="border-t xl:border-t-0 xl:border-l border-zinc-800 bg-zinc-900/95 backdrop-blur flex flex-col min-h-[320px]">
          <div className="px-4 py-4 border-b border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-sm">커리큘럼</h2>
              <span className="text-xs text-zinc-400 inline-flex items-center gap-1">
                <BarChart3 size={12} /> {watchedCount}/{totalLessons}
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${isComplete ? "bg-emerald-400" : "bg-primary"}`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <p className="text-[11px] text-zinc-400 mt-1.5">진도율 {progressPct}%</p>
          </div>

          <div className="overflow-y-auto flex-1">
            {course.lessons.map((lesson, index) => {
              const isActive = lesson.id === activeLesson.id;
              const isWatched = watched.has(lesson.id);

              return (
                <motion.button
                  key={lesson.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.02 }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`w-full text-left px-4 py-3.5 flex items-start gap-3 border-b border-zinc-800/70 transition-colors ${
                    isActive ? "bg-zinc-800/90 border-l-2 border-l-primary" : ""
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isActive ? (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Play size={10} className="ml-0.5 fill-white text-white" />
                      </div>
                    ) : isWatched ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle size={14} className="text-emerald-400" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs font-bold">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-snug ${
                        isActive ? "text-white font-medium" : isWatched ? "text-zinc-400" : "text-zinc-300"
                      }`}
                    >
                      {lesson.title}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1 inline-flex items-center gap-1">
                      <Clock size={11} /> {lesson.duration}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
