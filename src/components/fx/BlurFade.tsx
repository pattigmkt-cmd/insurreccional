"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
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
  once = true,
}: Props) {
  const low = useLowMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once, margin: "-30px" });

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
      ref={ref}
      className={className}
      initial={hidden}
      animate={inView ? visible : hidden}
    >
      {children}
    </motion.div>
  );
}
