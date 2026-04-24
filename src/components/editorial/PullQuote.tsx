"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

interface Props {
  children: ReactNode;
  attribution?: string;
}

export default function PullQuote({ children, attribution }: Props) {
  const low = useLowMotion();
  const ref = useRef<HTMLBlockquoteElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-40px" });

  const animProps = low
    ? {}
    : {
        initial: { opacity: 0, x: -24 },
        animate: inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <motion.blockquote
      ref={ref}
      {...(animProps as object)}
      className="my-10 border-l-[3px] border-neon pl-6 md:my-14 md:pl-8"
      style={{ borderColor: "#c8ff00" }}
    >
      <span
        className="mb-2 block font-serif text-[2.5rem] leading-none text-neon select-none"
        aria-hidden="true"
        style={{ color: "#c8ff00", lineHeight: 1 }}
      >
        »
      </span>
      <p className="font-serif text-xl leading-relaxed text-bone italic md:text-2xl lg:text-[1.65rem]">
        {children}
      </p>
      {attribution && (
        <cite className="mt-4 block font-mono text-[10px] not-italic uppercase tracking-[0.28em] text-mute">
          {attribution}
        </cite>
      )}
    </motion.blockquote>
  );
}
