"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function TracingBeam({ children, className = "" }: Props) {
  const low = useLowMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const contentHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const smoothHeight = useSpring(contentHeight, { stiffness: 120, damping: 24 });

  const dotY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const smoothDotY = useSpring(dotY, { stiffness: 120, damping: 24 });

  if (low) {
    return (
      <div className={`relative ${className}`}>
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 hidden h-full w-px bg-line md:block"
        />
        <div className="md:pl-10">{children}</div>
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Beam rail */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 hidden h-full w-px md:block"
        style={{ background: "rgba(34,34,34,0.8)" }}
      >
        {/* Animated fill */}
        <motion.div
          style={{ height: smoothHeight }}
          className="absolute left-0 top-0 w-px origin-top"
          aria-hidden="true"
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent, #B00002 40%, #B00002 60%, transparent)",
            }}
          />
        </motion.div>

        {/* Dot */}
        <motion.div
          aria-hidden="true"
          style={{ top: smoothDotY }}
          className="absolute -left-[3px] -translate-y-1/2"
        >
          <div className="h-[7px] w-[7px] rounded-full border border-neon bg-ink shadow-[0_0_8px_rgba(176, 0, 2,0.6)]" />
        </motion.div>
      </div>

      <div className="md:pl-10">{children}</div>
    </div>
  );
}
