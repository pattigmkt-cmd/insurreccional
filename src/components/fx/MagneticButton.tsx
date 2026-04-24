"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useCoarsePointer } from "../../lib/useCoarsePointer";
import { useLowMotion } from "../../lib/useLowMotion";

interface Props {
  children: ReactNode;
  href?: string;
  className?: string;
  strength?: number;
}

export default function MagneticButton({ children, href, className = "", strength = 0.35 }: Props) {
  const coarse = useCoarsePointer();
  const low = useLowMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 200, damping: 18 });
  const y = useSpring(rawY, { stiffness: 200, damping: 18 });

  if (coarse || low) {
    const fallbackStyle =
      "group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-mute transition-colors hover:text-bone";
    if (href) return <a href={href} className={`${fallbackStyle} ${className}`}>{children}</a>;
    return <button className={`${fallbackStyle} ${className}`}>{children}</button>;
  }

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawX.set((e.clientX - cx) * strength);
    rawY.set((e.clientY - cy) * strength);
  };

  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const inner = href ? (
    <a
      href={href}
      className={`group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-mute transition-colors hover:text-bone ${className}`}
    >
      {children}
    </a>
  ) : (
    <button
      className={`group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-mute transition-colors hover:text-bone ${className}`}
    >
      {children}
    </button>
  );

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: "inline-block" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {inner}
    </motion.div>
  );
}
