"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface PostItem {
  id: string;
  title: string;
  category: string;
  description: string;
}

interface Props {
  posts: PostItem[];
}

export default function CommandPalette({ posts }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const filtered = query.trim()
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : posts;

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setActive(0);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((v) => Math.min(v + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((v) => Math.max(v - 1, 0));
    }
    if (e.key === "Enter" && filtered[active]) {
      window.location.href = `/blog/${filtered[active].id}`;
      close();
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Global hint (desktop only) */}
      <style>{`
        .cmd-k-hint {
          display: none;
        }
        @media (min-width: 768px) {
          .cmd-k-hint { display: flex; }
        }
      `}</style>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={close}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9998,
                background: "rgba(10,10,10,0.85)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingTop: "10vh",
                paddingInline: "1rem",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
                style={{
                  width: "100%",
                  maxWidth: 580,
                  background: "var(--color-surface)",
                  border: "1px solid rgba(227, 6, 19,0.2)",
                  overflow: "hidden",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
                }}
                role="dialog"
                aria-label="Buscar artículos"
                aria-modal="true"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.875rem 1rem",
                    borderBottom: "1px solid var(--color-line)",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--color-mute)", flexShrink: 0 }} aria-hidden="true">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                    placeholder="Buscar en el archivo..."
                    aria-label="Buscar artículos"
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.95rem",
                      color: "var(--color-bone)",
                      caretColor: "var(--color-neon)",
                    }}
                  />
                  <kbd
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      padding: "2px 6px",
                      border: "1px solid var(--color-line)",
                      color: "var(--color-mute)",
                      lineHeight: 1.6,
                    }}
                  >
                    ESC
                  </kbd>
                </div>

                {filtered.length > 0 ? (
                  <ul
                    style={{
                      listStyle: "none",
                      margin: 0,
                      padding: "0.4rem 0",
                      maxHeight: "60vh",
                      overflowY: "auto",
                    }}
                    role="listbox"
                  >
                    {filtered.map((post, i) => (
                      <li key={post.id} role="option" aria-selected={i === active}>
                        <a
                          href={`/blog/${post.id}`}
                          onClick={close}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.75rem",
                            padding: "0.7rem 1rem",
                            textDecoration: "none",
                            background: i === active ? "rgba(227, 6, 19,0.05)" : "transparent",
                            borderLeft: i === active ? "2px solid var(--color-neon)" : "2px solid transparent",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={() => setActive(i)}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 9,
                              textTransform: "uppercase",
                              letterSpacing: "0.2em",
                              color: "var(--color-neon)",
                              flexShrink: 0,
                              marginTop: 3,
                            }}
                          >
                            {post.category}
                          </span>
                          <div>
                            <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-bone)", margin: 0, lineHeight: 1.3 }}>
                              {post.title}
                            </p>
                            <p style={{ fontSize: "0.78rem", color: "var(--color-mute)", margin: "0.2rem 0 0", lineHeight: 1.4 }}>
                              {post.description.slice(0, 90)}{post.description.length > 90 ? "..." : ""}
                            </p>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ padding: "2rem 1rem", textAlign: "center", color: "var(--color-mute)", fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.3em" }}>
                    Sin resultados
                  </div>
                )}

                <div
                  style={{
                    padding: "0.5rem 1rem",
                    borderTop: "1px solid var(--color-line)",
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  {[["↑↓", "navegar"], ["↵", "ir"], ["esc", "cerrar"]].map(([key, label]) => (
                    <span key={key} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <kbd style={{ fontFamily: "var(--font-mono)", fontSize: 9, padding: "1px 4px", border: "1px solid var(--color-line)", color: "var(--color-mute)" }}>{key}</kbd>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-mute-dim)" }}>{label}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
