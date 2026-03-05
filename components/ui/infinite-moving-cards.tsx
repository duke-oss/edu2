"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Item {
  initial: string;
  gradient: string;
  text: string;
  name: string;
  course: string;
  rating: number;
}

export function InfiniteMovingCards({
  items,
  direction = "left",
  speed = "slow",
  pauseOnHover = true,
  className,
}: {
  items: Item[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        scrollerRef.current!.appendChild(duplicatedItem);
      });
      setDirection();
      setSpeed();
      setStart(true);
    }
  }

  function setDirection() {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  }

  function setSpeed() {
    if (containerRef.current) {
      const duration =
        speed === "fast" ? "20s" : speed === "normal" ? "40s" : "60s";
      containerRef.current.style.setProperty("--animation-duration", duration);
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="w-[340px] max-w-full shrink-0 rounded-2xl border border-border bg-card px-6 py-5 flex flex-col gap-3"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: item.rating }).map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.text}</p>
            <div className="flex items-center gap-3 pt-3 border-t border-border">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white text-xs font-black shrink-0`}>
                {item.initial}
              </div>
              <div>
                <p className="text-sm font-bold">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.course}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
