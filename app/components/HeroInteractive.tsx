"use client";

import { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import {
  MapPin,
  ArrowLeftRight,
  Calendar,
  Package,
  Search,
  X,
  ExternalLink,
  Play,
  Navigation,
  LayoutGrid,
} from "lucide-react";

const SPRING = { stiffness: 50, damping: 22 };

// Simplified continent paths (SVG 560×560, globe center 280,280, radius 235)
const CONTINENTS = [
  // North America
  "M 74,92 L 192,84 L 208,118 L 190,165 L 160,190 L 120,200 L 76,180 L 60,140 Z",
  // South America
  "M 126,210 L 174,204 L 192,240 L 180,312 L 146,332 L 116,308 L 103,274 L 110,237 Z",
  // Europe
  "M 222,88 L 284,82 L 300,104 L 283,127 L 248,134 L 222,116 Z",
  // Africa
  "M 228,132 L 296,125 L 313,153 L 306,220 L 276,242 L 240,235 L 223,200 L 223,163 Z",
  // Asia (large)
  "M 288,77 L 418,70 L 440,100 L 426,158 L 379,180 L 308,172 L 282,144 L 282,102 Z",
  // SE Asia
  "M 360,183 L 400,178 L 413,200 L 396,220 L 360,217 L 346,200 Z",
  // Australia
  "M 378,222 L 436,215 L 453,248 L 436,277 L 390,280 L 366,257 Z",
];

// Arc trade routes (fly above the globe)
const ARCS = [
  {
    id: "arc1",
    d: "M 452,182 C 516,32 395,-30 252,90",
    color: "#22c55e",
    markerId: "m-green",
  },
  {
    id: "arc2",
    d: "M 432,215 C 528,55 415,-40 265,78",
    color: "#a3e635",
    markerId: "m-lime",
  },
  {
    id: "arc3",
    d: "M 412,158 C 490,18 370,-48 220,98",
    color: "#2563eb",
    markerId: "m-blue",
  },
];

// Arc endpoint dots
const ARC_DOTS = [
  { cx: 452, cy: 182, color: "#22c55e" },
  { cx: 252, cy: 90,  color: "#22c55e" },
  { cx: 432, cy: 215, color: "#a3e635" },
  { cx: 265, cy: 78,  color: "#a3e635" },
  { cx: 412, cy: 158, color: "#2563eb" },
  { cx: 220, cy: 98,  color: "#2563eb" },
];

function GlobeSVG({
  springX,
  springY,
}: {
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
}) {
  const rotateY = useTransform(springX, [-400, 400], [-5, 5]);
  const rotateX = useTransform(springY, [-400, 400], [3, -3]);

  return (
    <motion.div
      style={{ rotateY, rotateX, transformPerspective: 1200 }}
      className="w-full"
    >
      <svg viewBox="0 0 560 560" width="100%" height="100%">
        <defs>
          <radialGradient id="globeLight" cx="38%" cy="32%" r="68%">
            <stop offset="0%"   stopColor="#f0f7ff" />
            <stop offset="55%"  stopColor="#ddeeff" />
            <stop offset="100%" stopColor="#bfd4ef" />
          </radialGradient>
          <radialGradient id="globeEdge" cx="50%" cy="50%" r="50%">
            <stop offset="72%"  stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(37,99,235,0.12)" />
          </radialGradient>
          <clipPath id="globeC">
            <circle cx="280" cy="280" r="235" />
          </clipPath>
          {/* Arrow markers */}
          {["green", "lime", "blue"].map((c, i) => (
            <marker
              key={c}
              id={`m-${c}`}
              markerWidth="7"
              markerHeight="7"
              refX="3.5"
              refY="3.5"
              orient="auto"
            >
              <path
                d="M 0,0 L 7,3.5 L 0,7 Z"
                fill={["#22c55e", "#a3e635", "#2563eb"][i]}
              />
            </marker>
          ))}
        </defs>

        {/* Globe fill */}
        <circle cx="280" cy="280" r="235" fill="url(#globeLight)" />

        {/* Continents */}
        {CONTINENTS.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="#8ab4dc"
            opacity="0.55"
            clipPath="url(#globeC)"
          />
        ))}

        {/* Edge depth */}
        <circle cx="280" cy="280" r="235" fill="url(#globeEdge)" />
        <circle
          cx="280" cy="280" r="235"
          fill="none" stroke="rgba(37,99,235,0.08)" strokeWidth="1.5"
        />

        {/* Arc trade routes */}
        {ARCS.map((arc) => (
          <motion.path
            key={arc.id}
            d={arc.d}
            fill="none"
            stroke={arc.color}
            strokeWidth="2"
            strokeLinecap="round"
            markerEnd={`url(#${arc.markerId})`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.6 + ARCS.indexOf(arc) * 0.2 }}
          />
        ))}

        {/* Arc endpoint dots */}
        {ARC_DOTS.map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx} cy={dot.cy} r="3.5"
            fill={dot.color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

// ─── Tabs ───────────────────────────────────────
const TABS = [
  { id: "rates",    label: "RATES",           icon: Play,       bg: "bg-blue-600",  text: "text-white" },
  { id: "tracking", label: "TRACKING",        icon: Navigation, bg: "bg-blue-100",  text: "text-blue-600" },
  { id: "schedule", label: "SCHEDULES",       icon: LayoutGrid, bg: "bg-gray-800",  text: "text-white" },
  { id: "quote",    label: "REQUEST A QUOTE", icon: ExternalLink,bg: "",            text: "text-gray-600", external: true },
];

// ─── Main component ──────────────────────────────
export default function HeroInteractive() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("rates");

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, SPRING);
  const springY = useSpring(rawY, SPRING);

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
      className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50/30 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center min-h-[88vh] gap-8">

          {/* ── Left: text + form ── */}
          <div className="flex-1 py-20 z-10">
            <motion.h1
              className="text-4xl md:text-5xl font-black text-[#0a1f3d] mb-10 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              최고의 화물 견적 찾기
            </motion.h1>

            {/* Tabs */}
            <motion.div
              className="flex flex-wrap items-center gap-2 mb-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => !tab.external && setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all
                      ${isActive && !tab.external
                        ? `${tab.bg} ${tab.text} shadow-sm`
                        : tab.external
                        ? "text-gray-500 hover:text-gray-700"
                        : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center
                        ${isActive && !tab.external ? tab.bg : "bg-gray-100"}`}
                    >
                      <Icon size={10} className={isActive && !tab.external ? tab.text : "text-gray-500"} />
                    </span>
                    {tab.label}
                    {tab.external && <ExternalLink size={11} />}
                  </button>
                );
              })}
            </motion.div>

            {/* Search bar */}
            <motion.div
              className="bg-white rounded-2xl shadow-md border border-gray-100 flex items-center gap-1 px-3 py-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* From */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0 px-2">
                <MapPin size={14} className="text-gray-400 shrink-0" />
                <input
                  className="text-sm text-gray-500 bg-transparent outline-none w-full placeholder:text-gray-400"
                  placeholder="City, terminal, ZIP code etc."
                />
              </div>

              {/* Swap */}
              <button className="shrink-0 p-1.5 rounded-lg hover:bg-gray-50 text-gray-400">
                <ArrowLeftRight size={14} />
              </button>

              {/* To */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0 px-2">
                <MapPin size={14} className="text-gray-400 shrink-0" />
                <input
                  className="text-sm text-gray-500 bg-transparent outline-none w-full placeholder:text-gray-400"
                  placeholder="City, terminal, ZIP code etc."
                />
              </div>

              <div className="w-px h-7 bg-gray-200 mx-1" />

              {/* Date */}
              <div className="flex items-center gap-1.5 shrink-0 px-2">
                <Calendar size={13} className="text-gray-400" />
                <span className="text-sm text-gray-600 whitespace-nowrap">24 Feb, 2026</span>
                <button className="text-gray-300 hover:text-gray-500">
                  <X size={13} />
                </button>
              </div>

              <div className="w-px h-7 bg-gray-200 mx-1" />

              {/* Container type */}
              <div className="flex items-center gap-1.5 shrink-0 px-2">
                <Package size={13} className="text-gray-400" />
                <span className="text-sm text-gray-600 whitespace-nowrap">FCL, 20&#39; ST</span>
                <button className="text-gray-300 hover:text-gray-500">
                  <X size={13} />
                </button>
              </div>

              {/* Search button */}
              <button className="shrink-0 w-9 h-9 rounded-xl bg-[#0a1f3d] text-white flex items-center justify-center hover:bg-[#0d2a52] transition-colors ml-1">
                <Search size={16} />
              </button>
            </motion.div>
          </div>

          {/* ── Right: Globe ── */}
          <motion.div
            className="hidden lg:block w-[52%] shrink-0 -mr-16"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <GlobeSVG springX={springX} springY={springY} />
          </motion.div>
        </div>
      </div>

      {/* Special offers bar */}
      <motion.div
        className="border-t border-gray-100 bg-white/60 backdrop-blur-sm px-6 lg:px-10 py-4 flex items-center gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <span className="font-bold text-gray-900 text-sm">Special offers</span>
        <button className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
          IMPORT TO <span>🇰🇷</span>
        </button>
        <button className="flex items-center gap-2 text-blue-600 border-b border-blue-500 text-xs font-bold pb-0.5 hover:text-blue-700 transition-colors">
          EXPORT FROM <span>🇰🇷</span>
        </button>
      </motion.div>
    </section>
  );
}
