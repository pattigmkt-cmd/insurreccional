"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";
import { useLowMotion } from "../../lib/useLowMotion";

const STATS = [
  { value: 11, suffix: " años", label: "de oficio" },
  { value: 0, suffix: "", label: "cursos vendidos" },
  { value: 3, suffix: "", label: "textos publicados" },
  { value: null, symbol: "∞", label: "preguntas incómodas" },
];

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const low = useLowMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-20px" });
  const [display, setDisplay] = useState(low ? value : 0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (low || !inView || hasAnimated.current) return;
    hasAnimated.current = true;
    const ctrl = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [inView, low, value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

export default function StatsBlock() {
  return (
    <section
      style={{
        borderTop: "1px solid var(--color-line)",
        borderBottom: "1px solid var(--color-line)",
        padding: "3rem 1rem",
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.35em",
            color: "var(--color-mute)",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          [ Los números que importan ]
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={i}
              style={{
                padding: "1.75rem 1.5rem",
                borderRight: "1px solid var(--color-line)",
                borderBottom: "1px solid var(--color-line)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "3rem",
                  fontWeight: 900,
                  color: "var(--color-neon)",
                  lineHeight: 1,
                  marginBottom: "0.4rem",
                }}
              >
                {stat.value !== null ? (
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                ) : (
                  <span>{stat.symbol}</span>
                )}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.25em",
                  color: "var(--color-mute)",
                  margin: 0,
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
