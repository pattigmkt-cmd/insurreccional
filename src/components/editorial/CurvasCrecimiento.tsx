"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

const W = 480;
const H = 220;
const PAD = { top: 20, right: 20, bottom: 40, left: 44 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;
const STEPS = 120;

// Audiencia: fast rise, plateau — y = 1 - e^(-2.5x) where x in [0,1]
function audienciaY(t: number) {
  return 1 - Math.exp(-2.5 * t);
}

// Comunidad: slow start, then compounding — y = t^2.5 * 1.2 clamped at 1
function comunidadY(t: number) {
  return Math.min(1, Math.pow(t, 2.2) * 1.2);
}

function makePath(
  fn: (t: number) => number,
  steps: number,
  innerW: number,
  innerH: number
): string {
  const pts = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const x = t * innerW;
    const y = innerH - fn(t) * innerH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return `M ${pts.join(" L ")}`;
}

export default function CurvasCrecimiento() {
  const low = useLowMotion();
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });

  const audienciaPath = useMemo(() => makePath(audienciaY, STEPS, INNER_W, INNER_H), []);
  const comunidadPath = useMemo(() => makePath(comunidadY, STEPS, INNER_W, INNER_H), []);

  // Compute path length approximation for stroke-dashoffset
  const pathLen = INNER_W * 1.15; // rough estimate

  // Year tick positions
  const years = [
    { label: "Año 1", x: INNER_W * (1 / 3) },
    { label: "Año 2", x: INNER_W * (2 / 3) },
    { label: "Año 3", x: INNER_W },
  ];

  return (
    <div className="my-10 md:my-14">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
        Audiencia vs Comunidad · crecimiento en el tiempo
      </p>

      <div className="overflow-x-auto">
        <svg
          ref={ref}
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full"
          style={{ minWidth: 280, maxWidth: 560 }}
          aria-label="Gráfico: curva de crecimiento de audiencia vs comunidad"
        >
          <g transform={`translate(${PAD.left},${PAD.top})`}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((v) => (
              <line
                key={v}
                x1={0} y1={INNER_H - v * INNER_H}
                x2={INNER_W} y2={INNER_H - v * INNER_H}
                stroke="#1a1a1a"
                strokeWidth="1"
              />
            ))}

            {/* Year ticks */}
            {years.map(({ label, x }) => (
              <g key={label}>
                <line
                  x1={x} y1={0}
                  x2={x} y2={INNER_H + 8}
                  stroke="#222"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={x}
                  y={INNER_H + 24}
                  textAnchor="middle"
                  className="font-mono"
                  style={{ fontSize: 9, fill: "#555", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.1em" }}
                >
                  {label}
                </text>
              </g>
            ))}

            {/* Y axis labels */}
            {["0%", "50%", "100%"].map((label, i) => (
              <text
                key={i}
                x={-6}
                y={INNER_H - (i / 2) * INNER_H + 4}
                textAnchor="end"
                style={{ fontSize: 8, fill: "#444", fontFamily: "JetBrains Mono, monospace" }}
              >
                {label}
              </text>
            ))}

            {/* Axes */}
            <line x1={0} y1={0} x2={0} y2={INNER_H} stroke="#333" strokeWidth="1" />
            <line x1={0} y1={INNER_H} x2={INNER_W} y2={INNER_H} stroke="#333" strokeWidth="1" />

            {/* Audiencia curve */}
            <motion.path
              d={audienciaPath}
              fill="none"
              stroke="#444"
              strokeWidth="1.8"
              strokeDasharray={pathLen * 2}
              initial={{ strokeDashoffset: pathLen * 2 }}
              animate={inView ? { strokeDashoffset: 0 } : undefined}
              transition={{ duration: low ? 0 : 1.2, ease: "easeOut" }}
            />

            {/* Comunidad curve */}
            <motion.path
              d={comunidadPath}
              fill="none"
              stroke="#e30613"
              strokeWidth="2.2"
              strokeDasharray={pathLen * 2}
              initial={{ strokeDashoffset: pathLen * 2 }}
              animate={inView ? { strokeDashoffset: 0 } : undefined}
              transition={{ duration: low ? 0 : 1.4, delay: low ? 0 : 0.2, ease: "easeOut" }}
            />

            {/* Crossing point annotation ~year 3 */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ delay: low ? 0 : 1.4 }}
            >
              <circle
                cx={INNER_W * 0.88}
                cy={INNER_H - comunidadY(0.88) * INNER_H}
                r="3.5"
                fill="#e30613"
              />
              <text
                x={INNER_W * 0.88 - 4}
                y={INNER_H - comunidadY(0.88) * INNER_H - 10}
                textAnchor="middle"
                style={{ fontSize: 8, fill: "#e30613", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em" }}
              >
                compounding
              </text>
            </motion.g>

            {/* Legend */}
            <g transform={`translate(${INNER_W - 140}, 8)`}>
              <line x1={0} y1={5} x2={18} y2={5} stroke="#444" strokeWidth="1.8" />
              <text x={22} y={9} style={{ fontSize: 8, fill: "#555", fontFamily: "JetBrains Mono, monospace" }}>
                Audiencia
              </text>
              <line x1={0} y1={21} x2={18} y2={21} stroke="#e30613" strokeWidth="2.2" />
              <text x={22} y={25} style={{ fontSize: 8, fill: "#e30613", fontFamily: "JetBrains Mono, monospace" }}>
                Comunidad
              </text>
            </g>
          </g>
        </svg>
      </div>

      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-mute">
        La comunidad cruza a la audiencia en el año 3 y no se detiene.
      </p>
    </div>
  );
}
