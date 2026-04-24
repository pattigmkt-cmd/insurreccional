"use client";

import { motion } from "framer-motion";

interface Props {
  className?: string;
}

export default function AuthorBio({ className = "" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        border: "1px solid var(--color-line)",
        background: "var(--color-surface)",
        padding: "2rem",
        marginTop: "3rem",
      }}
    >
      {/* Subtle neon border accent */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          border: "1px solid rgba(200,255,0,0.12)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "1.25rem",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* Avatar placeholder */}
        <div
          aria-hidden="true"
          style={{
            flexShrink: 0,
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: "1px solid var(--color-neon)",
            background: "var(--color-ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
            <rect width="64" height="64" fill="var(--color-ink)" />
            <circle cx="32" cy="24" r="13" fill="var(--color-line)" />
            <ellipse cx="32" cy="58" rx="22" ry="18" fill="var(--color-line)" />
            <circle cx="32" cy="24" r="11" fill="rgba(200,255,0,0.06)" />
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: "200px" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "var(--color-neon)",
              marginBottom: "0.4rem",
            }}
          >
            Sobre quien escribe
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--color-bone)",
              marginBottom: "0.5rem",
            }}
          >
            Dominique Alexia
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              lineHeight: 1.6,
              color: "var(--color-bone-soft)",
              maxWidth: "520px",
            }}
          >
            Once años construyendo criterio de marca desde adentro de la industria.
            Consultora, escritora editorial. Nunca vendió un curso, nunca va a vender uno.
          </p>
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/manifiesto"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.28em",
                color: "var(--color-neon)",
                textDecoration: "none",
              }}
            >
              Leer el manifiesto
            </a>
            <a
              href="/blog"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.28em",
                color: "var(--color-mute)",
                textDecoration: "none",
              }}
            >
              Ver el archivo
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
