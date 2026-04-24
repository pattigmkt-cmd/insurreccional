"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { useLowMotion } from "../../lib/useLowMotion";

interface Props {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export default function NumberTicker({
  value,
  duration = 1.8,
  className = "",
  suffix = "",
  prefix = "",
}: Props) {
  const low = useLowMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-20px" });
  const [display, setDisplay] = useState(low ? value : 0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (low || !inView || hasAnimated.current) return;
    hasAnimated.current = true;
    const start = { v: 0 };
    const end = { v: value };
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, low, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}
