"use client";

import { useEffect, useRef } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

interface Props {
  count?: number;
  className?: string;
}

export default function Meteors({ count = 12, className = "" }: Props) {
  const low = useLowMotion();

  if (low) return null;

  const meteors = Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${Math.random() * 60}%`,
    left: `${Math.random() * 100}%`,
    duration: 1.2 + Math.random() * 1.6,
    delay: Math.random() * 4,
    size: 1 + Math.random() * 1.5,
    length: 80 + Math.random() * 120,
  }));

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {meteors.map((m) => (
        <span
          key={m.id}
          className="meteor"
          style={{
            position: "absolute",
            top: m.top,
            left: m.left,
            width: `${m.length}px`,
            height: `${m.size}px`,
            borderRadius: "999px",
            background: `linear-gradient(90deg, #e30613 0%, rgba(227, 6, 19,0.4) 40%, transparent 100%)`,
            transform: "rotate(-35deg)",
            opacity: 0,
            animation: `meteor-fall ${m.duration}s ${m.delay}s infinite linear`,
          }}
        />
      ))}
      <style>{`
        @keyframes meteor-fall {
          0%   { opacity: 0; transform: rotate(-35deg) translateX(0); }
          5%   { opacity: 0.9; }
          80%  { opacity: 0.5; }
          100% { opacity: 0; transform: rotate(-35deg) translateX(260px) translateY(160px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .meteor { animation: none !important; display: none; }
        }
      `}</style>
    </div>
  );
}
