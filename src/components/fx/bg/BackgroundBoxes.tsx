"use client";

import { useState } from "react";
import { useCoarsePointer } from "../../../lib/useCoarsePointer";
import { useLowMotion } from "../../../lib/useLowMotion";

interface Props {
  className?: string;
  rows?: number;
  cols?: number;
}

const COLORS = [
  "rgba(227, 6, 19,0.15)",
  "rgba(155,200,0,0.1)",
  "rgba(227, 6, 19,0.08)",
  "rgba(136,136,136,0.06)",
];

export default function BackgroundBoxes({ className = "", rows = 8, cols = 16 }: Props) {
  const coarse = useCoarsePointer();
  const low = useLowMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  // On mobile/touch: render static subtle grid
  if (coarse || low) {
    return (
      <div
        aria-hidden="true"
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(227, 6, 19,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(227, 6, 19,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />
    );
  }

  const cells = Array.from({ length: rows * cols }, (_, i) => i);

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {cells.map((i) => {
        const key = String(i);
        const isHovered = hovered === key;
        return (
          <div
            key={i}
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
            style={{
              borderRight: "1px solid rgba(227, 6, 19,0.04)",
              borderBottom: "1px solid rgba(227, 6, 19,0.04)",
              background: isHovered ? COLORS[i % COLORS.length] : "transparent",
              transition: "background 0.3s ease",
              pointerEvents: "all",
            }}
          />
        );
      })}
    </div>
  );
}
