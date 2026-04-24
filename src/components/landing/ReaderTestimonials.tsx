"use client";

import { useLowMotion } from "../../lib/useLowMotion";

const TESTIMONIALS = [
  { quote: "Leer Insurreccional me hizo renunciar al multitasking. Tarde, pero bien.", author: "J.P., CM" },
  { quote: "Finalmente alguien que dice lo del logo sin suavizarlo.", author: "V.R., Diseñadora" },
  { quote: "Mandé tres textos a mis clientes. Tuvimos la conversación que debíamos tener.", author: "M.T., Consultora" },
  { quote: "La industria no quiere que leas esto. Por eso lo leo.", author: "S.L., Social Media" },
  { quote: "Insurreccional es lo que le faltaba al gremio. Criterio sin venta adentro.", author: "A.G., Estratega" },
];

export default function ReaderTestimonials() {
  const low = useLowMotion();

  const duration = "30s";
  const items = [...TESTIMONIALS, ...TESTIMONIALS]; // duplicate for seamless loop

  return (
    <section
      style={{
        borderTop: "1px solid var(--color-line)",
        borderBottom: "1px solid var(--color-line)",
        padding: "3rem 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          paddingInline: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.35em",
            color: "var(--color-mute)",
          }}
        >
          [ Quienes leen esto ]
        </p>
      </div>

      {!low && (
        <style>{`
          @keyframes marquee-testimonials {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      )}

      <div
        style={{
          display: "flex",
          width: low ? undefined : "max-content",
          animation: low ? undefined : `marquee-testimonials ${duration} linear infinite`,
          gap: "1.5rem",
          paddingInline: "0.75rem",
          flexWrap: low ? "wrap" : undefined,
        }}
      >
        {(low ? TESTIMONIALS : items).map((t, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: low ? "100%" : 340,
              padding: "1.25rem 1.5rem",
              border: "1px solid var(--color-line)",
              background: "var(--color-surface)",
              position: "relative",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1rem",
                fontStyle: "italic",
                color: "var(--color-bone-soft)",
                lineHeight: 1.55,
                marginBottom: "0.75rem",
              }}
            >
              &ldquo;{t.quote}&rdquo;
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "var(--color-mute)",
              }}
            >
              — {t.author}
            </p>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 10,
                right: 12,
                fontFamily: "var(--font-serif)",
                fontSize: "2.5rem",
                color: "var(--color-neon)",
                opacity: 0.12,
                lineHeight: 1,
                pointerEvents: "none",
              }}
            >
              &ldquo;
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
