"use client";

import { useState } from "react";
import Link from "next/link";
import { Course } from "@/app/data/courses";
import { Play, Clock, ChevronRight, Lock, CheckCircle, Rocket, BookOpen } from "lucide-react";

export default function CoursePlayer({ course }: { course: Course }) {
  const [activeLesson, setActiveLesson] = useState(course.lessons[0]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Nav */}
      <nav className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
              <Rocket size={13} fill="currentColor" />
            </div>
            <span className="font-bold text-sm hidden sm:block">Sellernote</span>
          </Link>
          <ChevronRight size={14} className="text-gray-600 shrink-0" />
          <Link href="/courses" className="text-sm text-gray-400 hover:text-white transition-colors shrink-0">
            강의 목록
          </Link>
          <ChevronRight size={14} className="text-gray-600 shrink-0" />
          <span className="text-sm text-white font-medium truncate">{course.title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <span className="text-xs text-gray-400 hidden sm:block">
            {course.lessons.length}개 강의 · {course.totalDuration}
          </span>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-56px)]">
        {/* Video Area */}
        <div className="flex-1 min-w-0">
          {/* Video Player */}
          <div className="w-full bg-black aspect-video">
            {activeLesson.videoId ? (
              <iframe
                key={activeLesson.id}
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
          </div>

          {/* Lesson Info */}
          <div className="p-6 lg:p-8 border-t border-gray-800">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <BookOpen size={13} />
                <span>{course.category}</span>
                <span>·</span>
                <Clock size={13} />
                <span>{activeLesson.duration}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">
                {activeLesson.title}
              </h1>
              {activeLesson.description && (
                <p className="text-gray-400 leading-relaxed">
                  {activeLesson.description}
                </p>
              )}

              {/* Prev/Next */}
              <div className="flex items-center gap-3 mt-6">
                {course.lessons.indexOf(activeLesson) > 0 && (
                  <button
                    onClick={() =>
                      setActiveLesson(
                        course.lessons[course.lessons.indexOf(activeLesson) - 1]
                      )
                    }
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-sm transition-colors"
                  >
                    이전 강의
                  </button>
                )}
                {course.lessons.indexOf(activeLesson) < course.lessons.length - 1 && (
                  <button
                    onClick={() =>
                      setActiveLesson(
                        course.lessons[course.lessons.indexOf(activeLesson) + 1]
                      )
                    }
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-colors"
                  >
                    다음 강의 <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Curriculum */}
        <aside className="w-full lg:w-80 xl:w-96 bg-gray-900 border-t lg:border-t-0 lg:border-l border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-bold text-sm text-white">커리큘럼</h2>
            <p className="text-xs text-gray-400 mt-0.5">총 {course.lessons.length}강</p>
          </div>

          <div className="overflow-y-auto flex-1">
            {course.lessons.map((lesson, index) => {
              const isActive = lesson.id === activeLesson.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full text-left px-4 py-3.5 flex items-start gap-3 hover:bg-gray-800/60 transition-colors border-b border-gray-800/50 ${
                    isActive ? "bg-gray-800 border-l-2 border-l-blue-500" : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="shrink-0 mt-0.5">
                    {isActive ? (
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                        <Play size={10} className="ml-0.5 fill-white text-white" />
                      </div>
                    ) : lesson.videoId ? (
                      <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                        <CheckCircle size={13} className="text-green-400" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs font-bold">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-snug ${isActive ? "text-white" : "text-gray-300"}`}>
                      {lesson.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <Clock size={11} />
                      {lesson.duration}
                    </p>
                  </div>

                  {/* Lock if no video */}
                  {!lesson.videoId && !isActive && (
                    <Lock size={12} className="text-gray-600 shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
