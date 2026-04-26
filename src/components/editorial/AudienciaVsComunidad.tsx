"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

// Broadcast (star) layout - center hub → satellites
const BROADCAST_NODES = [
  { id: "c", cx: 80, cy: 80, r: 10, isCenter: true },
  { id: "s1", cx: 80, cy: 18, r: 6, isCenter: false },
  { id: "s2", cx: 133, cy: 41, r: 6, isCenter: false },
  { id: "s3", cx: 143, cy: 105, r: 6, isCenter: false },
  { id: "s4", cx: 105, cy: 148, r: 6, isCenter: false },
  { id: "s5", cx: 30, cy: 140, r: 6, isCenter: false },
  { id: "s6", cx: 10, cy: 80, r: 6, isCenter: false },
  { id: "s7", cx: 30, cy: 22, r: 6, isCenter: false },
];

const BROADCAST_EDGES = [
  { from: "c", to: "s1" },
  { from: "c", to: "s2" },
  { from: "c", to: "s3" },
  { from: "c", to: "s4" },
  { from: "c", to: "s5" },
  { from: "c", to: "s6" },
  { from: "c", to: "s7" },
];

// Mesh layout - distributed interconnected nodes
const MESH_NODES = [
  { id: "m1", cx: 75, cy: 25 },
  { id: "m2", cx: 135, cy: 50 },
  { id: "m3", cx: 150, cy: 110 },
  { id: "m4", cx: 100, cy: 155 },
  { id: "m5", cx: 40, cy: 140 },
  { id: "m6", cx: 15, cy: 75 },
  { id: "m7", cx: 80, cy: 85 },  // center node — less prominent
];

const MESH_EDGES = [
  { from: "m1", to: "m2" },
  { from: "m2", to: "m3" },
  { from: "m3", to: "m4" },
  { from: "m4", to: "m5" },
  { from: "m5", to: "m6" },
  { from: "m6", to: "m1" },
  { from: "m1", to: "m7" },
  { from: "m2", to: "m7" },
  { from: "m3", to: "m7" },
  { from: "m4", to: "m7" },
  { from: "m5", to: "m7" },
  { from: "m1", to: "m4" },
  { from: "m2", to: "m5" },
];

function getNode(nodes: { id: string; cx: number; cy: number }[], id: string) {
  return nodes.find((n) => n.id === id)!;
}

function EdgePath({
  x1, y1, x2, y2, color, delay, low,
}: {
  x1: number; y1: number; x2: number; y2: number;
  color: string; delay: number; low: boolean;
}) {
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color}
      strokeWidth="1.2"
      opacity="0.5"
      strokeDasharray={len}
      initial={{ strokeDashoffset: len }}
      animate={{ strokeDashoffset: 0 }}
      transition={{ duration: low ? 0 : 0.8, delay: low ? 0 : delay, ease: "easeOut" }}
    />
  );
}

export default function AudienciaVsComunidad() {
  const low = useLowMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="my-10 md:my-14">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Audiencia — broadcast */}
        <div className="rounded border border-[#222] bg-[#0d0d0d] p-5">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-[#555]">
            Audiencia
          </p>
          <svg viewBox="0 0 160 165" className="mx-auto block w-full max-w-[180px]" aria-hidden="true">
            {inView && BROADCAST_EDGES.map(({ from, to }, i) => {
              const f = getNode(BROADCAST_NODES, from);
              const t = getNode(BROADCAST_NODES, to);
              return (
                <EdgePath key={i} x1={f.cx} y1={f.cy} x2={t.cx} y2={t.cy}
                  color="#444" delay={0.05 + i * 0.05} low={low} />
              );
            })}
            {BROADCAST_NODES.map((n) => (
              <motion.circle
                key={n.id}
                cx={n.cx} cy={n.cy} r={n.r || 6}
                fill={n.isCenter ? "#e30613" : "#222"}
                stroke={n.isCenter ? "#e30613" : "#444"}
                strokeWidth="1.5"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={inView ? { opacity: 1, scale: 1 } : undefined}
                transition={{ duration: low ? 0 : 0.4, delay: low ? 0 : n.isCenter ? 0 : 0.3 }}
              />
            ))}
          </svg>
          <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-[#444]">
            Un centro → satélites pasivos
          </p>
        </div>

        {/* Comunidad — mesh */}
        <div
          className="rounded border p-5"
          style={{ borderColor: "rgba(227, 6, 19,0.2)", background: "rgba(227, 6, 19,0.02)" }}
        >
          <p
            className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em]"
            style={{ color: "#e30613" }}
          >
            Comunidad
          </p>
          <svg viewBox="0 0 165 180" className="mx-auto block w-full max-w-[180px]" aria-hidden="true">
            {inView && MESH_EDGES.map(({ from, to }, i) => {
              const f = getNode(MESH_NODES, from);
              const t = getNode(MESH_NODES, to);
              return (
                <EdgePath key={i} x1={f.cx} y1={f.cy} x2={t.cx} y2={t.cy}
                  color="#e3061366" delay={0.05 + i * 0.04} low={low} />
              );
            })}
            {MESH_NODES.map((n) => (
              <motion.circle
                key={n.id}
                cx={n.cx} cy={n.cy} r={n.id === "m7" ? 6 : 7}
                fill={n.id === "m7" ? "rgba(227, 6, 19,0.15)" : "rgba(227, 6, 19,0.12)"}
                stroke="#e30613"
                strokeWidth="1.2"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={inView ? { opacity: 1, scale: 1 } : undefined}
                transition={{ duration: low ? 0 : 0.4, delay: low ? 0 : 0.15 + Math.random() * 0.3 }}
              />
            ))}
          </svg>
          <p
            className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em]"
            style={{ color: "#e30613", opacity: 0.5 }}
          >
            Nodos que se hablan entre sí
          </p>
        </div>
      </div>
    </div>
  );
}
