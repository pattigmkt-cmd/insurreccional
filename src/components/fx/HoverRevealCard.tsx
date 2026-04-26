"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCoarsePointer } from "../../lib/useCoarsePointer";
import { useLowMotion } from "../../lib/useLowMotion";

interface Props {
  title: string;
  subtitle?: string;
  description: string;
  href: string;
  accent?: string;
  category?: string;
  meta?: string;
  className?: string;
}

export default function HoverRevealCard({
  title,
  subtitle,
  description,
  href,
  accent = "#e30613",
  category,
  meta,
  className = "",
}: Props) {
  const coarse = useCoarsePointer();
  const low = useLowMotion();
  const [hovered, setHovered] = useState(false);

  const showOverlay = coarse || low ? true : hovered;

  return (
    <a
      href={href}
      className={`group relative flex flex-col overflow-hidden border border-line bg-surface/60 transition-colors hover:border-neon/40 ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Leer: ${title}`}
    >
      <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
        {/* Top meta */}
        <div className="flex items-center justify-between gap-3">
          {category && (
            <span
              className="border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em]"
              style={{ borderColor: `${accent}40`, color: accent }}
            >
              {category}
            </span>
          )}
          {meta && (
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
              {meta}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="font-serif text-sm italic text-mute">· {subtitle}</p>
        )}

        <h3 className="font-serif text-xl font-bold leading-tight text-bone transition-colors group-hover:text-neon sm:text-2xl">
          {title}
        </h3>

        {/* Description: always visible on mobile, revealed on desktop hover */}
        {(coarse || low) ? (
          <p className="mt-1 flex-1 text-sm leading-relaxed text-mute">
            {description}
          </p>
        ) : (
          <AnimatePresence>
            {hovered && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="mt-1 flex-1 text-sm leading-relaxed text-mute"
              >
                {description}
              </motion.p>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Reveal overlay CTA */}
      {(coarse || low) ? (
        <div className="border-t border-line px-6 py-4 md:px-8">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.28em]"
            style={{ color: accent }}
          >
            Leer completo →
          </span>
        </div>
      ) : (
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="border-t border-neon/20 px-6 py-4 md:px-8"
              style={{ background: "rgba(227, 6, 19,0.04)" }}
            >
              <span
                className="font-mono text-[10px] uppercase tracking-[0.28em]"
                style={{ color: accent }}
              >
                Leer completo →
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </a>
  );
}
