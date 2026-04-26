"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

interface Props {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  once?: boolean;
}

const OFFSET = 18;

export default function BlurFade({
  children,
  delay = 0,
  duration = 0.55,
  direction = "up",
  className = "",
}: Props) {
  const low = useLowMotion();

  if (low) {
    return <div className={className}>{children}</div>;
  }

  const translateMap: Record<string, { x?: number; y?: number }> = {
    up: { y: OFFSET },
    down: { y: -OFFSET },
    left: { x: OFFSET },
    right: { x: -OFFSET },
    none: {},
  };

  const hidden = { opacity: 0, filter: "blur(8px)", ...translateMap[direction] };
  const visible = {
    opacity: 1,
    filter: "blur(0px)",
    x: 0,
    y: 0,
    transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <motion.div
      className={className}
      initial={hidden}
      animate={visible}
    >
      {children}
    </motion.div>
  );
}
