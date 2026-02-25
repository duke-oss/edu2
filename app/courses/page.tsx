"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { courses } from "@/app/data/courses";
import { BookOpen, Clock, User, ChevronRight, GraduationCap } from "lucide-react";

const levelBadge: Record<string, string> = {
  입문: "badge-success",
  중급: "badge-warning",
  고급: "badge-error",
};

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero */}
      <section className="bg-base-200 border-b border-base-300 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center gap-2 mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="badge badge-primary badge-outline gap-1">
              <GraduationCap size={11} />
              수입 소싱 교육
            </div>
          </motion.div>
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            강의 목록
          </motion.h1>
          <motion.p
            className="text-base-content/60 text-lg"
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
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Link href={`/courses/${course.id}`} className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col group">
                {/* Thumbnail */}
                <figure className={`h-36 bg-gradient-to-br ${course.thumbnail} flex items-end p-4 relative overflow-hidden`}>
                  <span className="badge badge-ghost bg-white/20 text-white backdrop-blur-sm border-0 text-xs font-semibold">
                    {course.category}
                  </span>
                  <span className={`badge absolute top-3 right-3 border-0 font-bold ${course.badge === "LIVE" ? "bg-error text-error-content" : "bg-black/30 text-white"}`}>
                    {course.badge === "LIVE" ? "🔴 LIVE" : "VOD"}
                  </span>
                </figure>

                {/* Content */}
                <div className="card-body flex-1 gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`badge badge-sm ${levelBadge[course.level] ?? "badge-ghost"}`}>
                      {course.level}
                    </span>
                  </div>

                  <h2 className="card-title text-base leading-snug group-hover:text-primary transition-colors">
                    {course.title}
                  </h2>
                  <p className="text-base-content/60 text-sm leading-relaxed flex-1 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-base-content/50 pt-3 border-t border-base-200">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <BookOpen size={12} />
                        {course.lessons.length}강
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {course.totalDuration}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {course.instructor}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-6 pb-5">
                  <div className="flex items-center text-primary text-sm font-semibold gap-1 group-hover:gap-2 transition-all">
                    강의 보기 <ChevronRight size={14} />
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
