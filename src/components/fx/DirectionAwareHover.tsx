"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCoarsePointer } from "../../lib/useCoarsePointer";

interface Props {
  children: React.ReactNode;
  overlay: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

type Direction = "top" | "right" | "bottom" | "left";

function getDirection(e: React.MouseEvent, el: HTMLElement): Direction {
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  const angle = Math.atan2(y, x) * (180 / Math.PI);
  if (angle > -45 && angle <= 45) return "right";
  if (angle > 45 && angle <= 135) return "bottom";
  if (angle > 135 || angle <= -135) return "left";
  return "top";
}

const variants: Record<Direction, { initial: object; animate: object; exit: object }> = {
  top:    { initial: { y: "-100%", opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: "-100%", opacity: 0 } },
  bottom: { initial: { y: "100%",  opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: "100%",  opacity: 0 } },
  left:   { initial: { x: "-100%", opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: "-100%", opacity: 0 } },
  right:  { initial: { x: "100%",  opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: "100%",  opacity: 0 } },
};

export default function DirectionAwareHover({ children, overlay, className = "", style }: Props) {
  const coarse = useCoarsePointer();
  const ref = useRef<HTMLDivElement>(null);
  const [dir, setDir] = useState<Direction | null>(null);

  const onEnter = (e: React.MouseEvent) => {
    if (coarse || !ref.current) return;
    setDir(getDirection(e, ref.current));
  };

  const onLeave = (e: React.MouseEvent) => {
    if (coarse || !ref.current) return;
    setDir(null);
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      {children}

      <AnimatePresence>
        {dir && (
          <motion.div
            key={dir}
            initial={variants[dir].initial}
            animate={variants[dir].animate}
            exit={variants[dir].exit}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10,10,10,0.88)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
            }}
          >
            {overlay}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
