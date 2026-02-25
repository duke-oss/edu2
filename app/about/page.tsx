"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  BookOpen, TrendingUp, Star, Package,
  FileText, AlertTriangle, DollarSign,
  GraduationCap, Ship, LayoutGrid,
  Target, Layers, User,
  Code, Zap, Mail,
  ArrowRight, CheckCircle,
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, delay },
});

const JOURNEY = [
  { date: "2018.03", title: "셀러노트 시작", desc: "1인 수입무역 창업자를 위한 교육 콘텐츠 제작 시작" },
  { date: "2019.06", title: "첫 오프라인 강의 개설", desc: "수입무역 입문 과정 첫 기수 모집, 30명 수료" },
  { date: "2020.01", title: "법인 설립", desc: "주식회사 셀러노트 공식 법인 설립" },
  { date: "2020.08", title: "온라인 플랫폼 런칭", desc: "코로나19 대응, 수입무역 교육 온라인 플랫폼 오픈" },
  { date: "2021.04", title: "누적 수강생 1,000명 돌파", desc: "수입무역 교육 수요 급증, 커리큘럼 확대" },
  { date: "2022.02", title: "쉽다(ShipDa) 런칭", desc: "수입무역 물류 디지털 포워딩 서비스 출시" },
  { date: "2022.11", title: "시드 투자 유치", desc: "시드 라운드 투자 유치, 서비스 고도화 착수" },
  { date: "2023.05", title: "위딜라이즈(WeDealize) 출시", desc: "수입무역 발주/주문 관리 SaaS, 생태계 완성" },
  { date: "2024.03", title: "누적 수강생 10,000명 돌파", desc: "수입무역 교육 분야 국내 1위 달성" },
  { date: "2024.12", title: "Open API 서비스 출시", desc: "수입무역 서류 파서, 워크플로우 자동화 API 공개" },
];

export default function AboutPage() {
  return (
    <div className="bg-base-100">

      {/* ── Hero ── */}
      <section className="relative min-h-[88vh] flex items-center bg-gradient-to-br from-gray-950 via-blue-950 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.18),transparent)]" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <motion.p
            className="text-primary/80 text-sm font-semibold tracking-widest uppercase mb-6"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          >
            Sellernote
          </motion.p>
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-8 max-w-3xl"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          >
            무역을<br />쉽게 만들고<br />
            <span className="text-primary">있습니다</span>
          </motion.h1>
          <motion.p
            className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mb-12"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          >
            복잡하고, 어렵고, 멀게 느껴지던 무역의 장벽을 허물어<br className="hidden md:block" />
            누구나 무역에 도전할 수 있는 세상을 만듭니다.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/register" className="btn btn-primary btn-lg rounded-full gap-2 shadow-lg shadow-primary/20">
              무료로 시작하기 <ArrowRight size={16} />
            </Link>
            <Link href="/courses" className="btn btn-lg rounded-full border border-white/20 text-white bg-transparent hover:bg-white/10 gap-2">
              강의 둘러보기
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, value: "15,000+", label: "누적 수강생" },
              { icon: TrendingUp, value: "2,300+", label: "무역 창업 성공" },
              { icon: Star, value: "98%", label: "수강생 만족도" },
              { icon: Package, value: "50+", label: "실무 강의 콘텐츠" },
            ].map((s, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)} className="text-center text-primary-content">
                <s.icon size={24} className="mx-auto mb-3 opacity-70" />
                <p className="text-3xl md:text-4xl font-bold mb-1">{s.value}</p>
                <p className="text-primary-content/70 text-sm">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="py-24 bg-base-100" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-16">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">Who We Are</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-2xl">
              우리는 무역의 문턱을<br />낮추는 사람들입니다
            </h2>
            <p className="text-base-content/60 text-lg max-w-2xl leading-relaxed">
              왜 수입무역에 집중할까요? 수출 시장은 대기업 중심입니다.<br />
              삼성, LG, 현대 같은 대기업들이 이미 탄탄한 인프라와 전문 인력을 갖추고 있죠.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <motion.div {...fadeUp(0.1)} className="card bg-base-200 border border-base-300">
              <div className="card-body">
                <span className="text-xs font-bold text-base-content/40 uppercase tracking-widest mb-2 block">수출 시장 (대기업 중심)</span>
                <ul className="space-y-3">
                  {["체계화된 프로세스", "전문 물류망", "풍부한 자본력으로 이미 효율적인 시스템 구축"].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-base-content/60 text-sm">
                      <CheckCircle size={15} className="text-base-content/30 mt-0.5 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            <motion.div {...fadeUp(0.15)} className="card bg-primary/5 border-2 border-primary/20">
              <div className="card-body">
                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">수입 시장 (초보 사업자 다수)</span>
                <ul className="space-y-3">
                  {["1인 셀러, 스타트업, 소상공인", "정보도 인프라도 부족한 상태에서 홀로 분투"].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-base-content text-sm">
                      <CheckCircle size={15} className="text-primary mt-0.5 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          <motion.p {...fadeUp(0.1)} className="font-bold text-lg mb-6">수입무역 사업자들이 겪는 진짜 페인 포인트</motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: AlertTriangle, title: "정보의 부재", desc: "어디서부터 어떻게 시작해야 할지 막막함" },
              { icon: Ship, title: "물류의 복잡함", desc: "소량 수입, 불투명한 비용, 복잡한 절차" },
              { icon: LayoutGrid, title: "운영의 비효율", desc: "엑셀과 장부, 수기로 재고, 계속되는 실수" },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp(0.1 + i * 0.08)} className="card bg-base-200 border border-base-300">
                <div className="card-body flex-row items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="font-bold mb-1">{item.title}</p>
                    <p className="text-base-content/60 text-sm">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p {...fadeUp(0.2)} className="text-primary font-semibold text-base">
            그래서 우리는 수입무역에 집중합니다. 더 많은 사람들에게, 더 큰 도움이 필요한 곳에.
          </motion.p>
        </div>
      </section>

      {/* ── Value Props ── */}
      <section className="py-24 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {[
              {
                num: "01",
                title: "처음 무역을 시작하는 사람도 3개월 안에 첫 수입을 경험합니다",
                desc: "복잡한 수입 서류, 어려운 관세 용어, 막막한 통관 절차. 우리는 이 모든 것을 체계적인 수입무역 커리큘럼으로 정리했습니다. 수강생의 87%가 교육 수료 후 3개월 내 첫 수입을 시작합니다.",
              },
              {
                num: "02",
                title: "물류비를 평균 23% 절감시켜드립니다",
                desc: "쉽다(ShipDa)를 통해 복잡한 수입 포워딩을 디지털화했습니다. 견적 비교부터 실시간 화물 추적까지, 투명한 프로세스로 불필요한 비용을 줄이고 시간을 절약합니다.",
              },
              {
                num: "03",
                title: "발주 관리 시간을 1/5로 단축합니다",
                desc: "위딜라이즈(WeDealize)는 해외 소싱부터 수입 발주, 재고 관리까지 모든 과정을 하나의 플랫폼에서 해결합니다. 엑셀과 수작업에서 벗어나 본업에 집중하세요.",
              },
            ].map((item, i) => (
              <motion.div
                key={i} {...fadeUp(i * 0.1)}
                className="card bg-base-100 border border-base-300 shadow-sm"
              >
                <div className="card-body flex-row gap-8">
                  <span className="text-5xl font-black text-primary/10 shrink-0 leading-none">{item.num}</span>
                  <div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-base-content/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-16">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">The Problem</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">무역은 왜 어려웠을까요?</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: "복잡한 무역 서류", desc: "인보이스, 패킹리스트, B/L, 원산지증명서... 수십 가지 서류가 머리를 아프게 합니다." },
              { icon: AlertTriangle, title: "무역 용어의 장벽", desc: "FOB, CIF, HS Code, 관세율... 전문 용어의 벽이 무역 진입을 막습니다." },
              { icon: DollarSign, title: "불투명한 무역 비용", desc: "운송비, 관세, 부가세, 창고비... 비용이 어디서 얼마나 나가는지 알 수 없습니다." },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="p-8 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-5">
                  <item.icon size={22} />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p {...fadeUp()} className="text-primary-content/70 text-sm font-semibold mb-4">그래서 우리는 시작했습니다</motion.p>
          <motion.h2 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-black text-primary-content mb-4">
            &ldquo;무역을 쉽게 만든다&rdquo;
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-primary-content/70 text-xl mb-16">이것이 셀러노트의 미션입니다</motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: GraduationCap, title: "쉽게 배우고", desc: "체계적인 교육으로 누구나" },
              { icon: Ship, title: "쉽게 들여오고", desc: "디지털 포워딩으로 간편하게" },
              { icon: LayoutGrid, title: "쉽게 관리한다", desc: "올인원 솔루션으로 효율적으로" },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp(0.2 + i * 0.08)} className="p-8 rounded-2xl bg-primary-content/10 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-primary-content/20 flex items-center justify-center text-primary-content mx-auto mb-4">
                  <item.icon size={22} />
                </div>
                <h3 className="text-primary-content font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-primary-content/70 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Journey ── */}
      <section className="py-24 bg-base-100" id="journey">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-16">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">Our Journey</p>
            <h2 className="text-3xl md:text-4xl font-bold">셀러노트의 발자취</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-[72px] top-0 bottom-0 w-px bg-base-300" />
            <div className="space-y-10">
              {JOURNEY.map((item, i) => (
                <motion.div key={i} {...fadeUp(i * 0.05)} className="flex gap-8">
                  <div className="w-[72px] shrink-0 text-right">
                    <span className="text-xs font-bold text-primary leading-tight block">{item.date}</span>
                  </div>
                  <div className="relative pb-2">
                    <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-base-100 shadow-sm" />
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    <p className="text-base-content/60 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.p {...fadeUp(0.2)} className="mt-14 text-base-content/50 text-sm text-center leading-relaxed">
            셀러노트는 오늘도 무역을 더 쉽게 만들기 위해 한 걸음씩 나아갑니다.<br />
            어제보다 오늘, 오늘보다 내일 더 쉬운 무역을 위해. 그 발자취는 계속됩니다.
          </motion.p>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className="py-24 bg-base-200" id="vision">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-16">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">Our Vision</p>
            <h2 className="text-3xl md:text-4xl font-bold">셀러노트가 만들어갈<br />새로운 무역</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", icon: Target, title: "무역 진입 장벽 제로", desc: "누구나 무역을 시작할 수 있도록 체계적인 교육과 도구를 제공합니다." },
              { num: "02", icon: Layers, title: "수입 원스톱 솔루션", desc: "교육, 운송, 관리까지 하나의 생태계에서 해결합니다." },
              { num: "03", icon: User, title: "1인 무역 셀러의 성장", desc: "개인 셀러도 해외 직수입으로 경쟁력을 가질 수 있도록 지원합니다." },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body">
                  <div className="flex items-start gap-4 mb-2">
                    <span className="text-3xl font-black text-primary/15 leading-none">{item.num}</span>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <item.icon size={18} />
                    </div>
                  </div>
                  <h3 className="card-title text-lg">{item.title}</h3>
                  <p className="text-base-content/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-24 bg-base-100" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-16">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">Our Services</p>
            <h2 className="text-3xl md:text-4xl font-bold">셀러노트 생태계</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: GraduationCap,
                name: "셀러노트",
                tag: "Education",
                desc: "수입무역 & 운송에 대한 실무 중심 강의. 현직 실무자가 전하는 생생한 노하우로 수입 통관, 물류, 정산까지 A to Z를 배웁니다.",
              },
              {
                icon: Ship,
                name: "쉽다 (ShipDa)",
                tag: "Logistics",
                desc: "디지털 포워딩 서비스. 수출입 운송, 외환 송금, 풀필먼트까지 물류의 모든 것을 디지털로 해결합니다.",
              },
              {
                icon: LayoutGrid,
                name: "위딜라이즈 (WeDealize)",
                tag: "SaaS",
                desc: "발주 & 주문 관리 Vertical SaaS. 해외 소싱, 발주 관리, 주문 통합, 재고 및 정산 자동화를 하나의 플랫폼에서.",
              },
            ].map((item, i) => (
              <motion.div
                key={i} {...fadeUp(i * 0.1)}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-lg transition-shadow group"
              >
                <div className="card-body">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary flex items-center justify-center text-primary group-hover:text-primary-content transition-colors mb-2">
                    <item.icon size={26} />
                  </div>
                  <div className="badge badge-primary badge-outline badge-sm self-start">{item.tag}</div>
                  <h3 className="card-title text-xl">{item.name}</h3>
                  <p className="text-base-content/60 text-sm leading-relaxed flex-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── API ── */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-16">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">For Developers</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">무역 데이터 API 프로토콜</h2>
            <p className="text-gray-400 text-lg max-w-xl">
              셀러노트의 무역 기술을 구독형 API로 제공합니다.<br />
              개발자 친화적인 JSON 형태로 무역 업무를 자동화하세요.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {[
              {
                icon: FileText,
                title: "무역서류 파싱 API",
                desc: "인보이스, 패킹리스트, B/L, 원산지증명서 등 각종 무역서류를 개발 가능한 JSON 형태로 자동 변환합니다.",
                tags: [] as string[],
              },
              {
                icon: Zap,
                title: "워크플로우 자동화 API",
                desc: "수입 통관, 발주 관리, 재고 연동 등 무역 업무 프로세스를 API로 자동화하여 시스템에 통합할 수 있습니다.",
                tags: ["통관 자동화", "발주 연동", "재고 동기화", "정산 자동화"],
              },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="p-8 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-5">
                  <item.icon size={22} />
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{item.desc}</p>
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="badge badge-ghost text-primary border-primary/30 badge-sm">{tag}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp(0.2)} className="flex items-center gap-3 text-gray-400 text-sm">
            <Mail size={16} className="text-primary shrink-0" />
            API 도입 문의:&nbsp;
            <a href="mailto:api@seller-note.com" className="link link-primary">
              api@seller-note.com
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-base-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            {...fadeUp()}
            className="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-12 md:p-16 text-primary-content shadow-xl shadow-primary/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                무역, 이제 쉽게 시작하세요
              </h2>
              <p className="text-primary-content/70 text-lg mb-10">
                셀러노트와 함께라면 1인 무역도 충분히 가능합니다.<br />
                현재 수입무역에 특화된 서비스를 제공합니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="btn btn-lg bg-white text-primary hover:bg-base-200 rounded-full shadow-md gap-2 border-0">
                  무료로 시작하기 <ArrowRight size={16} />
                </Link>
                <Link href="/courses" className="btn btn-lg rounded-full border-2 border-primary-content/30 text-primary-content hover:bg-primary-content/10 gap-2">
                  강의 둘러보기
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer bg-gray-950 text-gray-400 p-12 border-t border-white/10">
        <aside>
          <p className="text-white font-bold text-lg mb-2">Sellernote</p>
          <p className="text-sm max-w-xs leading-relaxed">무역을 쉽게 만드는 사람들.<br />수입무역 교육 · 물류 · SaaS 생태계</p>
        </aside>
        <nav>
          <h6 className="footer-title text-gray-500">서비스</h6>
          <a className="link link-hover">셀러노트 강의</a>
          <a className="link link-hover">쉽다 (ShipDa)</a>
          <a className="link link-hover">위딜라이즈 (WeDealize)</a>
        </nav>
        <nav>
          <h6 className="footer-title text-gray-500">회사</h6>
          <Link href="/about" className="link link-hover">회사소개</Link>
          <Link href="/inquiry" className="link link-hover">문의하기</Link>
          <a href="mailto:api@seller-note.com" className="link link-hover">API 문의</a>
        </nav>
      </footer>
      <div className="bg-gray-950 text-gray-600 text-xs text-center py-4 border-t border-white/5">
        © 2025 Sellernote Inc. 모든 권리 보유.
      </div>
    </div>
  );
}
