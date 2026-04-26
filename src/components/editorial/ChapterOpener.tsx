"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

interface Props {
  n: string | number;
  kicker: string;
  title: string;
}

export default function ChapterOpener({ n, kicker, title }: Props) {
  const low = useLowMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-40px" });

  const num = String(n).padStart(2, "0");

  return (
    <div ref={ref} className="mb-10 mt-16 md:mb-14 md:mt-20">
      <motion.div
        initial={low ? false : { opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mb-4 flex items-center gap-3"
      >
        <span
          className="font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{ color: "#B00002" }}
        >
          {kicker}
        </span>
        <span className="h-[1px] flex-1 bg-line" aria-hidden="true" />
      </motion.div>

      <div className="flex items-baseline gap-4">
        <motion.span
          initial={low ? false : { opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0 font-mono text-[3rem] font-bold leading-none md:text-[4rem]"
          style={{
            background:
              "conic-gradient(from 0deg, #B00002, #00ffff, #B00002)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          aria-hidden="true"
        >
          {num}
        </motion.span>

        <motion.h2
          initial={low ? false : { opacity: 0, x: 12 }}
          animate={inView ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-2xl font-bold leading-tight text-bone md:text-3xl lg:text-4xl"
        >
          {title}
        </motion.h2>
      </div>
    </div>
  );
}
