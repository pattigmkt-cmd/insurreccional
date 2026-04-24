"use client";

import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useCoarsePointer } from "../../lib/useCoarsePointer";
import { useLowMotion } from "../../lib/useLowMotion";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const coarse = useCoarsePointer();
  const low = useLowMotion();
  const ref = useRef<HTMLButtonElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 200, damping: 18 });
  const y = useSpring(rawY, { stiffness: 200, damping: 18 });

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        setVisible(pct > 0.3);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (coarse || low || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawX.set((e.clientX - cx) * 0.3);
    rawY.set((e.clientY - cy) * 0.3);
  };

  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          ref={ref}
          onClick={handleClick}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={coarse || low ? undefined : { x, y }}
          className="fixed bottom-8 right-6 z-50 flex h-11 w-11 items-center justify-center border border-line bg-ink text-bone transition-colors hover:border-neon/60 hover:text-neon sm:bottom-10 sm:right-8"
          aria-label="Volver al inicio de la página"
        >
          <span aria-hidden="true" className="font-mono text-sm leading-none">↑</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
