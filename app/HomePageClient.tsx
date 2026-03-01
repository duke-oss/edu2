"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Ship, Package, FileText, ShieldCheck, Handshake,
  Globe, BookOpen, TrendingUp, Leaf, ShoppingCart, Scale, Lightbulb,
  Star, Users, GraduationCap, Clock, ArrowRight,
  ChevronRight, Sparkles, BarChart2, FileCheck, Truck, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// ─── 카테고리 ───────────────────────────────
const CATEGORIES = [
  { label: "전체", icon: Sparkles, id: "전체" },
  { label: "입문", icon: BookOpen, id: "입문" },
  { label: "무역 실무", icon: FileCheck, id: "무역 실무" },
  { label: "물류·운송", icon: Truck, id: "물류·운송" },
  { label: "통관·관세", icon: ShieldCheck, id: "통관·관세" },
  { label: "LIVE", icon: TrendingUp, id: "LIVE" },
];

// ─── 블로그 ─────────────────────────────────
const BLOGS = [
  { icon: TrendingUp, category: "무역 동향", title: "2025년 해상 운임 동향과 수입업체 대응 전략", date: "2025.01.15", readTime: "5분" },
  { icon: FileText, category: "무역 서류", title: "Letter of Credit 개설부터 네고까지 완벽 가이드", date: "2025.01.08", readTime: "8분" },
  { icon: Leaf, category: "통관·관세", title: "FTA 원산지 증명서 활용으로 관세 절감하는 법", date: "2024.12.28", readTime: "6분" },
  { icon: ShoppingCart, category: "소싱 전략", title: "알리바바 소싱 시 절대 하지 말아야 할 실수 10가지", date: "2024.12.20", readTime: "7분" },
  { icon: Scale, category: "법규·규정", title: "수입 금지·제한 품목 완벽 정리 (2025년 최신판)", date: "2024.12.10", readTime: "9분" },
  { icon: Lightbulb, category: "실전 사례", title: "월 매출 3억 달성한 수입업체의 물류 시스템 공개", date: "2024.12.03", readTime: "10분" },
];

// ─── 강사 ────────────────────────────────────
const INSTRUCTORS = [
  { gradient: "from-blue-500 to-blue-400", name: "김태호", role: "수입 무역 전문가", career: "전 삼성물산 무역팀장 · 15년", rating: 4.9, reviews: 312, courses: 4 },
  { gradient: "from-violet-500 to-violet-400", name: "이정민", role: "공인 관세사", career: "관세사 10년 · 연간 3,000건+", rating: 4.9, reviews: 187, courses: 3 },
  { gradient: "from-emerald-500 to-emerald-400", name: "박소연", role: "중국 소싱 전문가", career: "광저우·이우 현지 10년", rating: 4.8, reviews: 241, courses: 3 },
  { gradient: "from-amber-500 to-amber-400", name: "정우석", role: "물류·포워딩 전문가", career: "전 글로비스 포워딩팀", rating: 4.8, reviews: 156, courses: 2 },
];

// ─── 후기 ────────────────────────────────────
const REVIEWS = [
  { initial: "오", gradient: "from-blue-500 to-blue-400", text: "무역 완전 초보였는데 A to Z 강의 하나로 실제 수입 첫 오더까지 성공했어요. 강의가 현실적이고 바로 써먹을 수 있어요.", name: "오지은", course: "수입 비즈니스 완전 정복", rating: 5 },
  { initial: "한", gradient: "from-violet-500 to-violet-400", text: "관세 환급 제도를 몰랐는데 이정민 관세사님 강의 덕분에 연간 800만원 절감했어요. 수강료 몇 배 가치가 있습니다.", name: "한동훈", course: "통관·관세 실무 과정", rating: 5 },
  { initial: "강", gradient: "from-emerald-500 to-emerald-400", text: "협상 스크립트가 압권이었어요. 실제 협상에서 바로 쓰고 단가를 30% 낮췄습니다. 박소연 강사님 최고예요.", name: "강나연", course: "중국 소싱 전략", rating: 5 },
  { initial: "서", gradient: "from-amber-500 to-amber-400", text: "수입 물류 개념이 이렇게 쉬운 거였나요? 복잡하다고 생각했는데 정우석 강사님 설명 들으니 바로 이해됐어요.", name: "서민호", course: "물류·포워딩 실무", rating: 5 },
];

const levelColor: Record<string, string> = {
  입문: "text-green-700 bg-green-50",
  중급: "text-blue-700 bg-blue-50",
  고급: "text-orange-700 bg-orange-50",
};

interface CourseItem {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  instructor: string;
  totalDuration: string;
  thumbnail: string;
  badge: string;
  price: string;
  free: boolean;
  students: string;
}

export default function Home({ courses }: { courses: CourseItem[] }) {
  const [activeCategory, setActiveCategory] = useState("전체");

  const filteredCourses =
    activeCategory === "전체" ? courses
    : activeCategory === "LIVE" ? courses.filter((c) => c.badge === "LIVE")
    : courses.filter((c) => c.category === activeCategory);

  return (
    <div className="bg-background text-foreground">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* 텍스트 */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              >
                <Badge variant="outline" className="text-primary border-primary/40 mb-5 gap-1.5">
                  <Ship size={12} /> 수입 운송 전문 교육 No.1
                </Badge>
              </motion.div>
              <motion.h1
                className="text-4xl md:text-5xl font-black leading-[1.2] mb-5 tracking-tight"
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              >
                수입 비즈니스,<br />
                <span className="text-primary">전문가에게 배우면</span><br />
                달라집니다
              </motion.h1>
              <motion.p
                className="text-muted-foreground text-lg leading-relaxed mb-8"
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              >
                FOB부터 통관, 물류 협상까지.<br />
                현직 실무자가 직접 가르치는 수입 운송 커리큘럼.
              </motion.p>
              <motion.div
                className="flex gap-3 flex-wrap"
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button size="lg" className="gap-2 rounded-full px-7" asChild>
                  <Link href="/courses">
                    <GraduationCap size={16} /> 강의 보러가기
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 rounded-full px-7" asChild>
                  <Link href="/offline">
                    오프라인 강의 보기
                  </Link>
                </Button>
              </motion.div>

              {/* 빠른 통계 */}
              <motion.div
                className="flex gap-8 mt-10 pt-8 border-t border-border"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
              >
                {[
                  { num: "2,400+", label: "수강생" },
                  { num: "4.9★", label: "평균 평점" },
                  { num: "48개", label: "커리큘럼" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-black text-primary">{s.num}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* 오른쪽: 인기 강의 미리보기 카드 */}
            <motion.div
              className="hidden md:block"
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative">
                {/* 뒤 카드 */}
                <div className="absolute top-4 left-4 right-4 h-full bg-muted/60 rounded-2xl border border-border" />
                {/* 앞 카드 */}
                <Card className="relative shadow-lg overflow-hidden">
                  <div className={`h-36 bg-gradient-to-br ${courses[0].thumbnail}`} />
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelColor[courses[0].level]}`}>{courses[0].level}</span>
                      <Badge variant="secondary" className="text-xs">인기 1위</Badge>
                    </div>
                    <p className="font-bold text-sm leading-snug mb-3">{courses[0].title}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Star size={11} className="text-yellow-500 fill-yellow-500" /> 4.9 · {courses[0].students}</span>
                      <span className="font-bold text-primary text-base">{courses[0].price}</span>
                    </div>
                  </CardContent>
                </Card>
                {/* 플로팅 배지 */}
                <div className="absolute -bottom-3 -right-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  🎉 무료 강의 포함
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 카테고리 네비 ───────────────────────────────── */}
      <section className="border-b border-border bg-background sticky top-[79px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-2">
            {CATEGORIES.map(({ label, icon: Icon, id }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                  activeCategory === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={14} />
                {label === "LIVE" ? "🔴 LIVE" : label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 강의 목록 ───────────────────────────────────── */}
      <section className="py-14 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h2 className="text-xl font-black">
                {activeCategory === "전체" ? "전체 강의" : activeCategory === "LIVE" ? "🔴 LIVE 강의" : `${activeCategory} 강의`}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">{filteredCourses.length}개 강의</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-primary" asChild>
              <Link href="/courses">전체보기 <ChevronRight size={14} /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
              >
                <Link href={`/courses/${course.id}`}>
                  <Card className="overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 gap-0 py-0 h-full">
                    {/* 썸네일 */}
                    <div className={`h-36 bg-gradient-to-br ${course.thumbnail} relative`}>
                      <span className={`absolute top-3 left-3 text-[11px] font-bold px-2 py-0.5 rounded text-white ${course.badge === "LIVE" ? "bg-red-500" : "bg-black/40"}`}>
                        {course.badge === "LIVE" ? "🔴 LIVE" : "VOD"}
                      </span>
                      {course.free && (
                        <span className="absolute top-3 right-3 text-[11px] font-bold px-2 py-0.5 rounded bg-primary text-primary-foreground">FREE</span>
                      )}
                    </div>

                    <CardContent className="p-4">
                      {/* 카테고리 + 레벨 */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-xs text-muted-foreground">{course.category}</span>
                        <span className="text-muted-foreground/40 text-xs">·</span>
                        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${levelColor[course.level]}`}>{course.level}</span>
                      </div>

                      {/* 제목 */}
                      <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-2">{course.title}</h3>

                      {/* 강사 */}
                      <p className="text-xs text-muted-foreground mb-2">{course.instructor} 강사</p>

                      {/* 별점 */}
                      <div className="flex items-center gap-1 mb-3">
                        <Star size={11} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-yellow-600">4.9</span>
                        <span className="text-xs text-muted-foreground">({course.students})</span>
                      </div>

                      <Separator className="mb-3" />

                      {/* 가격 + 메타 */}
                      <div className="flex items-center justify-between">
                        <span className={`font-black text-base ${course.free ? "text-primary" : "text-foreground"}`}>
                          {course.price}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock size={11} />
                          {course.totalDuration}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 숫자로 보는 셀러노트 ────────────────────────── */}
      <section className="bg-primary py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-primary-foreground">
            {[
              { icon: Users, num: "15,000+", label: "누적 수강생" },
              { icon: BarChart2, num: "2,300+", label: "무역 창업 성공" },
              { icon: Star, num: "98%", label: "수강생 만족도" },
              { icon: BookOpen, num: "50+", label: "실무 강의 콘텐츠" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <s.icon size={22} className="mx-auto mb-2 opacity-80" />
                <p className="text-3xl font-black mb-1">{s.num}</p>
                <p className="text-sm text-primary-foreground/70">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 강사 소개 ────────────────────────────────────── */}
      <section className="py-14 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-primary text-sm font-semibold mb-1">셀러노트 인증 전문가</p>
              <h2 className="text-xl font-black">현직 전문가가 직접 가르칩니다</h2>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-primary" asChild>
              <Link href="/courses">강의 보기 <ChevronRight size={14} /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INSTRUCTORS.map((inst, i) => (
              <motion.div
                key={inst.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
              >
                <Card className="p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-br ${inst.gradient} flex items-center justify-center text-white text-xl font-black mb-3`}>
                    {inst.name[0]}
                  </div>
                  <p className="font-bold text-sm">{inst.name}</p>
                  <p className="text-xs text-primary font-semibold mb-1">{inst.role}</p>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{inst.career}</p>
                  <Separator className="mb-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <Star size={10} className="text-yellow-500 fill-yellow-500" /> {inst.rating}
                    </span>
                    <span>강의 {inst.courses}개</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 수강생 후기 ──────────────────────────────────── */}
      <section className="py-14 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-primary text-sm font-semibold mb-1">수강생 후기</p>
            <h2 className="text-xl font-black">직접 수강한 분들의 이야기</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REVIEWS.map((rev, i) => (
              <motion.div
                key={rev.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
              >
                <Card className="p-5 h-full flex flex-col hover:shadow-md transition-shadow">
                  {/* 별점 */}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: rev.rating }).map((_, j) => (
                      <Star key={j} size={13} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{rev.text}</p>
                  <Separator className="mb-3" />
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${rev.gradient} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {rev.initial}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{rev.name}</p>
                      <p className="text-xs text-muted-foreground">{rev.course}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 블로그 / 자료실 ──────────────────────────────── */}
      <section className="py-14 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-primary text-sm font-semibold mb-1">자료실 & 블로그</p>
              <h2 className="text-xl font-black">실무에 바로 쓰는 무역 지식</h2>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              전체보기 <ChevronRight size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BLOGS.map((blog, i) => (
              <motion.div
                key={blog.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
              >
                <Card className="p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">{blog.category}</Badge>
                  </div>
                  <h3 className="font-bold text-sm leading-snug flex-1 mb-4">{blog.title}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{blog.date}</span>
                    <span>읽기 {blog.readTime}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA 배너 ─────────────────────────────────────── */}
      <section className="py-14 bg-background border-t border-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="text-primary border-primary/40 mb-5">오늘 가입하면 무료 강의 제공</Badge>
            <h2 className="text-3xl font-black mb-4 tracking-tight">
              수입 비즈니스의 첫 걸음,<br />셀러노트와 함께 시작하세요
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              현직 전문가의 강의로 시행착오를 줄이고<br />
              더 빠르게 수입 비즈니스를 성장시키세요.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button size="lg" className="rounded-full px-8 gap-2" asChild>
                <Link href="/register">
                  무료로 시작하기 <ArrowRight size={15} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                <Link href="/courses">강의 둘러보기</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-muted/40 border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
            <div>
              <p className="font-black text-lg mb-2">Sellernote</p>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                수입무역 교육 · 물류 · SaaS 생태계.<br />
                무역을 쉽게 만드는 사람들.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-12 gap-y-6 text-sm">
              <div className="space-y-2">
                <p className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-3">강의</p>
                <Link href="/courses" className="block text-muted-foreground hover:text-foreground transition-colors">온라인 강의</Link>
                <Link href="/offline" className="block text-muted-foreground hover:text-foreground transition-colors">오프라인 강의</Link>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-3">회사</p>
                <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors">회사소개</Link>
                <Link href="/inquiry" className="block text-muted-foreground hover:text-foreground transition-colors">문의하기</Link>
                <a href="mailto:api@seller-note.com" className="block text-muted-foreground hover:text-foreground transition-colors">API 문의</a>
              </div>
            </div>
          </div>
          <Separator className="mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
            <p>© 2025 주식회사 셀러노트. All rights reserved.</p>
            <p>api@seller-note.com</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
