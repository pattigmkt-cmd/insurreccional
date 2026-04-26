"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function ShimmerButton({ children, href, onClick, className = "" }: Props) {
  const content = (
    <span className="relative z-10 flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-ink">
      {children}
    </span>
  );

  const styles: React.CSSProperties = {
    position: "relative",
    padding: "12px 28px",
    background: "#e30613",
    overflow: "hidden",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const shimmerVariants = {
    rest: { x: "-120%", skewX: -20 },
    hover: { x: "220%", skewX: -20, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  if (href) {
    return (
      <motion.a
        href={href}
        style={styles}
        className={className}
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.97 }}
      >
        <motion.span
          variants={shimmerVariants}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "40%",
            background: "rgba(255,255,255,0.25)",
            filter: "blur(4px)",
            pointerEvents: "none",
          }}
        />
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      style={styles}
      className={className}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
    >
      <motion.span
        variants={shimmerVariants}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "40%",
          background: "rgba(255,255,255,0.25)",
          filter: "blur(4px)",
          pointerEvents: "none",
        }}
      />
      {content}
    </motion.button>
  );
}
