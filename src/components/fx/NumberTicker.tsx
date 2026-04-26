"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
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
  const [display, setDisplay] = useState(low ? value : 0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (low || hasAnimated.current) return;
    hasAnimated.current = true;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, []);

  return (
    <span className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}
