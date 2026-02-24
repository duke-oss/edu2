"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { Ship, Plane, Package, Globe2, TrendingUp, Play } from "lucide-react";

const SPRING = { stiffness: 55, damping: 18, mass: 0.8 };

const CARDS = [
  {
    icon: Ship,
    label: "해상 운송",
    top: "6%",
    left: "64%",
    dx: 28,
    dy: 12,
    iconColor: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
    delay: 0,
  },
  {
    icon: Globe2,
    label: "글로벌 무역",
    top: "24%",
    left: "84%",
    dx: 48,
    dy: 8,
    iconColor: "#10b981",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    delay: 0.12,
  },
  {
    icon: Plane,
    label: "항공 운송",
    top: "54%",
    left: "86%",
    dx: 44,
    dy: 30,
    iconColor: "#0ea5e9",
    bg: "#f0f9ff",
    border: "#bae6fd",
    delay: 0.06,
  },
  {
    icon: Package,
    label: "소싱 관리",
    top: "82%",
    left: "60%",
    dx: 22,
    dy: 44,
    iconColor: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    delay: 0.2,
  },
  {
    icon: TrendingUp,
    label: "수출입 분석",
    top: "74%",
    left: "80%",
    dx: 38,
    dy: 36,
    iconColor: "#f97316",
    bg: "#fff7ed",
    border: "#fed7aa",
    delay: 0.16,
  },
];

function FloatingCard({
  icon: Icon,
  label,
  top,
  left,
  dx,
  dy,
  iconColor,
  bg,
  border,
  delay,
  springX,
  springY,
}: (typeof CARDS)[0] & { springX: ReturnType<typeof useSpring>; springY: ReturnType<typeof useSpring> }) {
  const x = useTransform(springX, (v: number) => (v / 400) * dx);
  const y = useTransform(springY, (v: number) => (v / 400) * dy);

  return (
    <motion.div
      className="absolute hidden lg:block pointer-events-none"
      style={{ top, left }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.div
        style={{ x, y, backgroundColor: bg, borderColor: border }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl shadow-md border select-none"
      >
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}18` }}
        >
          <Icon size={13} style={{ color: iconColor }} />
        </div>
        <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">
          {label}
        </span>
      </motion.div>
    </motion.div>
  );
}

function TiltMockup({
  springX,
  springY,
}: {
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
}) {
  const rotateY = useTransform(springX, [-400, 400], [-10, 10]);
  const rotateX = useTransform(springY, [-400, 400], [6, -6]);

  return (
    <motion.div
      style={{ rotateY, rotateX, transformPerspective: 1200 }}
      className="relative rounded-2xl bg-gray-900 shadow-2xl overflow-hidden aspect-[4/3]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
      <div className="absolute bottom-0 left-0 right-0 h-64 flex items-end px-8 pb-8 space-x-2 opacity-80">
        {[40, 60, 45, 70, 50, 85, 60, 95, 75, 110, 85, 120, 95, 140, 110, 160].map(
          (h, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-sm"
              initial={{ height: 0 }}
              animate={{ height: `${h}px` }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.03 }}
            />
          )
        )}
      </div>
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path
          d="M0,200 Q100,250 200,150 T400,100 T600,200 T800,50 L800,0 L0,0 Z"
          fill="rgba(255,255,255,0.03)"
        />
        <polyline
          points="0,200 50,220 100,180 150,230 200,160 250,210 300,140 350,240 400,120 450,190 500,150 550,260 600,170 650,210 700,90 750,180 800,50"
          fill="none"
          stroke="cyan"
          strokeWidth="2"
          className="opacity-70"
        />
      </svg>
    </motion.div>
  );
}

export default function HeroInteractive() {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, SPRING);
  const springY = useSpring(rawY, SPRING);

  // Mouse-following glow
  const glowX = useTransform(springX, (v) => 50 + v * 0.03);
  const glowY = useTransform(springY, (v) => 45 + v * 0.03);
  const glowBg = useMotionTemplate`radial-gradient(700px circle at ${glowX}% ${glowY}%, rgba(59,130,246,0.07), transparent 65%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(e.clientX - (rect.left + rect.width / 2));
    rawY.set(e.clientY - (rect.top + rect.height / 2));
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-32"
    >
      {/* Mouse glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: glowBg }}
      />

      {/* Floating cards */}
      {CARDS.map((card) => (
        <FloatingCard
          key={card.label}
          {...card}
          springX={springX}
          springY={springY}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              차세대 무역 플랫폼
            </motion.div>
            <motion.h1
              className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              글로벌 무역, <br />
              <span className="text-blue-600">
                더 쉽고{" "}
                <br className="lg:hidden" />
                단순하게.
              </span>
            </motion.h1>
            <motion.p
              className="mt-4 text-lg text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              국제 무역의 장벽을 낮추는 스마트 디지털 물류 시스템. 신뢰할 수
              있는 인터페이스를 통해 전 세계 시장을 연결합니다.
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

          {/* Right: Tilt mockup */}
          <motion.div
            className="lg:col-span-6 mt-16 lg:mt-0"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TiltMockup springX={springX} springY={springY} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
