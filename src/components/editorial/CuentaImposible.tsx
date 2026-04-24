"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLowMotion } from "../../lib/useLowMotion";
import NumberTicker from "../fx/NumberTicker";

const TASKS = [
  { label: "Diseño de piezas", hours: 2, unit: "h/pieza" },
  { label: "Copy", hours: 1, unit: "h/texto" },
  { label: "Edición de reels", hours: 2, unit: "h/reel" },
  { label: "Posts + subida", hours: 1, unit: "h/día" },
  { label: "DMs + respuestas", hours: 1, unit: "h/día" },
  { label: "Informe de pauta", hours: 1, unit: "h/semana" },
];

const CLIENTS = 6;
const REQUIRED = 56;
const AVAILABLE = 40;

export default function CuentaImposible() {
  const low = useLowMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="my-10 rounded border border-line bg-[#0d0d0d] p-5 md:my-14 md:p-8">
      <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
        La matemática imposible
      </p>

      {/* Grid */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TASKS.map((task, i) => (
          <motion.div
            key={i}
            className="rounded border border-[#1a1a1a] bg-[#111] p-3"
            initial={low ? false : { opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-mute truncate">
              {task.label}
            </p>
            <p className="mt-1 font-mono text-lg font-bold text-bone">
              {task.hours}
              <span className="ml-1 text-[10px] text-mute">{task.unit}</span>
            </p>
          </motion.div>
        ))}
      </div>

      {/* Multiplier */}
      <motion.div
        className="mb-4 rounded bg-[#111] p-4"
        initial={low ? false : { opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ delay: 0.5 }}
      >
        <p className="font-mono text-[10px] text-mute">
          × {CLIENTS} clientes simultáneos
        </p>
      </motion.div>

      {/* Result */}
      <motion.div
        className="grid grid-cols-2 gap-3"
        initial={low ? false : { opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ delay: 0.7 }}
      >
        <div className="rounded border p-4 text-center" style={{ borderColor: "rgba(255,107,107,0.4)", background: "rgba(255,107,107,0.05)" }}>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: "#ff6b6b" }}>
            Requeridas
          </p>
          <p className="mt-1 font-mono text-3xl font-bold" style={{ color: "#ff6b6b" }}>
            {inView ? <NumberTicker value={REQUIRED} suffix="h" /> : `${REQUIRED}h`}
          </p>
          <p className="mt-1 font-mono text-[9px] text-mute">por semana</p>
        </div>

        <div className="rounded border border-line p-4 text-center bg-[#111]">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">
            Disponibles
          </p>
          <p className="mt-1 font-mono text-3xl font-bold text-bone">
            {inView ? <NumberTicker value={AVAILABLE} suffix="h" /> : `${AVAILABLE}h`}
          </p>
          <p className="mt-1 font-mono text-[9px] text-mute">semana laboral</p>
        </div>
      </motion.div>

      <motion.div
        className="mt-5 rounded border p-4 text-center"
        style={{ borderColor: "rgba(255,107,107,0.3)", background: "rgba(255,107,107,0.04)" }}
        initial={low ? false : { opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ delay: 1 }}
      >
        <p className="font-serif text-lg font-bold italic" style={{ color: "#ff6b6b" }}>
          No da la cuenta.
        </p>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-mute">
          Faltan {REQUIRED - AVAILABLE}h — eso es calidad que no existe
        </p>
      </motion.div>
    </div>
  );
}
