"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  items: string[];
  className?: string;
  defaultOpen?: boolean;
}

export default function TLDRPanel({ items, className = "", defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={className}
      style={{
        border: "1px solid rgba(200,255,0,0.2)",
        background: "rgba(200,255,0,0.02)",
        marginBottom: "2.5rem",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.875rem 1.25rem",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "var(--color-neon)",
            }}
          >
            TL;DR
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "var(--color-mute)",
            }}
          >
            {items.length} puntos clave
          </span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "inline-block",
            color: "var(--color-neon)",
            fontSize: 12,
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          ↓
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: "0.5rem 1.25rem 1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              {items.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.75rem",
                    fontSize: "0.9rem",
                    color: "var(--color-bone-soft)",
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      color: "var(--color-neon)",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
