"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Ship, FileCheck, ShieldCheck, Truck, TrendingUp, BookOpen,
  Star, Users, GraduationCap, Clock, ArrowRight, ChevronRight,
  Sparkles, BarChart2, Award, Zap, Globe, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { getCourseThumbnailRenderProps } from "@/lib/courseThumbnail";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const CATEGORIES = [
  { label: "전체", icon: Sparkles, id: "전체" },
  { label: "입문", icon: BookOpen, id: "입문" },
  { label: "무역 실무", icon: FileCheck, id: "무역 실무" },
  { label: "물류·운송", icon: Truck, id: "물류·운송" },
  { label: "통관·관세", icon: ShieldCheck, id: "통관·관세" },
  { label: "LIVE", icon: TrendingUp, id: "LIVE" },
];

const FEATURES = [
  {
    icon: Award,
    gradient: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-400",
    title: "현직 전문가 직강",
    desc: "삼성물산 출신 무역팀장, 공인 관세사 등 현장 10년+ 전문가가 직접 커리큘럼을 설계하고 강의합니다.",
    wide: true,
  },
  {
    icon: Zap,
    gradient: "from-violet-500/20 to-violet-600/5",
    iconColor: "text-violet-400",
    title: "즉시 적용 가능한 실무 지식",
    desc: "이론이 아닌 실전 서류, 협상 스크립트, 실제 케이스 중심의 커리큘럼.",
    wide: false,
  },
  {
    icon: BarChart2,
    gradient: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-400",
    title: "검증된 성과",
    desc: "수강생 2,300명+ 무역 창업 성공. 평균 3개월 내 첫 오더.",
    wide: false,
  },
  {
    icon: Globe,
    gradient: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-400",
    title: "온·오프라인 통합 교육",
    desc: "VOD와 LIVE 강의, 오프라인 워크숍까지. 원하는 방식으로 배우세요.",
    wide: false,
  },
  {
    icon: MessageSquare,
    gradient: "from-rose-500/20 to-rose-600/5",
    iconColor: "text-rose-400",
    title: "전문가 1:1 Q&A",
    desc: "강의 중 생기는 실무 질문을 전문가에게 직접 물어볼 수 있습니다.",
    wide: false,
  },
];

const INSTRUCTORS = [
  { gradient: "from-blue-500 to-indigo-500", name: "김태호", role: "수입 무역 전문가", career: "전 삼성물산 무역팀장 · 15년 경력", rating: 4.9, courses: 4, students: "3,200+" },
  { gradient: "from-violet-500 to-purple-500", name: "이정민", role: "공인 관세사", career: "관세사 10년 · 연간 3,000건+ 처리", rating: 4.9, courses: 3, students: "2,100+" },
  { gradient: "from-emerald-500 to-teal-500", name: "박소연", role: "중국 소싱 전문가", career: "광저우·이우 현지 바이어 10년", rating: 4.8, courses: 3, students: "2,800+" },
  { gradient: "from-amber-500 to-orange-500", name: "정우석", role: "물류·포워딩 전문가", career: "전 글로비스 포워딩팀장", rating: 4.8, courses: 2, students: "1,600+" },
];

const REVIEWS_ROW1 = [
  { initial: "오", gradient: "from-blue-500 to-indigo-500", text: "무역 완전 초보였는데 A to Z 강의 하나로 실제 수입 첫 오더까지 성공했어요. 강의가 현실적이고 바로 써먹을 수 있어요.", name: "오지은", course: "수입 비즈니스 완전 정복", rating: 5 },
  { initial: "한", gradient: "from-violet-500 to-purple-500", text: "관세 환급 제도를 몰랐는데 강의 덕분에 연간 800만원 절감했어요. 수강료 몇 배 가치가 있습니다.", name: "한동훈", course: "통관·관세 실무 과정", rating: 5 },
  { initial: "강", gradient: "from-emerald-500 to-teal-500", text: "협상 스크립트가 압권이었어요. 실제 협상에서 바로 쓰고 단가를 30% 낮췄습니다.", name: "강나연", course: "중국 소싱 전략", rating: 5 },
  { initial: "박", gradient: "from-rose-500 to-pink-500", text: "HS코드부터 FTA 활용까지, 혼자 공부했으면 몇 년 걸렸을 내용을 한 달 만에 익혔어요.", name: "박준형", course: "통관·관세 실무 과정", rating: 5 },
  { initial: "이", gradient: "from-cyan-500 to-sky-500", text: "LC, T/T, D/P 등 결제 조건이 항상 헷갈렸는데 이제 완벽히 이해하고 실무에 적용 중입니다.", name: "이수빈", course: "무역 실무 핵심", rating: 5 },
];

const REVIEWS_ROW2 = [
  { initial: "서", gradient: "from-amber-500 to-orange-500", text: "수입 물류 개념이 이렇게 쉬운 거였나요? 복잡하다고 생각했는데 강사님 설명 들으니 바로 이해됐어요.", name: "서민호", course: "물류·포워딩 실무", rating: 5 },
  { initial: "최", gradient: "from-indigo-500 to-blue-500", text: "오프라인 강의 들었는데 현장 사례가 너무 생생해서 강력 추천합니다. 실제 계약서 리뷰가 최고였어요.", name: "최준혁", course: "수입 물류·통관 실전", rating: 5 },
  { initial: "정", gradient: "from-teal-500 to-emerald-500", text: "3개월 만에 첫 수입 오더를 성공했어요. 강의 없이 시작했으면 실수투성이였을 것 같아요.", name: "정다은", course: "수입 비즈니스 완전 정복", rating: 5 },
  { initial: "윤", gradient: "from-purple-500 to-violet-500", text: "중국 공장 탐방부터 MOQ 협상까지 실전 노하우를 그대로 담은 강의예요. 돈 주고도 못 들을 내용.", name: "윤재현", course: "중국 소싱 전략", rating: 5 },
  { initial: "김", gradient: "from-pink-500 to-rose-500", text: "인보이스, 패킹리스트, B/L 작성법을 이렇게 쉽게 설명한 강의는 처음 봤어요. 완전 강추입니다.", name: "김민지", course: "무역 서류 완전 정복", rating: 5 },
];

const levelColor: Record<string, string> = {
  입문: "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950",
  중급: "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  고급: "text-orange-700 bg-orange-50 dark:text-orange-400 dark:bg-orange-950",
};

interface BlogPostItem {
  id: string; title: string; slug: string;
  category: string; excerpt: string; readTime: string; date: string;
}

interface CourseItem {
  id: string; title: string; description: string; category: string;
  level: string; instructor: string; totalDuration: string;
  thumbnail: string; badge: string; price: string; free: boolean; students: string;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function Home({ courses, blogPosts = [] }: { courses: CourseItem[]; blogPosts?: BlogPostItem[] }) {
  const [activeCategory, setActiveCategory] = useState("전체");

  const filteredCourses =
    activeCategory === "전체" ? courses
    : activeCategory === "LIVE" ? courses.filter((c) => c.badge === "LIVE")
    : courses.filter((c) => c.category === activeCategory);

  return (
    <div className="bg-background text-foreground">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden bg-black/[0.97] antialiased">
        <Spotlight className="-top-40 left-0 md:left-1/4 md:-top-20" fill="white" />
        <Spotlight className="top-10 right-0 md:right-1/4" fill="hsl(221 83% 53%)" />

        {/* 격자 */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_50%,transparent_110%)]" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/60 backdrop-blur-sm mb-8">
              <Ship size={11} className="text-blue-400" />
              수입 운송 전문 교육 플랫폼 · 수강생 15,000+
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
          >
            <span className="text-white">무역 전문가로 가는</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              가장 빠른 길
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto max-w-xl text-lg text-white/50 leading-relaxed mb-10"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          >
            시행착오는 줄이고, 성과는 빠르게.<br />
            현직 전문가가 직접 가르치는 실전 무역·수입 교육.
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-3 flex-wrap"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }}
          >
            <Button
              size="lg"
              className="rounded-full px-9 font-bold bg-white text-black hover:bg-white/90 h-12 shadow-xl shadow-white/10"
              asChild
            >
              <Link href="/register">무료로 시작하기 <ArrowRight size={15} className="ml-1" /></Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-9 font-bold h-12 border-white/15 text-white/80 hover:bg-white/8 hover:text-white hover:border-white/30"
              asChild
            >
              <Link href="/courses">강의 둘러보기</Link>
            </Button>
          </motion.div>

          {/* 통계 */}
          <motion.div
            className="mt-16 flex items-center justify-center gap-10 flex-wrap"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { num: "15,000+", label: "누적 수강생" },
              { num: "4.9", label: "평균 평점" },
              { num: "2,300+", label: "무역 창업 성공" },
              { num: "50+", label: "실무 강의" },
            ].map((s, i) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-white">{s.num}</p>
                <p className="text-xs text-white/35 mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 하단 페이드 */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ══════════════════════════════════════════
          WHY 섹션 — 벤토 그리드
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Why Sellernote</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              왜 15,000명이 선택했을까요?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 와이드 카드 */}
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className={f.wide ? "md:col-span-2 lg:col-span-2" : ""}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
              >
                <div className={`group relative h-full rounded-2xl border border-border bg-gradient-to-br ${f.gradient} p-7 overflow-hidden hover:border-border/80 hover:shadow-lg transition-all duration-300`}>
                  <div className="absolute inset-0 bg-background/60 group-hover:bg-background/50 transition-colors duration-300 rounded-2xl" />
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-background border border-border mb-5 ${f.iconColor}`}>
                      <f.icon size={20} />
                    </div>
                    <h3 className="text-base font-black mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          카테고리 + 강의 목록
      ══════════════════════════════════════════ */}
      <section className="bg-muted/40 border-t border-border">
        {/* 카테고리 sticky nav */}
        <div className="border-b border-border bg-background/80 backdrop-blur-md sticky top-[79px] z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto no-scrollbar py-2">
              {CATEGORIES.map(({ label, icon: Icon, id }) => (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                    activeCategory === id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon size={14} />
                  {label === "LIVE" ? "🔴 LIVE" : label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">Courses</p>
              <h2 className="text-2xl font-black tracking-tight">
                {activeCategory === "전체" ? "전체 강의" : activeCategory === "LIVE" ? "🔴 LIVE 강의" : `${activeCategory} 강의`}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">{filteredCourses.length}개 강의</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-primary font-semibold" asChild>
              <Link href="/courses">전체보기 <ChevronRight size={14} /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course, i) => {
              const thumb = getCourseThumbnailRenderProps(course.thumbnail, course.title);
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <Link href={`/courses/${course.id}`}>
                    <BackgroundGradient className="bg-card h-full flex flex-col">
                      <div className={`h-40 relative ${thumb.className}`} style={thumb.style}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white backdrop-blur-sm ${course.badge === "LIVE" ? "bg-red-500" : "bg-black/50"}`}>
                          {course.badge === "LIVE" ? "🔴 LIVE" : "VOD"}
                        </span>
                        {course.free && (
                          <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                            FREE
                          </span>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-muted-foreground">{course.category}</span>
                          <span className="text-muted-foreground/30">·</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelColor[course.level]}`}>{course.level}</span>
                        </div>
                        <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-2">{course.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{course.instructor} 강사</p>
                        <div className="flex items-center gap-1 mb-auto">
                          <Star size={11} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-bold text-yellow-600">4.9</span>
                          <span className="text-xs text-muted-foreground">({course.students})</span>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between">
                          <span className={`font-black text-base ${course.free ? "text-primary" : "text-foreground"}`}>{course.price}</span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock size={11} /> {course.totalDuration}
                          </div>
                        </div>
                      </div>
                    </BackgroundGradient>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          강사 소개
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Instructors</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
              업계 최고 전문가에게 배우세요
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              현직에서 활동 중인 전문가들이 실제 경험을 기반으로 가르칩니다
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {INSTRUCTORS.map((inst, i) => (
              <motion.div
                key={inst.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
              >
                <div className="group relative rounded-2xl border border-border bg-card p-6 text-center hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${inst.gradient} flex items-center justify-center text-white text-2xl font-black mb-4 shadow-md`}>
                      {inst.name[0]}
                    </div>
                    <p className="font-black text-sm mb-0.5">{inst.name}</p>
                    <p className="text-xs text-primary font-semibold mb-2">{inst.role}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">{inst.career}</p>
                    <Separator className="mb-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star size={10} className="text-yellow-500 fill-yellow-500" /> {inst.rating}
                      </span>
                      <span className="font-semibold text-foreground">{inst.students}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          수강생 후기 — 두 줄 InfiniteMovingCards
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-muted/40 border-t border-border overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Reviews</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
            수강생들의 실제 이야기
          </h2>
          <p className="text-muted-foreground text-base">
            수강 후 직접 경험한 변화를 들어보세요
          </p>
        </div>
        <div className="space-y-4">
          <InfiniteMovingCards items={REVIEWS_ROW1} direction="left" speed="slow" />
          <InfiniteMovingCards items={REVIEWS_ROW2} direction="right" speed="slow" />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA 배너 (다크 + 글로우)
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-black py-28">
        {/* 글로우 */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/20 blur-[100px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:72px_72px]" />

        <motion.div
          className="relative z-10 max-w-3xl mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/50 mb-8">
            <GraduationCap size={11} className="text-primary" />
            오늘 가입하면 무료 강의 즉시 제공
          </span>

          <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.15] tracking-tight mb-5">
            지금 시작하면<br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              3개월 후가 달라집니다
            </span>
          </h2>

          <p className="text-white/40 text-lg leading-relaxed mb-10">
            현직 전문가의 강의로 시행착오를 줄이고<br />
            더 빠르게 수입 비즈니스를 성장시키세요.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button
              size="lg"
              className="rounded-full px-10 h-13 font-bold bg-white text-black hover:bg-white/90 text-base shadow-xl shadow-white/10"
              asChild
            >
              <Link href="/register">무료로 시작하기 <ArrowRight size={16} className="ml-1" /></Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-10 h-13 font-bold text-base border-white/15 text-white/70 hover:bg-white/8 hover:text-white hover:border-white/30"
              asChild
            >
              <Link href="/courses">강의 전체 보기</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          블로그
      ══════════════════════════════════════════ */}
      {blogPosts.length > 0 && (
        <section className="py-20 bg-background border-t border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">Insights</p>
                <h2 className="text-2xl font-black tracking-tight">실무에 바로 쓰는 무역 지식</h2>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-primary font-semibold" asChild>
                <Link href="/blog">전체보기 <ChevronRight size={14} /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block h-full">
                    <div className="h-full rounded-2xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
                      <Badge variant="secondary" className="self-start mb-3 text-xs">{post.category}</Badge>
                      <h3 className="font-bold text-sm leading-snug flex-1 mb-4 group-hover:text-primary transition-colors">{post.title}</h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                        <span>{post.date}</span>
                        <span>읽기 {post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
