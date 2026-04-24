"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { type ReactNode } from "react";
import { useCoarsePointer } from "../../lib/useCoarsePointer";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function SpotlightCard({ children, className = "" }: Props) {
  const coarse = useCoarsePointer();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const spotX = useTransform(mouseX, (v) => `${v}px`);
  const spotY = useTransform(mouseY, (v) => `${v}px`);

  if (coarse) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMove}
    >
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,255,0,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          left: spotX,
          top: spotY,
          transform: "translate(-50%, -50%)",
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </motion.div>
  );
}
