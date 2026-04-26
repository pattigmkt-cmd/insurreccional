"use client";

import { useLowMotion } from "../../../lib/useLowMotion";

interface Props {
  className?: string;
  count?: number;
}

const BEAMS = [
  { angle: -35, left: "10%", width: "1px", color: "rgba(227, 6, 19,0.15)", duration: "8s", delay: "0s" },
  { angle: -35, left: "28%", width: "2px", color: "rgba(227, 6, 19,0.08)", duration: "12s", delay: "1.5s" },
  { angle: -35, left: "48%", width: "1px", color: "rgba(155,200,0,0.12)", duration: "10s", delay: "0.8s" },
  { angle: -35, left: "68%", width: "2px", color: "rgba(227, 6, 19,0.06)", duration: "14s", delay: "2s" },
  { angle: -35, left: "85%", width: "1px", color: "rgba(227, 6, 19,0.1)", duration: "9s", delay: "0.3s" },
];

export default function Beams({ className = "", count = 5 }: Props) {
  const low = useLowMotion();

  if (low) return null;

  const beams = BEAMS.slice(0, Math.min(count, BEAMS.length));

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}
    >
      <style>{`
        @keyframes beam-slide {
          0% { transform: translateY(-120%) rotate(var(--beam-angle)); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(120%) rotate(var(--beam-angle)); opacity: 0; }
        }
      `}</style>
      {beams.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: b.left,
            width: b.width,
            height: "200%",
            background: `linear-gradient(to bottom, transparent 0%, ${b.color} 30%, ${b.color} 70%, transparent 100%)`,
            animation: `beam-slide ${b.duration} ease-in-out ${b.delay} infinite`,
            ["--beam-angle" as string]: `${b.angle}deg`,
            transform: `rotate(${b.angle}deg)`,
            transformOrigin: "top center",
          }}
        />
      ))}
    </div>
  );
}
