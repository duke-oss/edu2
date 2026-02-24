"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { Play, Ship, Plane, Package, Anchor } from "lucide-react";

const SPRING = { stiffness: 50, damping: 18, mass: 0.9 };

const CITIES = [
  { x: 67,  y: 63,  r: 2.2, pulse: 1.9 },
  { x: 115, y: 57,  r: 2.4, pulse: 2.1 },
  { x: 130, y: 72,  r: 1.8, pulse: 1.7 },
  { x: 147, y: 66,  r: 1.6, pulse: 2.3 },
  { x: 43,  y: 66,  r: 2.0, pulse: 2.0 },
  { x: 52,  y: 92,  r: 1.5, pulse: 1.8 },
  { x: 140, y: 96,  r: 1.5, pulse: 2.2 },
  { x: 80,  y: 80,  r: 1.4, pulse: 1.6 },
];

const ROUTES = [
  { d: "M 67,63 Q 88,44 115,57",    dur: "4s",   begin: "0s"    },
  { d: "M 43,66 Q 78,48 115,57",    dur: "6s",   begin: "1.5s"  },
  { d: "M 115,57 Q 131,62 147,66",  dur: "3s",   begin: "0.5s"  },
  { d: "M 67,63 Q 54,78 52,92",     dur: "5s",   begin: "2s"    },
  { d: "M 115,57 Q 128,78 140,96",  dur: "4.5s", begin: "1s"    },
];

function Globe({
  springX,
  springY,
}: {
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
}) {
  const rotY = useTransform(springX, [-400, 400], [-16, 16]);
  const rotX = useTransform(springY, [-400, 400], [8, -8]);

  return (
    <motion.div
      style={{ rotateY: rotY, rotateX: rotX, transformPerspective: 900 }}
      className="w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] md:w-[540px] md:h-[540px] select-none"
    >
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <radialGradient id="globeBase" cx="34%" cy="30%" r="70%">
            <stop offset="0%"   stopColor="#3b82f6" />
            <stop offset="40%"  stopColor="#1e40af" />
            <stop offset="75%"  stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0c1a3d" />
          </radialGradient>
          <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="55%"  stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
          </radialGradient>
          <radialGradient id="globeShine" cx="30%" cy="26%" r="45%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <clipPath id="gc">
            <circle cx="100" cy="100" r="88" />
          </clipPath>
          <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Atmospheric glow ring */}
        <circle cx="100" cy="100" r="96" fill="url(#globeGlow)" />

        {/* Sphere */}
        <circle cx="100" cy="100" r="88" fill="url(#globeBase)" />

        {/* Grid */}
        <g clipPath="url(#gc)" stroke="#93c5fd" fill="none" strokeWidth="0.4" opacity="0.22">
          <ellipse cx="100" cy="56"  rx="65" ry="13" />
          <ellipse cx="100" cy="76"  rx="82" ry="8" />
          <ellipse cx="100" cy="100" rx="88" ry="6" />
          <ellipse cx="100" cy="124" rx="82" ry="8" />
          <ellipse cx="100" cy="144" rx="65" ry="13" />
          <ellipse cx="100" cy="100" rx="16" ry="88" />
          <ellipse cx="100" cy="100" rx="48" ry="88" />
          <ellipse cx="100" cy="100" rx="88" ry="88" />
          <ellipse cx="100" cy="100" rx="48" ry="88" transform="rotate(55,100,100)" />
          <ellipse cx="100" cy="100" rx="48" ry="88" transform="rotate(-55,100,100)" />
          <ellipse cx="100" cy="100" rx="48" ry="88" transform="rotate(110,100,100)" />
        </g>

        {/* Trade routes */}
        <g clipPath="url(#gc)">
          {ROUTES.map((r, i) => (
            <path key={i} d={r.d} fill="none" stroke="#60a5fa"
              strokeWidth="0.55" strokeDasharray="2.5,2" opacity="0.5" />
          ))}
        </g>

        {/* Moving dots along routes */}
        <g clipPath="url(#gc)">
          {ROUTES.slice(0, 3).map((r, i) => (
            <g key={i}>
              <path id={`rt${i}`} d={r.d} visibility="hidden" />
              <circle r="1.6" fill={i === 0 ? "#ffffff" : "#7dd3fc"} opacity="0.9">
                <animateMotion dur={r.dur} repeatCount="indefinite" begin={r.begin}>
                  <mpath xlinkHref={`#rt${i}`} />
                </animateMotion>
              </circle>
            </g>
          ))}
        </g>

        {/* City dots */}
        <g clipPath="url(#gc)">
          {CITIES.map((c, i) => (
            <g key={i}>
              <circle cx={c.x} cy={c.y} r={c.r + 2} fill="#60a5fa" opacity="0.15">
                <animate attributeName="r"       values={`${c.r};${c.r+3.5};${c.r}`} dur={`${c.pulse}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.18;0.03;0.18"             dur={`${c.pulse}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={c.x} cy={c.y} r={c.r} fill="#bfdbfe" filter="url(#dotGlow)" />
            </g>
          ))}
        </g>

        {/* Shine */}
        <circle cx="100" cy="100" r="88" fill="url(#globeShine)" />
      </svg>
    </motion.div>
  );
}

function FloatIcon({
  children,
  top,
  left,
  dx,
  dy,
  delay,
  springX,
  springY,
}: {
  children: React.ReactNode;
  top: string;
  left: string;
  dx: number;
  dy: number;
  delay: number;
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
}) {
  const x = useTransform(springX, (v: number) => (v / 400) * dx);
  const y = useTransform(springY, (v: number) => (v / 400) * dy);

  return (
    <motion.div
      className="absolute hidden lg:block pointer-events-none"
      style={{ top, left }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay }}
    >
      <motion.div style={{ x, y }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function HeroInteractive() {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, SPRING);
  const springY = useSpring(rawY, SPRING);

  const glowX = useTransform(springX, (v) => 50 + v * 0.025);
  const glowY = useTransform(springY, (v) => 45 + v * 0.025);
  const glowBg = useMotionTemplate`radial-gradient(800px circle at ${glowX}% ${glowY}%, rgba(59,130,246,0.12), transparent 60%)`;

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-[#07102a] to-slate-900"
    >
      {/* Mouse ambient glow */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: glowBg }} />

      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #60a5fa 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Globe */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="opacity-80">
          <Globe springX={springX} springY={springY} />
        </div>
      </div>

      {/* Large cargo ship — bottom left */}
      <FloatIcon top="60%" left="6%" dx={18} dy={28} delay={0.1} springX={springX} springY={springY}>
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-blue-500/40 scale-[2] rounded-full -z-10" />
          <Ship size={56} className="text-blue-300" strokeWidth={1.1} />
        </div>
      </FloatIcon>

      {/* Small ship — top right */}
      <FloatIcon top="18%" left="76%" dx={48} dy={10} delay={0.2} springX={springX} springY={springY}>
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-blue-400/25 scale-[2] rounded-full -z-10" />
          <Ship size={30} className="text-blue-400/75" strokeWidth={1.3} />
        </div>
      </FloatIcon>

      {/* Large plane — top left */}
      <FloatIcon top="13%" left="18%" dx={-34} dy={12} delay={0.05} springX={springX} springY={springY}>
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-cyan-500/35 scale-[2] rounded-full -z-10" />
          <Plane size={48} className="text-cyan-300 -rotate-12" strokeWidth={1.1} />
        </div>
      </FloatIcon>

      {/* Small plane — bottom right */}
      <FloatIcon top="70%" left="80%" dx={42} dy={36} delay={0.15} springX={springX} springY={springY}>
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-cyan-400/25 scale-[2] rounded-full -z-10" />
          <Plane size={26} className="text-cyan-400/65 rotate-12" strokeWidth={1.3} />
        </div>
      </FloatIcon>

      {/* Package — right middle */}
      <FloatIcon top="42%" left="84%" dx={52} dy={24} delay={0.25} springX={springX} springY={springY}>
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-violet-500/25 scale-[2] rounded-full -z-10" />
          <Package size={32} className="text-violet-300/75" strokeWidth={1.2} />
        </div>
      </FloatIcon>

      {/* Anchor — bottom center-left */}
      <FloatIcon top="78%" left="32%" dx={22} dy={44} delay={0.3} springX={springX} springY={springY}>
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-indigo-500/20 scale-[2] rounded-full -z-10" />
          <Anchor size={26} className="text-indigo-300/55" strokeWidth={1.3} />
        </div>
      </FloatIcon>

      {/* Centered text */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-8 backdrop-blur-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          차세대 무역 플랫폼
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          글로벌 무역,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            더 쉽고 단순하게.
          </span>
        </motion.h1>

        <motion.p
          className="text-lg text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          국제 무역의 장벽을 낮추는 스마트 디지털 물류 시스템.
          <br className="hidden sm:block" />
          신뢰할 수 있는 인터페이스로 전 세계 시장을 연결합니다.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-white font-semibold bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/40 transition-colors"
          >
            시작하기
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-white font-semibold border border-white/15 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-colors"
          >
            <Play size={16} className="mr-2 fill-current" />
            데모 보기
          </motion.a>
        </motion.div>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
