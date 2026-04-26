"use client";

import { useLowMotion } from "../../../lib/useLowMotion";

interface Props {
  className?: string;
  color?: string;
  amplitude?: number;
}

export default function WavyBackground({
  className = "",
  color = "#B00002",
  amplitude = 18,
}: Props) {
  const low = useLowMotion();

  const waves = [
    { opacity: 0.04, delay: "0s", duration: "14s" },
    { opacity: 0.06, delay: "2s", duration: "18s" },
    { opacity: 0.03, delay: "4s", duration: "22s" },
  ];

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "180px", overflow: "hidden", pointerEvents: "none" }}
    >
      {!low && (
        <style>{`
          @keyframes wave-move {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      )}
      {waves.map((w, i) => (
        <svg
          key={i}
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            bottom: i * 12,
            left: 0,
            width: low ? "100%" : "200%",
            height: 80,
            opacity: w.opacity,
            animation: low ? undefined : `wave-move ${w.duration} linear ${w.delay} infinite`,
          }}
        >
          <path
            d={`M0,40 C180,${40 - amplitude} 360,${40 + amplitude} 540,40 C720,${40 - amplitude} 900,${40 + amplitude} 1080,40 C1260,${40 - amplitude} 1350,${40 + amplitude} 1440,40 L1440,80 L0,80 Z`}
            fill={color}
          />
        </svg>
      ))}
    </div>
  );
}
