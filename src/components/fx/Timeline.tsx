"use client";

import { motion } from "framer-motion";
import { useLowMotion } from "../../lib/useLowMotion";

interface TimelineItem {
  num: string;
  title: string;
  description: string;
  status: "active" | "pending" | "done";
}

interface Props {
  items: TimelineItem[];
  className?: string;
}

export default function Timeline({ items, className = "" }: Props) {
  const low = useLowMotion();

  const statusColor = (status: TimelineItem["status"]) => {
    if (status === "active") return "#e30613";
    if (status === "done") return "#e30613";
    return "#333333";
  };

  const statusLabel = (status: TimelineItem["status"]) => {
    if (status === "active") return "Disponible ahora";
    if (status === "done") return "Completado";
    return "En preparación";
  };

  return (
    <div className={`relative ${className}`}>
      {/* Vertical rail */}
      <div
        aria-hidden="true"
        className="absolute left-[19px] top-4 hidden h-[calc(100%-2rem)] w-px bg-line md:left-[23px] md:block"
      />

      {/* Animated fill */}
      {!low && (
        <motion.div
          aria-hidden="true"
          className="absolute left-[19px] top-4 hidden w-px origin-top md:left-[23px] md:block"
          style={{ background: "linear-gradient(to bottom, #e30613, rgba(227, 6, 19,0.3))" }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <div style={{ height: "calc(100vh)" }} />
        </motion.div>
      )}

      <div className="space-y-10 md:space-y-12">
        {items.map((item, i) => {
          const color = statusColor(item.status);
          return (
            <motion.div
              key={i}
              className="flex gap-6 md:gap-8"
              initial={low ? undefined : { opacity: 0, x: -16 }}
              animate={!low ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Node */}
              <div className="relative flex flex-col items-center" style={{ flexShrink: 0 }}>
                <div
                  className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300"
                  style={{
                    borderColor: color,
                    background: item.status === "active" ? `${color}18` : "var(--color-ink, #0a0a0a)",
                    boxShadow: item.status === "active" ? `0 0 16px ${color}50` : "none",
                  }}
                >
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{ color }}
                  >
                    {item.num}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="pb-2 pt-1">
                <div className="flex flex-wrap items-baseline gap-4 mb-3">
                  <h3 className="font-serif text-2xl font-bold text-bone md:text-3xl">
                    {item.title}
                  </h3>
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.25em]"
                    style={{ color }}
                  >
                    {statusLabel(item.status)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-bone-soft md:text-base">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
