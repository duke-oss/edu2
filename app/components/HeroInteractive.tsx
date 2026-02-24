"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { Ship, Plane, Play, ChevronDown } from "lucide-react";

const SPRING = { stiffness: 48, damping: 18, mass: 0.9 };

const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.6 + 0.4,
  opacity: Math.random() * 0.5 + 0.1,
  duration: 2 + Math.random() * 3,
  delay: Math.random() * 4,
}));

const PORTS = [
  { x: 162, y: 218 },
  { x: 218, y: 188 },
  { x: 268, y: 200 },
  { x: 322, y: 208 },
  { x: 348, y: 248 },
  { x: 338, y: 175 },
  { x: 178, y: 285 },
  { x: 232, y: 260 },
];

const ROUTES = [
  { d: "M162,218 Q200,165 218,188", delay: 1.2 },
  { d: "M218,188 Q245,180 268,200", delay: 1.5 },
  { d: "M268,200 Q298,198 322,208", delay: 1.8 },
  { d: "M322,208 Q337,228 348,248", delay: 2.1 },
  { d: "M162,218 Q170,252 178,285", delay: 2.4 },
  { d: "M218,188 Q226,225 232,260", delay: 2.7 },
];

// ─────────────────────────────────────────────────
// Globe
// ─────────────────────────────────────────────────
function Globe3D({
  springX,
  springY,
}: {
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
}) {
  const rotateY = useTransform(springX, [-400, 400], [-14, 14]);
  const rotateX = useTransform(springY, [-400, 400], [10, -10]);

  return (
    <motion.div
      style={{ rotateY, rotateX, transformPerspective: 1400 }}
      className="w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] lg:w-[580px] lg:h-[580px]"
    >
      <svg viewBox="0 0 500 500" width="100%" height="100%">
        <defs>
          <radialGradient id="globeGrad" cx="36%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="30%" stopColor="#2563eb" />
            <stop offset="65%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#060c1a" />
          </radialGradient>
          <radialGradient id="edgeDark" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,15,0.75)" />
          </radialGradient>
          <filter id="portGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
          </filter>
          <filter id="lineGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="globeClip">
            <circle cx="250" cy="250" r="220" />
          </clipPath>
        </defs>

        {/* Atmosphere */}
        <circle cx="250" cy="250" r="248" fill="rgba(59,130,246,0.04)" />
        <circle cx="250" cy="250" r="236" fill="rgba(59,130,246,0.06)" />
        <circle cx="250" cy="250" r="226" fill="rgba(96,165,250,0.07)" />

        {/* Sphere */}
        <circle cx="250" cy="250" r="220" fill="url(#globeGrad)" />

        {/* Latitude */}
        {[-60, -30, 0, 30, 60].map((lat) => {
          const rad = (lat * Math.PI) / 180;
          const cy = 250 - Math.sin(rad) * 220;
          const rx = Math.cos(rad) * 220;
          const ry = Math.cos(rad) * 58;
          return (
            <ellipse
              key={lat}
              cx="250" cy={cy} rx={rx} ry={ry}
              fill="none" stroke="rgba(147,197,253,0.2)" strokeWidth="0.8"
              clipPath="url(#globeClip)"
            />
          );
        })}

        {/* Longitude */}
        {[0, 30, 60, 90, 120, 150].map((lon) => {
          const rad = (lon * Math.PI) / 180;
          const rx = Math.abs(Math.cos(rad)) * 220 || 0.5;
          return (
            <ellipse
              key={lon}
              cx="250" cy="250" rx={rx} ry="220"
              fill="none" stroke="rgba(147,197,253,0.15)" strokeWidth="0.8"
              clipPath="url(#globeClip)"
            />
          );
        })}

        {/* Trade route glow */}
        {ROUTES.map((r, i) => (
          <motion.path
            key={`g${i}`} d={r.d}
            fill="none" stroke="rgba(34,211,238,0.2)" strokeWidth="4"
            strokeLinecap="round" clipPath="url(#globeClip)" filter="url(#lineGlow)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: r.delay }}
          />
        ))}

        {/* Trade route lines */}
        {ROUTES.map((r, i) => (
          <motion.path
            key={`l${i}`} d={r.d}
            fill="none" stroke="rgba(34,211,238,0.75)" strokeWidth="1"
            strokeDasharray="4 3" strokeLinecap="round" clipPath="url(#globeClip)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: r.delay }}
          />
        ))}

        {/* Port pulse rings */}
        {PORTS.map((p, i) => (
          <motion.circle
            key={`pr${i}`} cx={p.x} cy={p.y} r="5"
            fill="none" stroke="rgba(34,211,238,0.45)" strokeWidth="1"
            clipPath="url(#globeClip)"
            animate={{ r: [5, 11, 5], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.32, ease: "easeOut" }}
          />
        ))}

        {/* Port dots */}
        {PORTS.map((p, i) => (
          <g key={`pd${i}`}>
            <circle cx={p.x} cy={p.y} r="5" fill="rgba(34,211,238,0.3)"
              clipPath="url(#globeClip)" filter="url(#portGlow)" />
            <circle cx={p.x} cy={p.y} r="2.5" fill="#22d3ee" clipPath="url(#globeClip)" />
          </g>
        ))}

        {/* Specular */}
        <ellipse cx="188" cy="175" rx="80" ry="56"
          fill="rgba(255,255,255,0.07)" clipPath="url(#globeClip)" />
        <ellipse cx="178" cy="168" rx="36" ry="24"
          fill="rgba(255,255,255,0.06)" clipPath="url(#globeClip)" />

        {/* Edge depth */}
        <circle cx="250" cy="250" r="220" fill="url(#edgeDark)" />
      </svg>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────
// Floating vehicle card
// ─────────────────────────────────────────────────
type VehicleProps = {
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
  type: "ship" | "plane";
  label: string;
  sub: string;
  dx: number;
  dy: number;
  delay: number;
  posStyle: React.CSSProperties;
  flip?: boolean;
  planeAngle?: number;
};

function FloatingVehicle({
  springX, springY, type, label, sub,
  dx, dy, delay, posStyle, flip, planeAngle = -40,
}: VehicleProps) {
  const x = useTransform(springX, (v: number) => (v / 400) * dx);
  const y = useTransform(springY, (v: number) => (v / 400) * dy);
  const Icon = type === "ship" ? Ship : Plane;
  const accent = type === "ship" ? "#60a5fa" : "#22d3ee";
  const iconBg = type === "ship" ? "rgba(59,130,246,0.18)" : "rgba(34,211,238,0.18)";
  const cardBg = "rgba(255,255,255,0.04)";
  const cardBorder = type === "ship" ? "rgba(96,165,250,0.22)" : "rgba(34,211,238,0.22)";

  return (
    <motion.div
      className="absolute hidden lg:block pointer-events-none"
      style={posStyle}
      initial={{ opacity: 0, scale: 0.65 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
    >
      <motion.div
        style={{
          x, y, scaleX: flip ? -1 : 1,
          background: cardBg,
          border: `1px solid ${cardBorder}`,
        }}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl backdrop-blur-md"
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: iconBg }}
        >
          <Icon
            size={16}
            style={{
              color: accent,
              transform: type === "plane" ? `rotate(${planeAngle}deg)` : undefined,
            }}
          />
        </div>
        <div style={{ transform: flip ? "scaleX(-1)" : undefined }}>
          <p className="text-white text-xs font-semibold leading-none">{label}</p>
          <p className="text-[10px] mt-0.5" style={{ color: `${accent}aa` }}>
            {sub}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────
export default function HeroInteractive() {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, SPRING);
  const springY = useSpring(rawY, SPRING);

  const glowX = useTransform(springX, (v) => 50 + v * 0.025);
  const glowY = useTransform(springY, (v) => 50 + v * 0.025);
  const glowBg = useMotionTemplate`radial-gradient(900px circle at ${glowX}% ${glowY}%, rgba(29,78,216,0.13), transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(e.clientX - (rect.left + rect.width / 2));
    rawY.set(e.clientY - (rect.top + rect.height / 2));
  };

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { rawX.set(0); rawY.set(0); }}
      className="relative min-h-screen bg-[#060c1a] overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Mouse glow */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: glowBg }} />

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />

      {/* Stars */}
      {STARS.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.opacity }}
          animate={{ opacity: [s.opacity, s.opacity * 0.2, s.opacity] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay }}
        />
      ))}

      {/* Globe — absolute center */}
      <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <Globe3D springX={springX} springY={springY} />
      </div>

      {/* Ships */}
      <FloatingVehicle
        springX={springX} springY={springY}
        type="ship" label="컨테이너선" sub="부산 → 로테르담"
        dx={22} dy={32} delay={1.0}
        posStyle={{ left: "6%", top: "60%" }}
      />
      <FloatingVehicle
        springX={springX} springY={springY}
        type="ship" label="화물선" sub="상하이 → LA" flip
        dx={42} dy={36} delay={1.2}
        posStyle={{ right: "6%", top: "57%" }}
      />

      {/* Planes */}
      <FloatingVehicle
        springX={springX} springY={springY}
        type="plane" label="항공화물" sub="인천 → 프랑크푸르트"
        dx={-30} dy={18} delay={1.1} planeAngle={-45}
        posStyle={{ left: "7%", top: "26%" }}
      />
      <FloatingVehicle
        springX={springX} springY={springY}
        type="plane" label="특급배송" sub="홍콩 → 뉴욕" flip
        dx={48} dy={22} delay={1.3} planeAngle={-45}
        posStyle={{ right: "7%", top: "28%" }}
      />

      {/* Text — centered, sits above globe visually */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6" style={{ marginBottom: "8vh" }}>
        <motion.div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium mb-7"
          style={{
            background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(96,165,250,0.25)",
            color: "#93c5fd",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          차세대 무역 플랫폼
        </motion.div>

        <motion.h1
          className="text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          글로벌 무역,
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #60a5fa, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            더 쉽고 단순하게.
          </span>
        </motion.h1>

        <motion.p
          className="text-lg text-blue-100/55 mb-10 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          국제 무역의 장벽을 낮추는 스마트 디지털 물류 시스템.
          <br className="hidden sm:block" />
          신뢰할 수 있는 인터페이스를 통해 전 세계 시장을 연결합니다.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-full text-white transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
              boxShadow: "0 8px 32px rgba(37,99,235,0.35)",
            }}
          >
            시작하기
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-full transition-all hover:bg-white/8"
            style={{
              color: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Play size={16} className="mr-2 fill-current" />
            데모 보기
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span className="text-[11px] text-white/30 font-medium tracking-widest uppercase">scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <ChevronDown size={16} className="text-white/25" />
        </motion.div>
      </motion.div>
    </section>
  );
}
