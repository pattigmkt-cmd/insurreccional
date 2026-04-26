"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

const FRAGMENTS = [
  { id: "L", x: -60, y: -30, r: -25, ox: 0 },
  { id: "O1", x: -20, y: 30, r: 15, ox: 60 },
  { id: "G", x: 50, y: -40, r: -10, ox: 120 },
  { id: "O2", x: -40, y: 50, r: 30, ox: 180 },
  { id: "dot1", x: 80, y: 20, r: 45, ox: 100 },
  { id: "dot2", x: -70, y: -50, r: -20, ox: 160 },
  { id: "bar", x: 30, y: 60, r: -35, ox: 40 },
  { id: "arc", x: -30, y: -60, r: 20, ox: 140 },
];

export default function LogoShatter() {
  const low = useLowMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-80px" });
  const [shattered, setShattered] = useState(false);
  const [rebuilt, setRebuilt] = useState(false);

  const handleInteraction = () => {
    if (rebuilt) {
      setShattered(false);
      setRebuilt(false);
      return;
    }
    if (!shattered) {
      setShattered(true);
      setTimeout(() => setRebuilt(true), 1200);
    }
  };

  if (low) {
    return (
      <div className="my-10 flex items-center justify-center gap-6 rounded border border-line bg-[#111] p-8">
        <span className="font-serif text-3xl font-bold text-[#444] line-through">LOGO</span>
        <span className="font-mono text-xl" style={{ color: "#B00002" }}>→</span>
        <span className="font-serif text-3xl font-bold" style={{ color: "#B00002" }}>PROMESA</span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="my-10 select-none md:my-14"
      aria-label="Visualización: LOGO se fractura y reconstruye como PROMESA"
    >
      <div
        className="relative flex cursor-pointer items-center justify-center overflow-hidden rounded border border-line bg-[#0d0d0d] py-14 transition-colors hover:border-neon/30"
        onClick={handleInteraction}
        onMouseEnter={() => !shattered && setShattered(true)}
        onMouseLeave={() => !rebuilt && setTimeout(() => { setShattered(false); }, 300)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleInteraction()}
        aria-label="Interactuar con animación LOGO→PROMESA"
      >
        {/* LOGO word - fractures */}
        <motion.div
          className="relative"
          initial={{ opacity: 1 }}
          animate={inView ? {
            opacity: rebuilt ? 0 : 1,
          } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {["L", "O", "G", "O"].map((letter, i) => (
            <motion.span
              key={`${letter}-${i}`}
              className="inline-block font-serif text-5xl font-bold text-[#888] md:text-6xl"
              animate={shattered && !rebuilt ? {
                x: FRAGMENTS[i].x,
                y: FRAGMENTS[i].y,
                rotate: FRAGMENTS[i].r,
                opacity: 0,
              } : {
                x: 0,
                y: 0,
                rotate: 0,
                opacity: rebuilt ? 0 : 1,
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>

        {/* PROMESA word - assembles */}
        <motion.div
          className="absolute"
          initial={{ opacity: 0 }}
          animate={rebuilt ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {"PROMESA".split("").map((letter, i) => (
            <motion.span
              key={`p-${i}`}
              className="inline-block font-serif text-5xl font-bold md:text-6xl"
              style={{ color: "#B00002" }}
              initial={{ opacity: 0, y: -30 }}
              animate={rebuilt ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
              transition={{
                duration: 0.5,
                delay: 0.1 + i * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>

        {/* Hint */}
        <motion.p
          className="absolute bottom-3 left-0 right-0 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-mute"
          animate={shattered ? { opacity: 0 } : { opacity: 0.6 }}
        >
          hover para fracturar
        </motion.p>
      </div>
    </div>
  );
}
