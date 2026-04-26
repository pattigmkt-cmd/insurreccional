"use client";

import { motion } from "framer-motion";

export default function AboutPanel() {
  return (
    <section
      style={{
        position: "relative",
        borderTop: "1px solid var(--color-line)",
        borderBottom: "1px solid var(--color-line)",
        padding: "4rem 1rem",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 80% 50%, rgba(176, 0, 2,0.03) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "3rem",
          alignItems: "center",
        }}
      >
        {/* Photo/silhouette side */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              position: "relative",
              width: 200,
              height: 260,
              overflow: "hidden",
              border: "1px solid var(--color-line)",
            }}
          >
            {/* Editorial silhouette SVG */}
            <svg
              viewBox="0 0 200 260"
              width="200"
              height="260"
              aria-label="Dominique Alexia"
              style={{ display: "block" }}
            >
              <rect width="200" height="260" fill="var(--color-surface)" />
              {/* Body silhouette */}
              <ellipse cx="100" cy="78" rx="38" ry="44" fill="rgba(176, 0, 2,0.08)" />
              <ellipse cx="100" cy="78" rx="30" ry="36" fill="rgba(176, 0, 2,0.05)" />
              <path d="M28,260 Q40,160 100,140 Q160,160 172,260 Z" fill="rgba(176, 0, 2,0.06)" />
              {/* Neon accent lines */}
              <line x1="10" y1="240" x2="190" y2="240" stroke="rgba(176, 0, 2,0.15)" strokeWidth="1" />
              <line x1="10" y1="248" x2="120" y2="248" stroke="rgba(176, 0, 2,0.08)" strokeWidth="1" />
              {/* Monogram */}
              <text x="100" y="96" textAnchor="middle" fontFamily="Georgia,serif" fontSize="24" fontWeight="900" fill="rgba(176, 0, 2,0.3)">DA</text>
            </svg>
          </div>
        </motion.div>

        {/* Bio side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.35em",
              color: "var(--color-neon)",
              marginBottom: "1rem",
            }}
          >
            [ Quien escribe esto ]
          </p>

          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "2.5rem",
              fontWeight: 900,
              color: "var(--color-bone)",
              lineHeight: 1.05,
              marginBottom: "1rem",
              letterSpacing: "-0.02em",
            }}
          >
            Dominique<br />
            <span style={{ fontStyle: "italic", color: "var(--color-neon)" }}>Alexia.</span>
          </h2>

          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "var(--color-bone-soft)",
              marginBottom: "1.25rem",
              maxWidth: "420px",
            }}
          >
            Once años trabajando en branding desde adentro. No desde el PowerPoint de la agencia. Desde la trinchera. Proyectos reales, clientes reales, errores reales.
          </p>

          <p
            style={{
              fontSize: "0.9rem",
              lineHeight: 1.65,
              color: "var(--color-mute)",
              marginBottom: "1.75rem",
              maxWidth: "420px",
            }}
          >
            Insurreccional existe porque la industria del marketing te vende la ilusión de atajos. Este es el lugar donde eso se desarma, sin suavizarlo.
          </p>

          {/* Signature */}
          <div
            style={{
              borderTop: "1px solid var(--color-line)",
              paddingTop: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <svg viewBox="0 0 120 40" width="120" height="40" aria-label="Firma de Dominique Alexia">
              <path
                d="M8,32 C20,8 30,28 45,20 C55,14 60,30 75,22 C85,16 92,28 112,18"
                fill="none"
                stroke="var(--color-neon)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
              />
            </svg>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "var(--color-mute)",
                }}
              >
                Dominique Alexia
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "var(--color-mute-dim)",
                }}
              >
                Insurreccional · {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
