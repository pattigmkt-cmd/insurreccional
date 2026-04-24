"use client";

import DirectionAwareHover from "./DirectionAwareHover";
import BorderBeam from "./BorderBeam";

export default function ManifiestoCards() {
  const yesOverlay = (
    <p
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: "1.4rem",
        fontStyle: "italic",
        color: "var(--color-neon)",
        textAlign: "center",
        lineHeight: 1.35,
      }}
    >
      "Venís a pensar, no a copiar."
    </p>
  );

  const noOverlay = (
    <p
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: "1.4rem",
        fontStyle: "italic",
        color: "var(--color-mute)",
        textAlign: "center",
        lineHeight: 1.35,
      }}
    >
      "No pasa nada. Hay lugares para eso."
    </p>
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "3rem",
      }}
    >
      {/* Sí es para vos */}
      <DirectionAwareHover
        overlay={yesOverlay}
        style={{
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(200,255,0,0.3)",
          padding: "2rem",
          minHeight: 320,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        } as React.CSSProperties}
      >
        <BorderBeam duration={5} />
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "var(--color-neon)",
            marginBottom: "1.5rem",
          }}
        >
          [ Sí es para vos si… ]
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {[
            "Venís del sector y algo te dejó de cerrar.",
            "Preferís un texto de 3.000 palabras antes que un reel.",
            "Querés construir algo propio y sabés que lleva años.",
            "Te importa entender por qué algo funcionó, no solo copiarlo.",
          ].map((item, i) => (
            <li key={i} style={{ display: "flex", gap: "1rem", fontSize: "0.95rem", color: "var(--color-bone)", lineHeight: 1.5 }}>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-neon)", flexShrink: 0 }}>→</span>
              {item}
            </li>
          ))}
        </ul>
      </DirectionAwareHover>

      {/* No es para vos */}
      <DirectionAwareHover
        overlay={noOverlay}
        style={{
          border: "1px solid var(--color-line)",
          padding: "2rem",
          minHeight: 320,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        } as React.CSSProperties}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "var(--color-mute)",
            marginBottom: "1.5rem",
          }}
        >
          [ No es para vos si… ]
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {[
            "Buscás fórmulas o plantillas que pegar.",
            "Preferís resúmenes de dos minutos hechos con IA.",
            "Pensás que la marca es lo que queda después de aplicar un filtro.",
            "Esperás que alguien te apure la carrera con un curso.",
          ].map((item, i) => (
            <li key={i} style={{ display: "flex", gap: "1rem", fontSize: "0.95rem", color: "var(--color-mute)", lineHeight: 1.5 }}>
              <span style={{ fontFamily: "var(--font-mono)" }}>×</span>
              {item}
            </li>
          ))}
        </ul>
      </DirectionAwareHover>
    </div>
  );
}
