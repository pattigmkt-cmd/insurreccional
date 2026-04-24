"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { useCoarsePointer } from "../../lib/useCoarsePointer";
import { useLowMotion } from "../../lib/useLowMotion";

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_+[]{}|<>";

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

interface Props {
  children: ReactNode;
  className?: string;
  /**
   * If true, the card takes full width and the bg chars
   * are sized more loosely for a "gigante" look.
   */
  large?: boolean;
}

export default function EvervaultCard({ children, className = "", large = false }: Props) {
  const coarse = useCoarsePointer();
  const low = useLowMotion();
  const [hovered, setHovered] = useState(false);
  const [chars, setChars] = useState<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const COLS = large ? 18 : 12;
  const ROWS = large ? 6 : 5;
  const total = COLS * ROWS;

  useEffect(() => {
    if (low || coarse) return;
    setChars(Array.from({ length: total }, randomChar));
  }, [low, coarse, total]);

  useEffect(() => {
    if (low || coarse) return;

    if (hovered) {
      intervalRef.current = setInterval(() => {
        setChars((prev) =>
          prev.map((c) => (Math.random() < 0.18 ? randomChar() : c))
        );
      }, 60);
    } else {
      intervalRef.current = setInterval(() => {
        setChars((prev) =>
          prev.map((c) => (Math.random() < 0.08 ? randomChar() : c))
        );
      }, 80);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hovered, low, coarse]);

  if (low || coarse) {
    return (
      <div
        className={`relative overflow-hidden border border-line bg-surface/40 p-8 ${className}`}
      >
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden border border-line bg-surface/40 transition-colors duration-300 ${hovered ? "border-neon/30" : ""} ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Matrix background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid select-none overflow-hidden p-4"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          opacity: hovered ? 0.07 : 0.13,
          transition: "opacity 0.4s ease",
        }}
      >
        {chars.map((c, i) => (
          <span
            key={i}
            className="font-mono text-neon"
            style={{
              fontSize: large ? "11px" : "10px",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {c}
          </span>
        ))}
      </div>

      {/* Content */}
      <div
        className="relative z-10 p-8 transition-opacity duration-300"
        style={{ opacity: hovered ? 1 : 0.72 }}
      >
        {children}
      </div>
    </div>
  );
}
