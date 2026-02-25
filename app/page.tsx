"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Ship, Package, FileText, Globe, ShieldCheck, Handshake,
  BookOpen, TrendingUp, Leaf, ShoppingCart, Scale, Lightbulb,
  MessageCircle, Calendar, MapPin, Star, Users,
  GraduationCap, Award, Clock, ArrowRight,
} from "lucide-react";
import { courses } from "@/app/data/courses";

const COURSE_ICONS = [Ship, Package, ShieldCheck, Handshake, FileText, Globe];
const ICON_MAP = Object.fromEntries(courses.map((c, i) => [c.id, COURSE_ICONS[i] ?? Ship]));

const FILTERS = ["전체", "입문", "무역 실무", "물류·운송", "통관·관세", "LIVE"];

const levelBadge: Record<string, string> = {
  입문: "badge-success",
  중급: "badge-warning",
  고급: "badge-error",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

// ─── Data ────────────────────────────────────────────────────

const BLOGS = [
  { icon: TrendingUp, bg: "bg-primary/8", color: "text-primary", category: "무역 동향", title: "2025년 해상 운임 동향과 수입업체 대응 전략", desc: "BDI 지수 변화와 컨테이너 운임 급등락의 원인을 분석하고 효과적인 대응 방법을 알아봅니다.", date: "2025.01.15" },
  { icon: FileText, bg: "bg-secondary/8", color: "text-secondary", category: "무역 서류", title: "Letter of Credit 개설부터 네고까지 완벽 가이드", desc: "초보 수입업자가 가장 헷갈려하는 L/C 프로세스를 단계별로 쉽게 설명합니다.", date: "2025.01.08" },
  { icon: Leaf, bg: "bg-success/10", color: "text-success", category: "통관·관세", title: "FTA 원산지 증명서 활용으로 관세 절감하는 법", desc: "한-미, 한-EU FTA 협정세율을 제대로 활용해 수입 비용을 줄이는 실전 방법을 공유합니다.", date: "2024.12.28" },
  { icon: ShoppingCart, bg: "bg-warning/10", color: "text-warning", category: "소싱 전략", title: "알리바바 소싱 시 절대 하지 말아야 할 실수 10가지", desc: "수천 명의 수강생 사례를 통해 정리한 알리바바 소싱 실패 패턴과 예방법을 공개합니다.", date: "2024.12.20" },
  { icon: Scale, bg: "bg-error/10", color: "text-error", category: "법규·규정", title: "수입 금지·제한 품목 완벽 정리 (2025년 최신판)", desc: "KC 인증, 식품검역, 전파법 등 국내 반입 시 주의해야 할 규정들을 품목별로 정리했습니다.", date: "2024.12.10" },
  { icon: Lightbulb, bg: "bg-info/10", color: "text-info", category: "실전 사례", title: "월 매출 3억 달성한 수입업체의 물류 시스템 공개", desc: "셀러노트 수강 후 성공한 실제 창업자의 인터뷰와 핵심 물류 운영 노하우를 담았습니다.", date: "2024.12.03" },
];

const QAS = [
  {
    initial: "김", gradient: "from-blue-600 to-blue-400",
    name: "김민준", time: "2시간 전",
    question: "중국 공장에서 EXW로 오퍼받았는데 FOB로 전환하는 게 나을까요?",
    answer: "물량 규모와 포워더 협상력에 따라 다릅니다. 초기에는 FOB가 관리 편의상 유리하지만, 물량이 쌓이면 EXW + 고정 포워더 조합이 비용 절감에 효과적입니다.",
    tags: ["인코텀즈", "중국소싱", "물류비용"],
  },
  {
    initial: "이", gradient: "from-violet-600 to-violet-400",
    name: "이수진", time: "5시간 전",
    question: "B/L 발행 후 선적 취소가 가능한가요? 페널티는 얼마나 되나요?",
    answer: "B/L 발행 전 취소는 비교적 쉽지만 이후에는 복잡합니다. 선사마다 다르지만 통상 운임의 20~50% 취소 수수료가 발생합니다.",
    tags: ["B/L", "선적취소", "수수료"],
  },
  {
    initial: "박", gradient: "from-emerald-600 to-emerald-400",
    name: "박지훈", time: "어제",
    question: "KC 인증 없이 소량 수입하면 통관 거절되나요?",
    answer: "품목에 따라 다릅니다. 개인 사용 목적의 소량은 통관 가능하나, 판매 목적이라면 KC 인증은 필수입니다. 전기용품은 특히 엄격히 관리됩니다.",
    tags: ["KC인증", "통관", "규정"],
  },
  {
    initial: "최", gradient: "from-amber-500 to-amber-400",
    name: "최예린", time: "어제",
    question: "LCL과 FCL 중 어떤 기준으로 선택해야 하나요?",
    answer: "일반적으로 CBM 15~18 이상이면 FCL이 유리합니다. LCL은 혼재 비용과 리드타임 증가를 감안해야 합니다.",
    tags: ["LCL", "FCL", "해상운송"],
  },
];

const SCHEDULES = [
  {
    gradient: "from-primary to-blue-500",
    date: "2025년 2월 15일 (토) 10:00~18:00",
    title: "수입 창업 1일 집중 부트캠프",
    location: "서울 강남구 역삼동 셀러노트 교육센터",
    instructor: "김태호 강사 외 3인",
    price: "1인 298,000원 (점심·교재 포함)",
    seats: 8, total: 30, pct: 73,
  },
  {
    gradient: "from-secondary to-violet-500",
    date: "2025년 3월 8일 (토) 13:00~17:00",
    title: "통관·관세 실무 워크숍",
    location: "서울 마포구 홍대 교육장",
    instructor: "이정민 관세사",
    price: "1인 148,000원",
    seats: 18, total: 25, pct: 28,
  },
  {
    gradient: "from-indigo-600 to-indigo-500",
    date: "2025년 3월 22일 (토) 10:00~17:00",
    title: "중국 소싱 & 협상 마스터클래스",
    location: "경기도 성남시 판교 테크노밸리",
    instructor: "박소연 소싱 전문가",
    price: "1인 248,000원 (교재 포함)",
    seats: 22, total: 35, pct: 37,
  },
];

const INSTRUCTORS = [
  { gradient: "from-primary to-blue-400", name: "김태호", role: "수입 무역 전문가", desc: "15년간 수입 무역 실무 경력. 전 삼성물산 무역팀장. 연간 수입 규모 500억 경험 보유." },
  { gradient: "from-secondary to-violet-400", name: "이정민", role: "관세사", desc: "공인 관세사 10년 경력. 연간 3,000건 이상 통관 처리. FTA 세율 절감 전문." },
  { gradient: "from-emerald-600 to-emerald-400", name: "박소연", role: "중국 소싱 전문가", desc: "광저우·이우 현지 10년 거주. 500개 이상 공장 직접 방문 및 협상 경험 보유." },
  { gradient: "from-amber-500 to-amber-300", name: "정우석", role: "물류·포워딩 전문가", desc: "전 글로비스 포워딩팀. 해상·항공·육상 통합 물류 전문. 운임 협상 노하우 강의." },
];

const REVIEWS = [
  { initial: "오", gradient: "from-primary to-blue-400", text: "무역에 완전 초보였는데 A to Z 강의 하나로 실제 수입 첫 오더까지 성공했어요. 강의 내용이 현실적이고 바로 써먹을 수 있어서 너무 좋았습니다!", name: "오지은", course: "수입 비즈니스 완전 정복 수강" },
  { initial: "한", gradient: "from-secondary to-violet-400", text: "관세 환급 제도를 몰랐는데 이정민 관세사님 강의 덕분에 연간 800만원 절감했습니다. 수강료 몇 배 이상의 가치가 있는 강의예요.", name: "한동훈", course: "통관·관세 실무 과정 수강" },
  { initial: "강", gradient: "from-emerald-600 to-emerald-400", text: "오프라인 부트캠프에서 만난 수강생들과 공동구매 그룹까지 만들었어요. 강의 내용도 좋지만 네트워킹 효과가 정말 큽니다!", name: "강나연", course: "수입 창업 집중 부트캠프 참가" },
  { initial: "서", gradient: "from-amber-500 to-amber-300", text: "중국 소싱 강의에서 배운 협상 전략으로 단가를 30% 낮췄어요. 박소연 강사님이 실제 협상 스크립트까지 주셔서 완전 실용적이었어요.", name: "서민호", course: "중국 소싱 전략 수강" },
  { initial: "임", gradient: "from-error to-rose-400", text: "라이브 강의가 정말 좋아요. 질문하면 바로 답변해주시고, 사례도 풍부해서 지루할 틈이 없어요. VOD와 병행해서 쓰면 완벽합니다.", name: "임재원", course: "FOB·CIF 인코텀즈 LIVE 수강" },
  { initial: "윤", gradient: "from-indigo-600 to-indigo-400", text: "커뮤니티 Q&A가 진짜 보물이에요. 강사님들이 직접 답변해 주시고, 다른 수강생들의 경험도 엄청난 공부가 됩니다. 적극 추천해요!", name: "윤서현", course: "무역 서류 완벽 이해 수강" },
];

// ─── Component ────────────────────────────────────────────────

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("전체");

  const filteredCourses =
    activeFilter === "전체" ? courses
    : activeFilter === "LIVE" ? courses.filter((c) => c.badge === "LIVE")
    : courses.filter((c) => c.category === activeFilter);

  return (
    <div className="bg-base-100">

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center overflow-hidden bg-gradient-to-b from-primary/5 via-base-100 to-base-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-28">
          <motion.div
            className="badge badge-primary badge-outline gap-1.5 mb-6 py-3 px-4 text-sm"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          >
            <Ship size={13} /> 수입 운송 전문 No.1 플랫폼
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.15] mb-5"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          >
            수입 운송, 이제<br />
            <span className="text-primary">셀러노트</span>로 시작하세요
          </motion.h1>

          <motion.p
            className="text-base-content/60 text-lg leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          >
            FOB부터 통관, 물류 협상까지 — 수입 비즈니스의 모든 것을<br className="hidden sm:block" />
            온·오프라인 전문 강의로 배워보세요.
          </motion.p>

          <motion.div
            className="flex gap-3 justify-center flex-wrap"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/courses" className="btn btn-primary btn-lg rounded-full shadow-lg shadow-primary/20 gap-2">
              <GraduationCap size={16} /> 무료 강의 보기
            </Link>
            <a href="#offline" className="btn btn-outline btn-primary btn-lg rounded-full gap-2">
              <Calendar size={16} /> 오프라인 일정
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex gap-10 justify-center flex-wrap mt-14 pt-10 border-t border-base-200"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
          >
            {[
              { num: "2,400+", label: "수강생" },
              { num: "48개", label: "강의 커리큘럼" },
              { num: "4.9★", label: "평균 만족도" },
              { num: "12명", label: "전문 강사진" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-primary">{s.num}</div>
                <div className="text-xs text-base-content/40 mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Courses ── */}
      <section id="courses" className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-8">
            <div className="badge badge-primary badge-outline gap-1 mb-3 py-2.5 px-3">
              <BookOpen size={11} /> 강의 목록
            </div>
            <h2 className="text-3xl font-black mb-2">수입 운송의 모든 과정을<br />체계적으로 배운다</h2>
            <p className="text-base-content/60 mb-6">VOD 강의와 실시간 라이브로 언제 어디서나 학습하세요</p>

            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`btn btn-sm rounded-full ${
                    activeFilter === f ? "btn-primary" : "btn-ghost bg-base-100 border border-base-300"
                  }`}
                >
                  {f === "LIVE" ? "🔴 LIVE" : f}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course, i) => {
              const Icon = ICON_MAP[course.id] ?? Ship;
              return (
                <motion.div key={course.id} {...fadeUp(i * 0.07)}>
                  <Link href={`/courses/${course.id}`} className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md hover:-translate-y-1 transition-all h-full flex flex-col group overflow-hidden">
                    <figure className={`h-40 bg-gradient-to-br ${course.thumbnail} relative overflow-hidden`}>
                      <Icon size={52} className="text-white/20 absolute inset-0 m-auto" />
                      <span className={`badge absolute top-3 left-3 border-0 font-bold text-white ${course.badge === "LIVE" ? "bg-error" : "bg-black/30"}`}>
                        {course.badge === "LIVE" ? "🔴 LIVE" : "VOD"}
                      </span>
                    </figure>
                    <div className="card-body p-5 flex-1">
                      <div className={`badge badge-sm ${levelBadge[course.level] ?? "badge-ghost"}`}>{course.level}</div>
                      <h3 className="card-title text-sm leading-snug">{course.title}</h3>
                      <div className="flex gap-4 text-xs text-base-content/50">
                        <span className="flex items-center gap-1"><Clock size={11} /> {course.totalDuration}</span>
                        <span className="flex items-center gap-1"><Users size={11} /> {course.students}</span>
                      </div>
                      <div className="card-actions justify-between items-center mt-1">
                        <span className={`text-lg font-black ${course.free ? "text-primary" : ""}`}>{course.price}</span>
                        <span className="btn btn-primary btn-xs rounded-full">자세히 보기</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Blog ── */}
      <section id="blog" className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-8">
            <div className="badge badge-primary badge-outline gap-1 mb-3 py-2.5 px-3">
              <BookOpen size={11} /> 자료실 &amp; 블로그
            </div>
            <h2 className="text-3xl font-black mb-2">실무에 바로 쓰는<br />수입 운송 지식</h2>
            <p className="text-base-content/60">최신 무역 동향과 실전 노하우를 무료로 확인하세요</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BLOGS.map((blog, i) => (
              <motion.div key={blog.title} {...fadeUp(i * 0.07)}>
                <div className="card bg-base-100 border border-base-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-1 transition-all h-full cursor-pointer">
                  <div className="card-body gap-3">
                    <div className={`w-11 h-11 ${blog.bg} rounded-xl flex items-center justify-center shrink-0`}>
                      <blog.icon size={20} className={blog.color} />
                    </div>
                    <div className={`badge badge-sm badge-ghost border-0 ${blog.bg} ${blog.color} self-start`}>{blog.category}</div>
                    <h3 className="card-title text-sm leading-snug">{blog.title}</h3>
                    <p className="text-base-content/60 text-xs leading-relaxed flex-1">{blog.desc}</p>
                    <p className="text-base-content/30 text-xs">{blog.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Community ── */}
      <section id="community" className="py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-8">
            <div className="badge badge-primary badge-outline gap-1 mb-3 py-2.5 px-3">
              <MessageCircle size={11} /> 커뮤니티
            </div>
            <h2 className="text-3xl font-black mb-2">함께 성장하는<br />셀러노트 커뮤니티</h2>
            <p className="text-base-content/60">수강생 간 Q&A와 네트워킹으로 실력을 키우세요</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {QAS.map((qa, i) => (
              <motion.div key={qa.name} {...fadeUp(i * 0.07)}>
                <div className="card bg-base-100 shadow-sm border border-base-200">
                  <div className="card-body gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`avatar placeholder`}>
                        <div className={`w-10 rounded-full bg-gradient-to-br ${qa.gradient} text-white`}>
                          <span className="font-bold text-sm">{qa.initial}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-sm">{qa.name}</p>
                        <p className="text-xs text-base-content/40">{qa.time}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm">{qa.question}</p>
                    <div className="divider my-0" />
                    <p className="text-sm text-base-content/70 leading-relaxed">{qa.answer}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {qa.tags.map((tag) => (
                        <span key={tag} className="badge badge-ghost badge-sm">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.2)} className="text-center">
            <Link href="/inquiry" className="btn btn-primary btn-outline rounded-full gap-2">
              <MessageCircle size={15} /> 질문하러 가기
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Offline ── */}
      <section id="offline" className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-8">
            <div className="badge badge-primary badge-outline gap-1 mb-3 py-2.5 px-3">
              <Calendar size={11} /> 오프라인 강의
            </div>
            <h2 className="text-3xl font-black mb-2">직접 만나는<br />집중 오프라인 강의</h2>
            <p className="text-base-content/60">현장 실습과 네트워킹으로 더 빠르게 성장하세요</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {SCHEDULES.map((s, i) => (
              <motion.div key={s.title} {...fadeUp(i * 0.1)}>
                <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all h-full">
                  <div className={`h-2 bg-gradient-to-r ${s.gradient}`} />
                  <div className="card-body gap-3">
                    <p className="text-xs font-bold text-base-content/50 flex items-center gap-1">
                      <Calendar size={11} /> {s.date}
                    </p>
                    <h3 className="card-title text-base">{s.title}</h3>
                    <p className="text-xs text-base-content/60 flex items-center gap-1">
                      <MapPin size={11} className="shrink-0" /> {s.location}
                    </p>
                    <p className="text-xs text-base-content/60">{s.instructor}</p>
                    <div className="divider my-0" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold">{s.price}</span>
                      <span className="badge badge-error badge-sm">{s.total - s.seats}명 마감</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-base-content/50 mb-1">
                        <span>잔여</span>
                        <span>{s.seats}/{s.total}</span>
                      </div>
                      <progress className="progress progress-primary w-full" value={s.pct} max="100" />
                    </div>
                    <button className="btn btn-primary btn-sm btn-block mt-1">신청하기</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instructors ── */}
      <section id="instructors" className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-8">
            <div className="badge badge-primary badge-outline gap-1 mb-3 py-2.5 px-3">
              <GraduationCap size={11} /> 강사진
            </div>
            <h2 className="text-3xl font-black mb-2">업계 최고 전문가들의<br />실전 노하우</h2>
            <p className="text-base-content/60">평균 12년 이상의 현장 경험을 가진 강사진이 직접 가르칩니다</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INSTRUCTORS.map((inst, i) => (
              <motion.div key={inst.name} {...fadeUp(i * 0.08)}>
                <div className="card bg-base-100 border border-base-200 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
                  <div className="card-body items-center text-center gap-3">
                    <div className="avatar placeholder">
                      <div className={`w-20 rounded-full bg-gradient-to-br ${inst.gradient} text-white`}>
                        <span className="text-2xl font-black">{inst.name[0]}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{inst.name}</h3>
                      <span className="badge badge-primary badge-outline badge-sm mt-1">{inst.role}</span>
                    </div>
                    <p className="text-sm text-base-content/60 leading-relaxed">{inst.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section id="reviews" className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-8">
            <div className="badge badge-primary badge-outline gap-1 mb-3 py-2.5 px-3">
              <Star size={11} /> 수강 후기
            </div>
            <h2 className="text-3xl font-black mb-2">수강생들이 직접 쓴<br />솔직한 후기</h2>
            <p className="text-base-content/60">4.9점의 평균 만족도, 2,400명 이상의 수강생이 증명합니다</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {REVIEWS.map((review, i) => (
              <motion.div key={review.name} {...fadeUp(i * 0.07)}>
                <div className="card bg-base-100 border border-base-200 shadow-sm h-full">
                  <div className="card-body gap-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={14} className="text-warning fill-warning" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-base-content/80 flex-1">
                      &ldquo;{review.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t border-base-200">
                      <div className="avatar placeholder">
                        <div className={`w-10 rounded-full bg-gradient-to-br ${review.gradient} text-white`}>
                          <span className="font-bold text-sm">{review.initial}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-sm">{review.name}</p>
                        <p className="text-xs text-base-content/50">{review.course}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-primary">
        <div className="max-w-3xl mx-auto px-4 text-center text-primary-content">
          <motion.div {...fadeUp()}>
            <div className="badge badge-outline border-primary-content/30 text-primary-content/80 mb-6 py-2.5 px-4">
              <Award size={11} className="mr-1" /> 지금 시작하세요
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-snug">
              수입 비즈니스의 첫 걸음,<br />셀러노트와 함께
            </h2>
            <p className="text-primary-content/70 text-lg mb-8">
              무료 강의로 시작해서 실전까지 — 지금 바로 수강을 시작하세요.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/register" className="btn btn-lg bg-white text-primary hover:bg-base-200 rounded-full shadow-lg gap-2 border-0">
                무료로 시작하기 <ArrowRight size={16} />
              </Link>
              <Link href="/courses" className="btn btn-lg btn-outline border-primary-content/30 text-primary-content hover:bg-primary-content/10 rounded-full gap-2">
                강의 목록 보기
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer footer-center bg-base-200 text-base-content/50 p-10 border-t border-base-300">
        <nav className="grid grid-flow-col gap-6 text-sm">
          <Link href="/about" className="link link-hover">회사소개</Link>
          <Link href="/courses" className="link link-hover">강의</Link>
          <Link href="/inquiry" className="link link-hover">문의하기</Link>
        </nav>
        <p className="text-xs">© 2025 Sellernote. 수입 운송 전문 교육 플랫폼</p>
      </footer>
    </div>
  );
}
