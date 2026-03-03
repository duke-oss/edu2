"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Course } from "@/app/data/courses";
import { Play, Clock, ChevronRight, CheckCircle, Rocket, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  course: Course;
  watchedLessonIds: string[];
  userId: string | null;
};

export default function CoursePlayer({ course, watchedLessonIds, userId }: Props) {
  const [activeLesson, setActiveLesson] = useState(course.lessons[0] ?? null);
  const [watched, setWatched] = useState<Set<string>>(() => new Set(watchedLessonIds));

  const totalLessons = course.lessons.length;
  const watchedCount = watched.size;
  const progressPct = totalLessons > 0 ? Math.round((watchedCount / totalLessons) * 100) : 0;

  const markWatched = useCallback(
    (lessonId: string) => {
      if (!userId || watched.has(lessonId)) return;
      setWatched((prev) => new Set([...prev, lessonId]));
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, lessonId }),
      });
    },
    [userId, watched, course.id]
  );

  const handleSelectLesson = useCallback(
    (lesson: Course["lessons"][number]) => {
      // 현재 레슨을 시청 완료로 처리
      if (activeLesson) markWatched(activeLesson.id);
      setActiveLesson(lesson);
    },
    [activeLesson, markWatched]
  );

  if (!activeLesson) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">등록된 강의가 없습니다.</p>
      </div>
    );
  }

  const currentIndex = course.lessons.indexOf(activeLesson);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Nav */}
      <nav className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/courses/${course.id}`}
            className="flex items-center gap-1.5 shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm hidden sm:block">강의 상세</span>
          </Link>
          <div className="w-px h-4 bg-gray-700 shrink-0" />
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <Rocket size={13} fill="currentColor" />
            </div>
            <span className="font-bold text-sm hidden sm:block">Sellernote</span>
          </Link>
          <ChevronRight size={14} className="text-gray-600 shrink-0" />
          <span className="text-sm text-gray-400 truncate max-w-[160px]">{course.title}</span>
        </div>

        {/* 수강률 */}
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <div className="hidden sm:flex flex-col items-end gap-0.5">
            <span className="text-xs text-gray-400">
              {watchedCount} / {totalLessons}강 완료
            </span>
            <div className="w-28 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
          <span
            className={`text-sm font-bold tabular-nums ${
              progressPct === 100 ? "text-green-400" : "text-primary"
            }`}
          >
            {progressPct}%
          </span>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-56px)]">
        {/* Video Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLesson.id + "-video"}
              className="w-full bg-black aspect-video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
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
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gray-900">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                    <Play size={28} className="text-gray-500 ml-1" />
                  </div>
                  <p className="text-gray-400 text-sm">강의 준비 중입니다</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Lesson Info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLesson.id + "-info"}
              className="p-6 lg:p-8 border-t border-gray-800"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <BookOpen size={13} />
                  <span>{course.category}</span>
                  <span>·</span>
                  <Clock size={13} />
                  <span>{activeLesson.duration}</span>
                  {watched.has(activeLesson.id) && (
                    <>
                      <span>·</span>
                      <CheckCircle size={13} className="text-green-400" />
                      <span className="text-green-400">시청 완료</span>
                    </>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  {activeLesson.title}
                </h1>
                {activeLesson.description && (
                  <p className="text-gray-400 leading-relaxed">{activeLesson.description}</p>
                )}

                {/* Prev/Next */}
                <div className="flex items-center gap-3 mt-6">
                  {currentIndex > 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-full bg-gray-800 text-gray-200 hover:bg-gray-700"
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
                      className="rounded-full gap-1 bg-green-600 hover:bg-green-500"
                      onClick={() => markWatched(activeLesson.id)}
                      disabled={watched.has(activeLesson.id)}
                    >
                      <CheckCircle size={14} />
                      {watched.has(activeLesson.id) ? "수강 완료" : "완료 표시"}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 xl:w-96 bg-gray-900 border-t lg:border-t-0 lg:border-l border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-sm text-white">커리큘럼</h2>
              <span className="text-xs text-gray-400">
                {watchedCount}/{totalLessons}강
              </span>
            </div>
            {/* 진도 바 */}
            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{progressPct}% 완료</p>
          </div>

          <div className="overflow-y-auto flex-1">
            {course.lessons.map((lesson, index) => {
              const isActive = lesson.id === activeLesson.id;
              const isWatched = watched.has(lesson.id);
              return (
                <motion.button
                  key={lesson.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors border-b border-gray-800/50 ${
                    isActive ? "bg-gray-800 border-l-2 border-l-primary" : ""
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isActive ? (
                      <motion.div
                        layoutId="active-indicator"
                        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Play size={10} className="ml-0.5 fill-white text-white" />
                      </motion.div>
                    ) : isWatched ? (
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle size={14} className="text-green-400" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs font-bold">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium leading-snug ${
                        isActive
                          ? "text-white"
                          : isWatched
                          ? "text-gray-400 line-through decoration-gray-600"
                          : "text-gray-300"
                      }`}
                    >
                      {lesson.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <Clock size={11} />
                      {lesson.duration}
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
