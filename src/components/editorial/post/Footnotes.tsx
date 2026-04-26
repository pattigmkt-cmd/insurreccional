"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCoarsePointer } from "../../../lib/useCoarsePointer";

interface Props {
  n: number;
  children: React.ReactNode;
}

export default function Footnote({ n, children }: Props) {
  const coarse = useCoarsePointer();
  const [visible, setVisible] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={btnRef}
        aria-label={`Nota al pie ${n}`}
        onClick={() => setVisible((v) => !v)}
        onMouseEnter={() => !coarse && setVisible(true)}
        onMouseLeave={() => !coarse && setVisible(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: "1px solid rgba(176, 0, 2,0.4)",
          background: "rgba(176, 0, 2,0.06)",
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: "var(--color-neon)",
          cursor: "pointer",
          verticalAlign: "super",
          lineHeight: 1,
          position: "relative",
          transition: "background 0.2s",
          marginLeft: "1px",
        }}
      >
        {n}

        <AnimatePresence>
          {visible && (
            <motion.span
              role="tooltip"
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute",
                bottom: "calc(100% + 8px)",
                left: "50%",
                transform: "translateX(-50%)",
                background: "var(--color-surface)",
                border: "1px solid rgba(176, 0, 2,0.2)",
                padding: "0.6rem 0.75rem",
                width: "max-content",
                maxWidth: 260,
                minWidth: 160,
                fontSize: "0.78rem",
                lineHeight: 1.55,
                color: "var(--color-bone-soft)",
                fontFamily: "var(--font-sans)",
                textAlign: "left",
                zIndex: 50,
                pointerEvents: "none",
                whiteSpace: "normal",
                verticalAlign: "unset",
                fontWeight: 400,
                letterSpacing: 0,
                textTransform: "none",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: -5,
                  left: "50%",
                  transform: "translateX(-50%) rotate(45deg)",
                  width: 8,
                  height: 8,
                  background: "var(--color-surface)",
                  borderRight: "1px solid rgba(176, 0, 2,0.2)",
                  borderBottom: "1px solid rgba(176, 0, 2,0.2)",
                }}
              />
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </>
  );
}
