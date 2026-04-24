"use client";

import { useRef, useState } from "react";
import { useCoarsePointer } from "../../../lib/useCoarsePointer";

interface Props {
  text: string;
  className?: string;
  highlightColor?: string;
  radius?: number;
}

export default function TextHoverEffect({
  text,
  className = "",
  highlightColor = "#c8ff00",
  radius = 80,
}: Props) {
  const coarse = useCoarsePointer();
  const containerRef = useRef<HTMLSpanElement>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  if (coarse) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      ref={containerRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouse(null)}
      style={{ display: "inline", cursor: "default" }}
    >
      {text.split("").map((char, i) => {
        let dist = Infinity;
        if (mouse && containerRef.current) {
          // Approximate letter position via character index
          const totalChars = text.length;
          const containerWidth = containerRef.current.offsetWidth;
          const charX = (i / totalChars) * containerWidth;
          const charY = containerRef.current.offsetHeight / 2;
          dist = Math.sqrt((mouse.x - charX) ** 2 + (mouse.y - charY) ** 2);
        }
        const inRadius = dist < radius;
        const intensity = inRadius ? Math.max(0, 1 - dist / radius) : 0;

        return (
          <span
            key={i}
            style={{
              color: inRadius
                ? `color-mix(in srgb, ${highlightColor} ${Math.round(intensity * 100)}%, currentColor)`
                : undefined,
              textShadow: inRadius
                ? `0 0 ${Math.round(intensity * 20)}px ${highlightColor}80`
                : undefined,
              transition: "color 0.15s ease, text-shadow 0.15s ease",
              display: "inline",
            }}
          >
            {char === " " ? " " : char}
          </span>
        );
      })}
    </span>
  );
}
