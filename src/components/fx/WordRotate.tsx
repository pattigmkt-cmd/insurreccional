"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

interface Props {
  words: string[];
  interval?: number;
  className?: string;
}

export default function WordRotate({ words, interval = 2200, className = "" }: Props) {
  const low = useLowMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (low) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [low, words.length, interval]);

  if (low) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span className={`inline-block overflow-hidden ${className}`} style={{ verticalAlign: "bottom" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "block" }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
