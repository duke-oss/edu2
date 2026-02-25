"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Course } from "@/app/data/courses";
import { Play, Clock, ChevronRight, Lock, CheckCircle, Rocket, BookOpen } from "lucide-react";

export default function CoursePlayer({ course }: { course: Course }) {
  const [activeLesson, setActiveLesson] = useState(course.lessons[0]);

  return (
    <div data-theme="dark" className="min-h-screen bg-base-100 text-base-content">
      {/* Top Nav */}
      <div className="navbar bg-base-200 border-b border-base-300 px-4 sm:px-6 h-14 sticky top-0 z-50">
        <div className="navbar-start min-w-0 gap-2">
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-content">
              <Rocket size={13} fill="currentColor" />
            </div>
            <span className="font-bold text-sm hidden sm:block">Sellernote</span>
          </Link>
          <ChevronRight size={14} className="text-base-content/30 shrink-0" />
          <Link href="/courses" className="text-sm text-base-content/50 hover:text-base-content transition-colors shrink-0">
            강의 목록
          </Link>
          <ChevronRight size={14} className="text-base-content/30 shrink-0" />
          <Link href={`/courses/${course.id}`} className="text-sm text-base-content/50 hover:text-base-content transition-colors truncate max-w-[160px]">
            {course.title}
          </Link>
          <ChevronRight size={14} className="text-base-content/30 shrink-0" />
          <span className="text-sm font-medium shrink-0">수강 중</span>
        </div>
        <div className="navbar-end shrink-0">
          <span className="text-xs text-base-content/40 hidden sm:block">
            {course.lessons.length}개 강의 · {course.totalDuration}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-56px)]">
        {/* Video Area */}
        <div className="flex-1 min-w-0">
          {/* Video Player */}
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
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-base-300">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Play size={28} className="text-base-content/30 ml-1" />
                  </motion.div>
                  <p className="text-base-content/50 text-sm">강의 준비 중입니다</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Lesson Info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLesson.id + "-info"}
              className="p-6 lg:p-8 border-t border-base-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-xs text-base-content/50 mb-2">
                  <BookOpen size={13} />
                  <span>{course.category}</span>
                  <span>·</span>
                  <Clock size={13} />
                  <span>{activeLesson.duration}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold mb-3">
                  {activeLesson.title}
                </h1>
                {activeLesson.description && (
                  <p className="text-base-content/60 leading-relaxed text-sm">
                    {activeLesson.description}
                  </p>
                )}

                {/* Prev/Next */}
                <div className="flex items-center gap-3 mt-6">
                  {course.lessons.indexOf(activeLesson) > 0 && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        setActiveLesson(
                          course.lessons[course.lessons.indexOf(activeLesson) - 1]
                        )
                      }
                      className="btn btn-sm btn-ghost"
                    >
                      이전 강의
                    </motion.button>
                  )}
                  {course.lessons.indexOf(activeLesson) < course.lessons.length - 1 && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        setActiveLesson(
                          course.lessons[course.lessons.indexOf(activeLesson) + 1]
                        )
                      }
                      className="btn btn-sm btn-primary gap-1"
                    >
                      다음 강의 <ChevronRight size={14} />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar - Curriculum */}
        <aside className="w-full lg:w-80 xl:w-96 bg-base-200 border-t lg:border-t-0 lg:border-l border-base-300 flex flex-col">
          <div className="p-4 border-b border-base-300">
            <h2 className="font-bold text-sm">커리큘럼</h2>
            <p className="text-xs text-base-content/50 mt-0.5">총 {course.lessons.length}강</p>
          </div>

          <div className="overflow-y-auto flex-1">
            {course.lessons.map((lesson, index) => {
              const isActive = lesson.id === activeLesson.id;
              return (
                <motion.button
                  key={lesson.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full text-left px-4 py-3.5 flex items-start gap-3 border-b border-base-300/50 transition-colors hover:bg-base-300 ${
                    isActive ? "bg-base-300 border-l-2 border-l-primary" : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="shrink-0 mt-0.5">
                    {isActive ? (
                      <motion.div
                        layoutId="active-indicator"
                        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Play size={10} className="ml-0.5 fill-white text-white" />
                      </motion.div>
                    ) : lesson.videoId ? (
                      <div className="w-6 h-6 rounded-full bg-base-300 flex items-center justify-center">
                        <CheckCircle size={13} className="text-success" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-base-100 flex items-center justify-center text-base-content/40 text-xs font-bold">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-snug ${isActive ? "" : "text-base-content/70"}`}>
                      {lesson.title}
                    </p>
                    <p className="text-xs text-base-content/40 mt-0.5 flex items-center gap-1">
                      <Clock size={11} />
                      {lesson.duration}
                    </p>
                  </div>

                  {!lesson.videoId && !isActive && (
                    <Lock size={12} className="text-base-content/30 shrink-0 mt-1" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
