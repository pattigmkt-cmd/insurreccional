"use client";

import { useLowMotion } from "../../../lib/useLowMotion";

interface Props {
  text: string;
  className?: string;
}

export default function GooeyText({ text, className = "" }: Props) {
  const low = useLowMotion();

  const svgId = `gooey-filter-${text.replace(/\s/g, "")}`;

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        position: "relative",
        filter: low ? undefined : `url(#${svgId})`,
      }}
    >
      {!low && (
        <svg
          aria-hidden="true"
          style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
        >
          <defs>
            <filter id={svgId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
                result="gooey"
              />
              <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
            </filter>
          </defs>
        </svg>
      )}
      <span
        style={{
          display: "inline-block",
          animation: low ? undefined : "gooey-pulse 3s ease-in-out infinite alternate",
        }}
      >
        {text}
      </span>
      {!low && (
        <style>{`
          @keyframes gooey-pulse {
            0% { letter-spacing: -0.02em; }
            50% { letter-spacing: 0.04em; }
            100% { letter-spacing: -0.01em; }
          }
        `}</style>
      )}
    </span>
  );
}
