"use client";

import { useRef } from "react";
import { motion, useSpring } from "framer-motion";
import { useCoarsePointer } from "../../lib/useCoarsePointer";

interface Props {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export default function WobbleCard({ children, className = "", intensity = 8 }: Props) {
  const coarse = useCoarsePointer();
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (coarse || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    rotateX.set(-y * intensity);
    rotateY.set(x * intensity);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: coarse ? 0 : rotateX,
        rotateY: coarse ? 0 : rotateY,
        transformStyle: "preserve-3d",
        perspective: "800px",
      }}
    >
      {children}
    </motion.div>
  );
}
