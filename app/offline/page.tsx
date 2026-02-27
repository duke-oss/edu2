"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  Calendar, MapPin, GraduationCap, Award, Users,
  Clock, CheckCircle, ArrowRight, Mic, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const SCHEDULES = {
  "2월": [
    {
      id: "boot-0225",
      badge: "마감임박",
      badgeVariant: "destructive" as const,
      gradient: "from-blue-600 to-blue-500",
      title: "수입 창업 1일 집중 부트캠프",
      date: "2025년 2월 15일 (토)",
      time: "10:00 ~ 18:00",
      location: "서울 강남구 역삼동 셀러노트 교육센터",
      instructor: "김태호 강사 외 3인",
      price: "298,000원",
      priceNote: "점심·교재 포함",
      seats: 8,
      total: 30,
      tags: ["수입창업", "실무", "네트워킹"],
      curriculum: [
        "수입무역 프로세스 전체 흐름 이해",
        "소싱 전략 & 공급업체 발굴 실습",
        "인코텀즈 & 무역 서류 작성 실습",
        "통관·관세 기초 & 비용 계산",
        "실전 사례 Q&A + 수강생 네트워킹",
      ],
    },
    {
      id: "customs-0308",
      badge: "신규",
      badgeVariant: "default" as const,
      gradient: "from-violet-600 to-violet-500",
      title: "통관·관세 실무 워크숍",
      date: "2025년 3월 8일 (토)",
      time: "13:00 ~ 17:00",
      location: "서울 마포구 홍대 교육장",
      instructor: "이정민 관세사",
      price: "148,000원",
      priceNote: "",
      seats: 18,
      total: 25,
      tags: ["통관", "관세", "FTA"],
      curriculum: [
        "HS Code 분류 실전 연습",
        "FTA 협정세율 적용 & 원산지 증명",
        "관세 환급 제도 완전 정복",
        "통관 리스크 & 불복 절차",
      ],
    },
  ],
  "3월": [
    {
      id: "sourcing-0322",
      badge: "인기",
      badgeVariant: "secondary" as const,
      gradient: "from-indigo-600 to-indigo-500",
      title: "중국 소싱 & 협상 마스터클래스",
      date: "2025년 3월 22일 (토)",
      time: "10:00 ~ 17:00",
      location: "경기도 성남시 판교 테크노밸리",
      instructor: "박소연 소싱 전문가",
      price: "248,000원",
      priceNote: "교재 포함",
      seats: 22,
      total: 35,
      tags: ["중국소싱", "협상", "알리바바"],
      curriculum: [
        "알리바바·1688 핵심 소싱 전략",
        "공장 선정 기준 & 샘플 검수",
        "협상 스크립트 실전 롤플레이",
        "품질 관리 & MOQ 협상 노하우",
        "현지 에이전트 활용법",
      ],
    },
    {
      id: "logistics-0329",
      badge: "오픈",
      badgeVariant: "outline" as const,
      gradient: "from-emerald-600 to-emerald-500",
      title: "수입 물류·포워딩 실무 과정",
      date: "2025년 3월 29일 (토)",
      time: "10:00 ~ 16:00",
      location: "서울 강남구 역삼동 셀러노트 교육센터",
      instructor: "정우석 물류 전문가",
      price: "198,000원",
      priceNote: "교재 포함",
      seats: 30,
      total: 30,
      tags: ["물류", "포워딩", "해상운송"],
      curriculum: [
        "해상·항공 운송 비교 & 선택 기준",
        "포워더 선정 & 운임 협상 실전",
        "FCL vs LCL 비용 최적화",
        "화물 추적 & 문제 발생 대응",
      ],
    },
  ],
};

const INSTRUCTORS = [
  {
    gradient: "from-blue-600 to-blue-400",
    name: "김태호",
    role: "수입 무역 전문가",
    career: "전 삼성물산 무역팀장",
    courses: ["수입 창업 부트캠프", "수입 비즈니스 완전 정복"],
    rating: 4.9,
    reviews: 312,
  },
  {
    gradient: "from-violet-600 to-violet-400",
    name: "이정민",
    role: "공인 관세사",
    career: "관세사 10년 · 연간 3,000건+ 통관",
    courses: ["통관·관세 실무 워크숍"],
    rating: 4.9,
    reviews: 187,
  },
  {
    gradient: "from-indigo-600 to-indigo-400",
    name: "박소연",
    role: "중국 소싱 전문가",
    career: "광저우·이우 현지 10년 거주",
    courses: ["중국 소싱 & 협상 마스터클래스"],
    rating: 4.8,
    reviews: 241,
  },
  {
    gradient: "from-emerald-600 to-emerald-400",
    name: "정우석",
    role: "물류·포워딩 전문가",
    career: "전 글로비스 포워딩팀",
    courses: ["수입 물류·포워딩 실무 과정"],
    rating: 4.8,
    reviews: 156,
  },
];

const REVIEWS = [
  { initial: "오", gradient: "from-blue-600 to-blue-400", text: "부트캠프 하루 만에 수입 창업의 전 과정을 이해했어요. 실습과 Q&A까지 알차서 수강료가 아깝지 않았습니다.", name: "오지은", course: "수입 창업 부트캠프" },
  { initial: "한", gradient: "from-violet-600 to-violet-400", text: "이정민 관세사님 덕분에 FTA 환급으로 연 800만원 절감했어요. 오프라인에서 직접 질문할 수 있어 훨씬 이해가 빨랐습니다.", name: "한동훈", course: "통관·관세 워크숍" },
  { initial: "강", gradient: "from-indigo-600 to-indigo-400", text: "박소연 강사님의 협상 스크립트 롤플레이가 압권이었어요. 실제 현장에서 바로 써먹었고 단가를 30% 낮췄습니다.", name: "강나연", course: "중국 소싱 마스터클래스" },
];

export default function OfflinePage() {
  const allMonths = Object.keys(SCHEDULES);

  return (
    <div className="bg-background text-foreground">

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-950 via-blue-950 to-gray-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(59,130,246,0.15),transparent)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          >
            <Badge className="mb-5 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
              <Mic size={11} className="mr-1" /> 오프라인 강의
            </Badge>
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl font-black text-white leading-tight mb-5"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          >
            현장에서 배우는<br />
            <span className="text-primary">실전 집중 과정</span>
          </motion.h1>
          <motion.p
            className="text-gray-300 text-lg leading-relaxed mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          >
            강사와 직접 만나 심화 실습과 네트워킹까지.<br />
            온라인으로 해결되지 않는 실전 노하우를 전달합니다.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-6 justify-center text-white/70 text-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
          >
            {[
              { icon: Users, text: "소수 정예 25~35명" },
              { icon: Star, text: "평균 만족도 4.9★" },
              { icon: GraduationCap, text: "현직 전문가 강사진" },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5">
                <Icon size={14} className="text-primary/80" /> {text}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 일정 탭 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div {...fadeUp()} className="mb-8">
          <p className="text-primary font-semibold text-sm mb-1">강의 일정</p>
          <h2 className="text-2xl font-black">월별 오프라인 강의 일정</h2>
        </motion.div>

        <Tabs defaultValue={allMonths[0]}>
          <TabsList className="mb-8">
            {allMonths.map((month) => (
              <TabsTrigger key={month} value={month}>{month}</TabsTrigger>
            ))}
          </TabsList>

          {allMonths.map((month) => (
            <TabsContent key={month} value={month} className="space-y-6">
              {SCHEDULES[month as keyof typeof SCHEDULES].map((s, i) => (
                <motion.div key={s.id} {...fadeUp(i * 0.1)}>
                  <Card className="overflow-hidden gap-0 py-0">
                    {/* 상단 컬러 헤더 */}
                    <div className={`bg-gradient-to-r ${s.gradient} p-6 text-white`}>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-white/70 mb-2">
                            <Calendar size={12} /> {s.date}
                            <span>·</span>
                            <Clock size={12} /> {s.time}
                          </div>
                          <h3 className="text-xl font-black">{s.title}</h3>
                        </div>
                        <Badge
                          variant={s.badgeVariant}
                          className={
                            s.badgeVariant === "outline"
                              ? "border-white/50 text-white bg-white/10"
                              : s.badgeVariant === "secondary"
                              ? "bg-white/20 text-white hover:bg-white/30 border-0"
                              : ""
                          }
                        >
                          {s.badge}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* 왼쪽: 강의 정보 */}
                        <div className="space-y-4">
                          <div className="space-y-2.5 text-sm text-muted-foreground">
                            <div className="flex items-start gap-2">
                              <MapPin size={14} className="shrink-0 mt-0.5 text-primary" />
                              {s.location}
                            </div>
                            <div className="flex items-start gap-2">
                              <GraduationCap size={14} className="shrink-0 mt-0.5 text-primary" />
                              {s.instructor}
                            </div>
                            <div className="flex items-start gap-2">
                              <Award size={14} className="shrink-0 mt-0.5 text-primary" />
                              <span>
                                <span className="text-foreground font-semibold">{s.price}</span>
                                {s.priceNote && <span className="text-muted-foreground"> ({s.priceNote})</span>}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-1.5 flex-wrap mt-2">
                            {s.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                          </div>

                          <Separator />

                          {/* 잔여 좌석 */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>잔여 좌석</span>
                              <span className="font-semibold text-foreground">{s.seats} / {s.total}석</span>
                            </div>
                            <Progress value={Math.round((1 - s.seats / s.total) * 100)} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              {s.seats <= 5
                                ? <span className="text-destructive font-semibold">마감 임박! 잔여 {s.seats}석</span>
                                : `${s.total - s.seats}명 신청 완료`}
                            </p>
                          </div>

                          <Button className="w-full">
                            신청하기 <ArrowRight size={14} />
                          </Button>
                        </div>

                        {/* 오른쪽: 커리큘럼 */}
                        <div>
                          <p className="text-sm font-bold mb-3">강의 커리큘럼</p>
                          <ul className="space-y-2">
                            {s.curriculum.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle size={14} className="text-primary shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* 강사진 */}
      <section className="bg-muted/40 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-8">
            <p className="text-primary font-semibold text-sm mb-1">강사 소개</p>
            <h2 className="text-2xl font-black">현직 전문가가 직접 가르칩니다</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INSTRUCTORS.map((inst, i) => (
              <motion.div key={inst.name} {...fadeUp(i * 0.08)}>
                <Card className="p-5 text-center hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${inst.gradient} flex items-center justify-center text-white text-xl font-black mb-3`}>
                    {inst.name[0]}
                  </div>
                  <p className="font-black text-base">{inst.name}</p>
                  <p className="text-xs text-primary font-semibold mb-1">{inst.role}</p>
                  <p className="text-xs text-muted-foreground mb-3">{inst.career}</p>
                  <Separator className="mb-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <Star size={11} className="text-yellow-500 fill-yellow-500" /> {inst.rating}
                    </span>
                    <span>수강 후기 {inst.reviews}개</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 수강 후기 */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-8">
            <p className="text-primary font-semibold text-sm mb-1">수강 후기</p>
            <h2 className="text-2xl font-black">직접 참여한 수강생의 이야기</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {REVIEWS.map((rev, i) => (
              <motion.div key={rev.name} {...fadeUp(i * 0.08)}>
                <Card className="p-5 h-full flex flex-col">
                  <div className="text-yellow-500 text-sm mb-3">★★★★★</div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{rev.text}</p>
                  <Separator className="my-4" />
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

      {/* CTA */}
      <section className="py-16 bg-muted/40">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-2xl font-black mb-3">지금 바로 신청하세요</h2>
            <p className="text-muted-foreground mb-6">
              소수 정예로 운영되어 자리가 빠르게 마감됩니다.<br />
              문의사항은 아래 채널로 연락해 주세요.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button size="lg" className="rounded-full gap-2" asChild>
                <Link href="#schedule">
                  <Calendar size={15} /> 일정 확인하기
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full gap-2" asChild>
                <Link href="/inquiry/new">
                  문의하기 <ArrowRight size={15} />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
