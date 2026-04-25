"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLowMotion } from "../../lib/useLowMotion";

interface Level {
  label: string;
  example: string;
}

interface Props {
  levels: Level[];
}

export default function PromesaEspecifica({ levels }: Props) {
  const low = useLowMotion();
  const [active, setActive] = useState(0);

  const pct = (active / Math.max(levels.length - 1, 1)) * 100;

  // Color interpolation: gray -> neon
  const neonRgb = [200, 255, 0];
  const grayRgb = [60, 60, 60];
  const t = active / Math.max(levels.length - 1, 1);
  const r = Math.round(grayRgb[0] + (neonRgb[0] - grayRgb[0]) * t);
  const g = Math.round(grayRgb[1] + (neonRgb[1] - grayRgb[1]) * t);
  const b = Math.round(grayRgb[2] + (neonRgb[2] - grayRgb[2]) * t);
  const color = `rgb(${r},${g},${b})`;

  return (
    <div className="my-10 rounded border border-line bg-[#0d0d0d] p-6 md:my-14 md:p-8">
      <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
        Escala de especificidad
      </p>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2" role="tablist">
        {levels.map((level, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              className="relative px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors"
              style={{ color: isActive ? "#0a0a0a" : "#555" }}
            >
              {!low && isActive && (
                <motion.span
                  layoutId="promesa-indicator"
                  className="absolute inset-0 rounded-sm"
                  style={{ background: color }}
                  transition={{ type: "spring", stiffness: 340, damping: 30 }}
                />
              )}
              {low && isActive && (
                <span className="absolute inset-0 rounded-sm" style={{ background: color }} />
              )}
              <span className="relative z-10">{level.label}</span>
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-[3px] w-full rounded-full bg-[#1a1a1a]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: low ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Example */}
      <div className="min-h-[72px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={low ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={low ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-xl leading-relaxed italic md:text-2xl"
            style={{ color }}
          >
            {levels[active].example}
          </motion.p>
        </AnimatePresence>
      </div>

      <p className="mt-4 font-mono text-[9px] tracking-[0.2em] text-mute">
        Nivel {active + 1} de {levels.length} · {active === levels.length - 1 ? "esto filtra, compromete, incomoda" : "seguí a la derecha"}
      </p>
    </div>
  );
}
