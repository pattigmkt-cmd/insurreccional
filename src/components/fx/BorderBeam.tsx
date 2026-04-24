"use client";

import { useLowMotion } from "../../lib/useLowMotion";

interface Props {
  className?: string;
  size?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
}

export default function BorderBeam({
  className = "",
  size = 180,
  duration = 3,
  colorFrom = "transparent",
  colorTo = "#c8ff00",
  borderWidth = 1,
}: Props) {
  const low = useLowMotion();

  if (low) {
    return (
      <span
        aria-hidden="true"
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          border: `${borderWidth}px solid rgba(200,255,0,0.3)`,
          pointerEvents: "none",
        }}
      />
    );
  }

  const beamId = `beam-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <>
      <span
        aria-hidden="true"
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          border: `${borderWidth}px solid rgba(255,255,255,0.06)`,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background: `conic-gradient(from var(--beam-angle, 0deg) at 50% 50%, ${colorFrom} 0%, ${colorTo} 10%, ${colorFrom} 20%)`,
            animation: `border-beam-rotate ${duration}s linear infinite`,
            maskImage: `linear-gradient(white, white) padding-box, linear-gradient(white, white) border-box`,
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      </span>
      <style>{`
        @property --beam-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes border-beam-rotate {
          to { --beam-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes border-beam-rotate { to { --beam-angle: 0deg; } }
        }
      `}</style>
    </>
  );
}
