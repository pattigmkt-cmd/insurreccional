"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

interface Props {
  n: number | string;
  title: string;
  children: ReactNode;
}

export default function KeyInsight({ n, title, children }: Props) {
  const low = useLowMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={low ? false : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative my-10 overflow-hidden p-[1px] md:my-14"
      style={{
        background:
          "conic-gradient(from 180deg at 50% 50%, #e30613 0deg, #00ffff 90deg, #ff6b6b 180deg, #e30613 360deg)",
        borderRadius: "4px",
      }}
    >
      <div
        className="relative bg-[#0a0a0a] p-6 md:p-8"
        style={{ borderRadius: "3px" }}
      >
        {/* Corner number */}
        <span
          className="absolute right-4 top-3 font-mono text-[4rem] font-bold leading-none select-none"
          aria-hidden="true"
          style={{ color: "#e30613", opacity: 0.12 }}
        >
          {String(n).padStart(2, "0")}
        </span>

        <p
          className="mb-1 font-mono text-[10px] uppercase tracking-[0.28em]"
          style={{ color: "#e30613" }}
        >
          Insight #{String(n).padStart(2, "0")}
        </p>
        <h4 className="mb-3 font-serif text-lg font-bold text-bone md:text-xl">
          {title}
        </h4>
        <div className="text-base leading-relaxed text-bone-soft">{children}</div>
      </div>
    </motion.div>
  );
}
