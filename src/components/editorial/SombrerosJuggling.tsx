"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

const ROLES = [
  { id: "diseno", label: "Diseño", icon: "◈", angle: 0 },
  { id: "reels", label: "Reels", icon: "▶", angle: 60 },
  { id: "posts", label: "Posts", icon: "◻", angle: 120 },
  { id: "dms", label: "DMs", icon: "◉", angle: 180 },
  { id: "crono", label: "Cronograma", icon: "◫", angle: 240 },
  { id: "numeros", label: "Números", icon: "◈", angle: 300 },
];

const R = 88; // orbit radius (px) for desktop
const R_MOBILE = 64;

export default function SombrerosJuggling() {
  const low = useLowMotion();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [droppedIds, setDroppedIds] = useState<string[]>([]);
  const [orbitAngle, setOrbitAngle] = useState(0);

  // Slow auto-rotation
  useEffect(() => {
    if (low) return;
    let frame: number;
    let last = 0;
    const tick = (ts: number) => {
      if (last) setOrbitAngle((a) => (a + (ts - last) * 0.02) % 360);
      last = ts;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [low]);

  const handleDrop = (id: string) => {
    if (droppedIds.includes(id)) return;
    setDroppedIds((prev) => [...prev, id]);
  };

  const reset = () => {
    setDroppedIds([]);
    setHoveredId(null);
  };

  if (low) {
    return (
      <div className="my-10 rounded border border-line bg-[#0d0d0d] p-6">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
          Los 6 sombreros simultáneos
        </p>
        <div className="flex flex-wrap gap-3">
          {ROLES.map((r) => (
            <span
              key={r.id}
              className="rounded border border-line px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-soft"
            >
              {r.icon} {r.label}
            </span>
          ))}
        </div>
        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-mute">
          Una persona. Seis roles. No da la cuenta.
        </p>
      </div>
    );
  }

  return (
    <div className="my-10 md:my-14" aria-label="Visualización: 6 roles orbitando">
      <div className="flex flex-col items-center">
        <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
          Hacé clic en cualquier rol para soltar
        </p>

        {/* Orbit container */}
        <div className="relative" style={{ width: 220, height: 220 }}>
          {/* Center label */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">vos</p>
            <div
              className="mx-auto mt-1 h-10 w-10 rounded-full border-2"
              style={{ borderColor: "#c8ff00", background: "rgba(200,255,0,0.1)" }}
            />
          </div>

          {ROLES.map((role, i) => {
            const angleRad = ((role.angle + orbitAngle) * Math.PI) / 180;
            const cx = 110 + R_MOBILE * Math.cos(angleRad);
            const cy = 110 + R_MOBILE * Math.sin(angleRad);
            const isHovered = hoveredId === role.id;
            const isDropped = droppedIds.includes(role.id);

            return (
              <motion.button
                key={role.id}
                className="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded border font-mono text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon"
                style={{
                  left: cx,
                  top: cy,
                  borderColor: isHovered ? "#c8ff00" : isDropped ? "#333" : "#444",
                  background: isDropped ? "#0a0a0a" : isHovered ? "rgba(200,255,0,0.15)" : "#111",
                }}
                animate={isDropped ? {
                  y: 80,
                  opacity: 0,
                  rotate: Math.random() * 60 - 30,
                } : {
                  opacity: hoveredId && hoveredId !== role.id ? 0.2 : 1,
                  scale: isHovered ? 1.15 : 1,
                }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                onHoverStart={() => setHoveredId(role.id)}
                onHoverEnd={() => setHoveredId(null)}
                onClick={() => handleDrop(role.id)}
                title={role.label}
                aria-label={`Soltar ${role.label}`}
              >
                <span style={{ color: isHovered ? "#c8ff00" : "#888" }}>{role.icon}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Labels */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {ROLES.map((r) => (
            <span
              key={r.id}
              className="font-mono text-[9px] uppercase tracking-[0.2em] transition-colors"
              style={{
                color: droppedIds.includes(r.id) ? "#333" : hoveredId === r.id ? "#c8ff00" : "#555",
                textDecoration: droppedIds.includes(r.id) ? "line-through" : "none",
              }}
            >
              {r.label}
            </span>
          ))}
        </div>

        {droppedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <p className="font-serif text-base italic text-bone-soft">
              Cuando soltás uno, todo lo demás pierde calidad.
            </p>
            <button
              onClick={reset}
              className="mt-2 font-mono text-[9px] uppercase tracking-[0.25em] text-mute underline hover:text-bone"
            >
              Reiniciar
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
