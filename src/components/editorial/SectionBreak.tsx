"use client";

import { motion } from "framer-motion";
import { useLowMotion } from "../../lib/useLowMotion";

export default function SectionBreak() {
  const low = useLowMotion();

  if (low) {
    return (
      <div className="my-16 flex items-center justify-center gap-4" aria-hidden="true">
        <span className="h-[1px] w-16 bg-line" />
        <span className="font-mono text-[10px] tracking-[0.5em] text-mute">· · ·</span>
        <span className="h-[1px] w-16 bg-line" />
      </div>
    );
  }

  return (
    <div className="my-16 flex items-center justify-center gap-5" aria-hidden="true">
      <span className="h-[1px] flex-1 bg-line opacity-40" />
      <div className="flex items-center gap-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-[6px] w-[6px] rounded-full"
            style={{ background: "#B00002" }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="h-[1px] flex-1 bg-line opacity-40" />
    </div>
  );
}
