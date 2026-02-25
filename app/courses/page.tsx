"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { courses } from "@/app/data/courses";
import { BookOpen, Clock, User, ChevronRight } from "lucide-react";

const levelColor: Record<string, string> = {
  입문: "bg-green-50 text-green-700",
  초급: "bg-blue-50 text-blue-700",
  중급: "bg-orange-50 text-orange-700",
  고급: "bg-red-50 text-red-700",
};

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gray-50 border-b border-gray-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            className="text-blue-600 font-semibold text-sm mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            수입 소싱 교육
          </motion.p>
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            강의 목록
          </motion.h1>
          <motion.p
            className="text-gray-500 text-lg"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 }}
          >
            수입 소싱의 모든 것. 입문부터 고급까지 단계별로 배워보세요.
          </motion.p>
        </div>
      </section>

      {/* Course Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Link
                href={`/courses/${course.id}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full"
              >
                {/* Thumbnail */}
                <div className={`h-36 bg-gradient-to-br ${course.thumbnail} flex items-end p-5`}>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                    {course.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelColor[course.level]}`}>
                      {course.level}
                    </span>
                  </div>

                  <h2 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                    {course.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-grow line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <BookOpen size={13} />
                        {course.lessons.length}강
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {course.totalDuration}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <User size={13} />
                      {course.instructor}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-6 pb-5">
                  <div className="flex items-center text-blue-600 text-sm font-semibold gap-1 group-hover:gap-2 transition-all">
                    강의 보기 <ChevronRight size={15} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
