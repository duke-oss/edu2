"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState(false);

  const movingMap: Record<string, string> = {
    top: "radial-gradient(20% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    right: "radial-gradient(50% 20% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    bottom: "radial-gradient(20% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    left: "radial-gradient(50% 20% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
  };

  const highlight =
    "radial-gradient(75% 181.15942028985506% at 50% 50%, hsl(var(--primary)) 0%, rgba(255, 255, 255, 0) 100%)";

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border content-center transition duration-500 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px w-fit",
        containerClassName
      )}
      {...props}
    >
      <div className={cn("w-auto z-10 rounded-[inherit]", className)}>
        {children}
      </div>
      <motion.div
        className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        style={{ filter: "blur(2px)", position: "absolute", width: "100%", height: "100%" }}
        initial={{ background: movingMap.top }}
        animate={{ background: hovered ? [movingMap.top, movingMap.right, movingMap.bottom, movingMap.left, movingMap.top] : movingMap.top }}
        transition={{ ease: "linear", duration: duration ?? 1, repeat: hovered ? Infinity : 0 }}
      />
      <div className="bg-background absolute z-1 flex-none inset-[2px] rounded-[100px]" />
    </Tag>
  );
}
