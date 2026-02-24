"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Rocket,
  Play,
  Truck,
  Globe,
  Handshake,
  Lightbulb,
  ShieldCheck,
  Network,
  FileText,
  Ship,
  ShoppingCart,
  ArrowRight,
  Globe2,
  Share2,
  Mail,
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Rocket size={18} fill="currentColor" />
              </div>
              <span className="font-bold text-xl tracking-tight">Sellernote</span>
            </div>

            <div className="hidden md:flex space-x-10">
              {["회사 소개", "생태계", "통계", "우리의 여정"].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item}
                </a>
              ))}
              <Link
                href="/courses"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                강의
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                로그인
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
              >
                시작하기
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
              <div className="lg:col-span-6 text-center lg:text-left">
                <motion.div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  차세대 무역 플랫폼
                </motion.div>
                <motion.h1
                  className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  글로벌 무역, <br />
                  <span className="text-blue-600">더 쉽고 <br className="lg:hidden" />단순하게.</span>
                </motion.h1>
                <motion.p
                  className="mt-4 text-lg text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  국제 무역의 장벽을 낮추는 스마트 디지털 물류 시스템. 신뢰할 수 있는 인터페이스를 통해 전 세계 시장을 연결합니다.
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    시작하기
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-8 py-3.5 border border-gray-200 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all hover:border-gray-300"
                  >
                    <Play size={18} className="mr-2 text-gray-500 fill-current" />
                    데모 보기
                  </a>
                </motion.div>
              </div>

              <motion.div
                className="lg:col-span-6 mt-16 lg:mt-0 relative"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative rounded-2xl bg-gray-900 shadow-2xl overflow-hidden aspect-[4/3] hover:scale-[1.02] transition-transform duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-64 flex items-end px-8 pb-8 space-x-2 opacity-80">
                    {[40, 60, 45, 70, 50, 85, 60, 95, 75, 110, 85, 120, 95, 140, 110, 160].map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-sm"
                        initial={{ height: 0 }}
                        animate={{ height: `${h}px` }}
                        transition={{ duration: 0.6, delay: 0.4 + i * 0.03 }}
                      />
                    ))}
                  </div>
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <path d="M0,200 Q100,250 200,150 T400,100 T600,200 T800,50 L800,0 L0,0 Z" fill="rgba(255,255,255,0.03)" />
                    <polyline points="0,200 50,220 100,180 150,230 200,160 250,210 300,140 350,240 400,120 450,190 500,150 550,260 600,170 650,210 700,90 750,180 800,50" fill="none" stroke="cyan" strokeWidth="2" className="opacity-70" />
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Truck, label: "수출입 사례", value: "15,000+", trend: "+12% vs last quarter" },
                { icon: Globe, label: "지원 국가", value: "50+", trend: "+5% global expansion" },
                { icon: Handshake, label: "글로벌 파트너", value: "2,500+", trend: "+18% network growth" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.1)}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                    <stat.icon size={20} />
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-3">{stat.value}</p>
                  <p className="text-sm font-medium text-emerald-600">{stat.trend}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="mb-16 max-w-3xl" {...fadeUp()}>
              <h2 className="text-blue-600 font-semibold mb-3">우리의 정체성</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                디지털 우선, 미션 중심의 혁신.
              </h3>
              <p className="text-lg text-gray-600">
                우리의 미션은 전 세계 수출입 업체를 위한 진입 장벽을 낮추는 것입니다. 디지털 혁신과 신뢰할 수 있는 인터페이스를 통해 국제 무역의 미래를 만들어갑니다.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Lightbulb,
                  title: "디지털 혁신",
                  desc: "오래된 서류 작업을 속도와 정확성을 보장하는 스마트하고 자동화된 디지털 워크플로우로 대체합니다.",
                },
                {
                  icon: ShieldCheck,
                  title: "높은 신뢰의 인터페이스",
                  desc: "글로벌 무역 파트너를 위한 안전한 환경을 조성하기 위해 투명성과 검증을 기반으로 구축되었습니다.",
                },
                {
                  icon: Network,
                  title: "원활한 네트워킹",
                  desc: "50개국 이상의 물류 서비스 제공업체와 구매자에게 비즈니스를 직접 연결합니다.",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.1)}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                    <feature.icon size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Ecosystem Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-16" {...fadeUp()}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sellernote 생태계</h2>
              <p className="text-lg text-gray-600">무역의 모든 단계를 지원하는 통합 솔루션.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: FileText,
                  title: "셀러노트 (Sellernote)",
                  desc: "수출입 서류 관리 및 실시간 무역 현황 관리를 위한 전문 디지털 플랫폼입니다.",
                },
                {
                  icon: Ship,
                  title: "쉽다 (Shipda)",
                  desc: "가장 효율적인 경로와 경쟁력 있는 가격을 찾아주는 스마트 물류 운송 및 최적화 서비스입니다.",
                },
                {
                  icon: ShoppingCart,
                  title: "위딜러 (WeDealer)",
                  desc: "신뢰할 수 있는 글로벌 공급업체와 검증된 수입업체를 연결하는 글로벌 B2B 마켓플레이스입니다.",
                },
              ].map((product, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.1)}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow flex flex-col h-full group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <product.icon size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{product.title}</h4>
                  <p className="text-gray-600 leading-relaxed mb-8 flex-grow">{product.desc}</p>
                  <a href="#" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700">
                    자세히 보기 <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <section className="py-24 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div {...fadeUp()}>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  우리의 여정: 무역의 미래를 만듭니다.
                </h2>
                <p className="text-lg text-gray-600 mb-12">
                  2018년부터 우리는 기술을 통해 글로벌 물류를 단순화하겠다는 목표를 끊임없이 추구해 왔습니다.
                </p>
                <div className="w-full aspect-square md:aspect-[4/3] rounded-3xl bg-gradient-to-br from-[#68cbbb] to-[#5ea89e] flex flex-col items-center justify-center text-white p-8 text-center shadow-lg">
                  <div className="space-y-6 md:space-y-8 font-light tracking-[0.3em] md:tracking-[0.5em] text-2xl md:text-4xl opacity-90">
                    <div>COMPANY</div>
                    <div>GROWTH</div>
                    <div>JOURNEY</div>
                  </div>
                </div>
              </motion.div>

              <div className="relative pl-4 md:pl-8">
                <div className="absolute left-[27px] md:left-[43px] top-6 bottom-6 w-0.5 bg-gray-200"></div>
                <div className="space-y-12">
                  {[
                    { year: "2018", title: "2018 창립", desc: "전통적인 국제 무역 프로세스의 디지털 격차를 해소하려는 미션으로 셀러노트가 설립되었습니다." },
                    { year: "2020", title: "2020 쉽다 서비스 런칭", desc: "물류 최적화 분야로 확장하여 기업에 실시간 배송 추적 및 비용 분석 서비스를 제공하기 시작했습니다." },
                    { year: "2021", title: "2021 글로벌 확장", desc: "4개 대륙 50개국 이상의 파트너에게 서비스를 제공하는 주요 이정표를 달성했습니다." },
                    { year: "2023", title: "2023 생태계 완성", desc: "위딜러를 출시하여 서류 작업, 물류, 거래를 아우르는 완전한 SaaS 제품군을 완성했습니다." },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="relative pl-12 md:pl-16"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-100 border-4 border-white shadow-sm flex items-center justify-center z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                      </div>
                      <div className="text-sm font-bold text-blue-600 mb-1">{item.year}</div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="bg-blue-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-xl relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-blue-700 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 !leading-tight">
                  글로벌 무역의 현대화,<br className="hidden md:block" /> 지금 시작할 준비가 되셨나요?
                </h2>
                <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                  셀러노트와 함께 이미 물류를 단순화하고 글로벌 시장을 확장하고 있는 15,000개 이상의 기업과 함께하세요.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a
                    href="#"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-full text-blue-600 bg-white hover:bg-gray-50 shadow-md transition-colors"
                  >
                    지금 시작하기
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center px-8 py-4 border border-blue-400 text-base font-bold rounded-full text-white bg-transparent hover:bg-blue-700 transition-colors"
                  >
                    영업팀 문의
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <Rocket size={18} fill="currentColor" />
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900">Sellernote</span>
              </div>
              <p className="text-gray-500 mb-8 max-w-sm">
                디지털 혁신과 신뢰할 수 있는 물류 솔루션으로 글로벌 무역의 격차를 해소합니다.
              </p>
              <div className="flex items-center space-x-5 text-gray-400">
                <a href="#" className="hover:text-blue-600 transition-colors"><Globe2 size={20} /></a>
                <a href="#" className="hover:text-blue-600 transition-colors"><Share2 size={20} /></a>
                <a href="#" className="hover:text-blue-600 transition-colors"><Mail size={20} /></a>
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-gray-900 font-bold mb-6">제품</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">셀러노트 대시보드</a></li>
                <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">쉽다 물류</a></li>
                <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">위딜러 마켓플레이스</a></li>
                <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">API 문서</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-gray-900 font-bold mb-6">회사</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">셀러노트 대시보드</a></li>
                <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">쉽다 물류</a></li>
                <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">위딜러 마켓플레이스</a></li>
                <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">API 문서</a></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-gray-900 font-bold mb-6">리소스</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">셀러노트 대시보드</a></li>
                <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">쉽다 물류</a></li>
                <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">위딜러 마켓플레이스</a></li>
                <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">API 문서</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2023 Sellernote Inc. 모든 권리 보유.</p>
            <div className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer hover:text-gray-600 transition-colors">
              <Globe2 size={16} />
              <span>한국어 (KR)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
