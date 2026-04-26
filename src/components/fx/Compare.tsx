"use client";

import { useRef, useState, useCallback } from "react";

interface Props {
  before: React.ReactNode;
  after: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  initialPosition?: number;
}

export default function Compare({
  before,
  after,
  beforeLabel = "Antes",
  afterLabel = "Después",
  className = "",
  initialPosition = 50,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(initialPosition);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setPos(x * 100);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    updatePos(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    updatePos(e.clientX);
  };

  const onMouseUp = () => { dragging.current = false; };

  const onTouchMove = (e: React.TouchEvent) => {
    updatePos(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
      style={{
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
        cursor: "ew-resize",
        touchAction: "none",
      }}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      aria-label="Comparador antes/después"
    >
      {/* After (full) */}
      <div style={{ position: "relative" }}>{after}</div>

      {/* Before (clipped) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
        }}
      >
        {before}
      </div>

      {/* Handle */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${pos}%`,
          transform: "translateX(-50%)",
          width: 2,
          background: "var(--color-neon)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--color-neon)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 12px rgba(227, 6, 19,0.5)",
          }}
        >
          <span style={{ color: "var(--color-ink)", fontSize: 12, fontWeight: 700 }}>⇔</span>
        </div>
      </div>

      {/* Labels */}
      <span
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "var(--color-neon)",
          background: "rgba(10,10,10,0.8)",
          padding: "2px 6px",
          pointerEvents: "none",
        }}
      >
        {beforeLabel}
      </span>
      <span
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "var(--color-bone-soft)",
          background: "rgba(10,10,10,0.8)",
          padding: "2px 6px",
          pointerEvents: "none",
        }}
      >
        {afterLabel}
      </span>
    </div>
  );
}
