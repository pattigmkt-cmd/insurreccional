"use client";

import { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { useCoarsePointer } from "../../lib/useCoarsePointer";

interface Props {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export default function PinContainer({ children, className = "", containerClassName = "" }: Props) {
  const coarse = useCoarsePointer();
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rotateX = useSpring(0, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 22 });
  const scale = useSpring(1, { stiffness: 200, damping: 20 });
  const translateZ = useSpring(0, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (coarse || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    rotateX.set(-y * 12);
    rotateY.set(x * 12);
  };

  const handleEnter = () => {
    if (coarse) return;
    setHovered(true);
    scale.set(1.04);
    translateZ.set(30);
  };

  const handleLeave = () => {
    if (coarse) return;
    setHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    translateZ.set(0);
  };

  return (
    <div
      ref={ref}
      className={containerClassName}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className={className}
        style={{
          rotateX: coarse ? 0 : rotateX,
          rotateY: coarse ? 0 : rotateY,
          scale: coarse ? 1 : scale,
          translateZ: coarse ? 0 : translateZ,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
        {hovered && !coarse && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at center, rgba(176, 0, 2,0.04) 0%, transparent 70%)",
              pointerEvents: "none",
              borderRadius: "inherit",
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
