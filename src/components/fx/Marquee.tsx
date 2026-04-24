"use client";

import { type ReactNode } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

interface Props {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  gap?: number;
}

export default function Marquee({
  children,
  speed = 40,
  reverse = false,
  pauseOnHover = true,
  className = "",
  gap = 48,
}: Props) {
  const low = useLowMotion();

  const duration = `${100 / (speed / 10)}s`;
  const direction = reverse ? "reverse" : "normal";

  return (
    <div
      className={`flex overflow-hidden ${className}`}
      style={{ gap: `${gap}px` }}
      role="marquee"
      aria-label="Texto deslizante"
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          style={{
            display: "flex",
            flexShrink: 0,
            alignItems: "center",
            gap: `${gap}px`,
            animation: low ? "none" : `marquee-scroll ${duration} linear infinite ${direction}`,
          }}
          className={pauseOnHover ? "marquee-track" : ""}
        >
          {children}
        </div>
      ))}
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-100% - ${gap}px)); }
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="marquee-scroll"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
