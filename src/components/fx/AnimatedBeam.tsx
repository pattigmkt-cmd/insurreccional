"use client";

import { useEffect, useRef, useState } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

interface Props {
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  containerRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  color?: string;
  duration?: number;
  delay?: number;
  curvature?: number;
}

export default function AnimatedBeam({
  fromRef,
  toRef,
  containerRef,
  className = "",
  color = "#B00002",
  duration = 3,
  delay = 0,
  curvature = 40,
}: Props) {
  const low = useLowMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const [path, setPath] = useState("");
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const pathId = useRef(`beam-path-${Math.random().toString(36).slice(2, 7)}`);

  useEffect(() => {
    if (low) return;

    const update = () => {
      if (!fromRef.current || !toRef.current || !svgRef.current) return;

      const container = containerRef?.current ?? svgRef.current.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();

      const x1 = fromRect.left - containerRect.left + fromRect.width / 2;
      const y1 = fromRect.top - containerRect.top + fromRect.height / 2;
      const x2 = toRect.left - containerRect.left + toRect.width / 2;
      const y2 = toRect.top - containerRect.top + toRect.height / 2;

      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2 - curvature;

      setPath(`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`);
      setDims({ w: containerRect.width, h: containerRect.height });
    };

    update();
    const ro = new ResizeObserver(update);
    if (fromRef.current) ro.observe(fromRef.current);
    if (toRef.current) ro.observe(toRef.current);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [low, fromRef, toRef, containerRef, curvature]);

  if (low || !path) return null;

  const pid = pathId.current;

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
      width={dims.w}
      height={dims.h}
    >
      <defs>
        <linearGradient id={`${pid}-grad`} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} stopOpacity={0} />
          <stop offset="50%" stopColor={color} stopOpacity={0.6} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Static path (dim) */}
      <path d={path} fill="none" stroke={color} strokeOpacity={0.08} strokeWidth={1} />

      {/* Animated beam */}
      <path
        id={pid}
        d={path}
        fill="none"
        stroke={`url(#${pid}-grad)`}
        strokeWidth={1.5}
        strokeLinecap="round"
        style={{
          strokeDasharray: "12 200",
          strokeDashoffset: 0,
          animation: `beam-travel-${pid} ${duration}s ease-in-out ${delay}s infinite`,
        }}
      />
      <style>{`
        @keyframes beam-travel-${pid} {
          0% { stroke-dashoffset: 200; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { stroke-dashoffset: -200; opacity: 0; }
        }
      `}</style>
    </svg>
  );
}
