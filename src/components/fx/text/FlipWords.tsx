"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLowMotion } from "../../../lib/useLowMotion";

interface Props {
  words: string[];
  interval?: number;
  className?: string;
}

export default function FlipWords({ words, interval = 2800, className = "" }: Props) {
  const low = useLowMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (low) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [low, words.length, interval]);

  if (low) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span
      className={className}
      style={{ display: "inline-block", position: "relative", overflow: "hidden", verticalAlign: "bottom" }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ rotateX: -90, opacity: 0, y: 10 }}
          animate={{ rotateX: 0, opacity: 1, y: 0 }}
          exit={{ rotateX: 90, opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-block", transformOrigin: "center bottom", transformStyle: "preserve-3d" }}
        >
          {words[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
