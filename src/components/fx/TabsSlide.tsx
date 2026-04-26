"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLowMotion } from "../../lib/useLowMotion";

interface Tab {
  label: string;
  value: string;
}

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function TabsSlide({ tabs, active, onChange, className = "" }: Props) {
  const low = useLowMotion();

  return (
    <div
      role="tablist"
      aria-label="Filtro de categorías"
      className={`flex flex-wrap items-center gap-1 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === active;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className="relative px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon"
            style={{
              color: isActive ? "#0a0a0a" : "#888888",
            }}
          >
            {!low && isActive && (
              <motion.span
                layoutId="tabs-slide-indicator"
                className="absolute inset-0"
                style={{ background: "#B00002" }}
                transition={{ type: "spring", stiffness: 340, damping: 30 }}
              />
            )}
            {low && isActive && (
              <span className="absolute inset-0 bg-neon" />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
