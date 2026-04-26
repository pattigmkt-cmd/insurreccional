"use client";

import { useRef, useState } from "react";
import { useCoarsePointer } from "../../lib/useCoarsePointer";

interface Props {
  children: React.ReactNode;
  className?: string;
  zoomFactor?: number;
  lensSize?: number;
}

export default function Lens({
  children,
  className = "",
  zoomFactor = 1.8,
  lensSize = 100,
}: Props) {
  const coarse = useCoarsePointer();
  const containerRef = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setLens({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  if (coarse) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", overflow: "hidden", display: "inline-block" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setLens(null)}
    >
      {children}

      {lens && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: lens.x - lensSize / 2,
            top: lens.y - lensSize / 2,
            width: lensSize,
            height: lensSize,
            borderRadius: "50%",
            overflow: "hidden",
            pointerEvents: "none",
            border: "1px solid rgba(176, 0, 2,0.3)",
            boxShadow: "0 0 20px rgba(176, 0, 2,0.15)",
            zIndex: 10,
          }}
        >
          <div
            style={{
              transform: `scale(${zoomFactor}) translate(${(lensSize / 2 - lens.x) / zoomFactor + lensSize / 2 / zoomFactor}px, ${(lensSize / 2 - lens.y) / zoomFactor + lensSize / 2 / zoomFactor}px)`,
              transformOrigin: "0 0",
              width: `${100 / zoomFactor * zoomFactor}%`,
              height: `${100 / zoomFactor * zoomFactor}%`,
              position: "absolute",
              inset: `-${(lensSize * (zoomFactor - 1)) / 2}px`,
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
