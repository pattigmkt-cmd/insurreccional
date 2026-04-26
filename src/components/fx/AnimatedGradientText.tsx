"use client";

import { type ReactNode } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

interface Props {
  children: ReactNode;
  colors?: string[];
  className?: string;
  speed?: number;
}

export default function AnimatedGradientText({
  children,
  colors = ["#e30613", "#b00002", "#ff2d3a", "#e30613"],
  className = "",
  speed = 4,
}: Props) {
  const low = useLowMotion();

  const gradient = `conic-gradient(from var(--agt-angle, 0deg), ${colors.join(", ")})`;
  const fallbackColor = colors[0];

  if (low) {
    return (
      <span
        className={className}
        style={{ color: fallbackColor }}
      >
        {children}
      </span>
    );
  }

  return (
    <>
      <span
        className={`agt-text ${className}`}
        style={{
          backgroundImage: gradient,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          backgroundSize: "200% 200%",
        }}
      >
        {children}
      </span>
      <style>{`
        @property --agt-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        .agt-text {
          animation: agt-rotate ${speed}s linear infinite;
        }
        @keyframes agt-rotate {
          from { --agt-angle: 0deg; }
          to   { --agt-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .agt-text { animation: none !important; }
        }
      `}</style>
    </>
  );
}
