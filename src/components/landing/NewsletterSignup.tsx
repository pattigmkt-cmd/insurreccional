"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    setError("");

    try {
      // Mock: log and show success
      await new Promise((r) => setTimeout(r, 600));
      console.log("[Newsletter] subscribe:", email);
      setState("success");
    } catch {
      setState("error");
      setError("Algo falló. Intentá de nuevo.");
    }
  };

  return (
    <section
      style={{
        position: "relative",
        borderTop: "1px solid var(--color-line)",
        borderBottom: "1px solid var(--color-line)",
        padding: "3rem 2rem",
        background: "rgba(17,17,17,0.8)",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center bottom, rgba(227, 6, 19,0.04) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.35em",
            color: "var(--color-neon)",
            marginBottom: "0.75rem",
          }}
        >
          [ Archivo nuevo · sin spam ]
        </p>

        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.6rem",
            fontWeight: 700,
            color: "var(--color-bone)",
            lineHeight: 1.15,
            marginBottom: "0.75rem",
          }}
        >
          Suscribite para recibir<br />
          textos cuando salen.
        </h2>

        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--color-mute)",
            lineHeight: 1.6,
            marginBottom: "1.75rem",
          }}
        >
          No hay calendario. No hay frecuencia. Solo texto nuevo cuando hay algo que decir.
        </p>

        <AnimatePresence mode="wait">
          {state === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: "1rem",
                border: "1px solid rgba(227, 6, 19,0.3)",
                background: "rgba(227, 6, 19,0.04)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.3em",
                  color: "var(--color-neon)",
                }}
              >
                Anotado. Vas a saber cuando haya algo nuevo.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", gap: "0", flexWrap: "wrap", justifyContent: "center" }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                aria-label="Tu dirección de email"
                style={{
                  flex: "1 1 220px",
                  minWidth: 0,
                  padding: "0.75rem 1rem",
                  background: "var(--color-ink)",
                  border: "1px solid var(--color-line)",
                  borderRight: "none",
                  color: "var(--color-bone)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.9rem",
                  outline: "none",
                  caretColor: "var(--color-neon)",
                }}
              />
              <button
                type="submit"
                disabled={state === "loading"}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "var(--color-neon)",
                  color: "var(--color-ink)",
                  border: "none",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.28em",
                  fontWeight: 700,
                  cursor: state === "loading" ? "wait" : "pointer",
                  opacity: state === "loading" ? 0.7 : 1,
                  transition: "opacity 0.2s",
                  flexShrink: 0,
                }}
              >
                {state === "loading" ? "..." : "Suscribirse"}
              </button>
              {error && (
                <p style={{ width: "100%", marginTop: "0.5rem", fontSize: "0.8rem", color: "#ff6b6b", fontFamily: "var(--font-mono)" }}>
                  {error}
                </p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
