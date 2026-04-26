"use client";

import Compare from "./Compare";

export default function CompareEasterEgg() {
  const before = (
    <div
      style={{
        height: 192,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-surface)",
        border: "1px solid var(--color-line)",
        gap: "0.75rem",
      }}
    >
      <svg viewBox="0 0 80 80" width="60" height="60" aria-hidden="true">
        <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(136,136,136,0.3)" strokeWidth="2" />
        <text x="40" y="47" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="18" fill="rgba(136,136,136,0.5)">AB</text>
      </svg>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "var(--color-mute)",
        }}
      >
        Tu Logo
      </p>
    </div>
  );

  const after = (
    <div
      style={{
        height: 192,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-surface)",
        border: "1px solid var(--color-line)",
        gap: "0.75rem",
      }}
    >
      <svg viewBox="0 0 80 80" width="60" height="60" aria-hidden="true">
        <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(176, 0, 2,0.3)" strokeWidth="1.5" />
        <circle cx="40" cy="40" r="20" fill="none" stroke="rgba(176, 0, 2,0.15)" strokeWidth="1" />
        <text x="40" y="47" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontStyle="italic" fill="rgba(176, 0, 2,0.4)">AB</text>
      </svg>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "rgba(176, 0, 2,0.4)",
        }}
      >
        Tu Logo (rebrandeado)
      </p>
    </div>
  );

  return (
    <Compare
      before={before}
      after={after}
      beforeLabel="Logo genérico"
      afterLabel="Logo genérico más caro"
    />
  );
}
