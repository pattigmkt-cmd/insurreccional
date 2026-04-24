"use client";

import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

/**
 * CSS-only lamp: conic gradient cone converging from top onto children.
 * No JS animation — static decorative element, always safe.
 */
export default function LampEffect({
  children,
  className = "",
  intensity = 1,
}: Props) {
  const opacity = Math.min(1, 0.18 * intensity);

  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      {/* Lamp cone */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "140%",
          maxWidth: "900px",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          background: `conic-gradient(
            from 268deg at 50% -8%,
            transparent 0deg,
            rgba(200,255,0,${opacity}) 8deg,
            rgba(200,255,0,${opacity * 0.55}) 25deg,
            transparent 45deg
          )`,
          filter: "blur(24px)",
        }}
      />
      {/* Softer inner cone */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          maxWidth: "500px",
          height: "60%",
          pointerEvents: "none",
          zIndex: 0,
          background: `conic-gradient(
            from 271deg at 50% -4%,
            transparent 0deg,
            rgba(200,255,0,${opacity * 0.6}) 5deg,
            rgba(200,255,0,${opacity * 0.25}) 18deg,
            transparent 30deg
          )`,
          filter: "blur(12px)",
        }}
      />
      {/* Ground glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          maxWidth: "400px",
          height: "1px",
          background: `rgba(200,255,0,${opacity * 0.9})`,
          boxShadow: `0 0 40px 20px rgba(200,255,0,${opacity * 0.4})`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
