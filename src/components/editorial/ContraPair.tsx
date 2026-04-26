"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

interface Props {
  myth: string;
  truth: string;
}

export default function ContraPair({ myth, truth }: Props) {
  const low = useLowMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-40px" });

  return (
    <div
      ref={ref}
      className="my-10 grid grid-cols-1 gap-3 md:my-14 md:grid-cols-[1fr_auto_1fr]"
    >
      {/* Myth side */}
      <motion.div
        initial={low ? false : { opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded border border-[#333] bg-[#111] p-5 md:p-6"
      >
        <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-[#555]">
          Lo que te vendieron
        </p>
        <p className="font-serif text-base leading-relaxed text-[#444] line-through decoration-[#e30613]/40 md:text-lg">
          {myth}
        </p>
      </motion.div>

      {/* Arrow divider */}
      <motion.div
        initial={low ? false : { opacity: 0, scale: 0.5 }}
        animate={inView ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center py-2 md:py-0"
        aria-hidden="true"
      >
        <span
          className="font-mono text-xl font-bold"
          style={{ color: "#e30613" }}
        >
          →
        </span>
      </motion.div>

      {/* Truth side */}
      <motion.div
        initial={low ? false : { opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="rounded border p-5 md:p-6"
        style={{ borderColor: "#e30613", background: "rgba(227, 6, 19,0.04)" }}
      >
        <p
          className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em]"
          style={{ color: "#e30613" }}
        >
          La verdad
        </p>
        <p
          className="font-serif text-base leading-relaxed md:text-lg"
          style={{ color: "#e30613" }}
        >
          {truth}
        </p>
      </motion.div>
    </div>
  );
}
