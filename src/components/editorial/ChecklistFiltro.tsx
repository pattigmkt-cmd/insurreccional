"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

const QUESTIONS = [
  "¿Cuál es la decisión más difícil que tomaste en el último año sobre tu producto?",
  "¿Qué tipo de cliente querés perder?",
  "¿En qué momento un cliente tuyo debería dejar de ser tuyo?",
  "¿Qué afirmación hacés que ningún competidor tuyo haría sin sentir vergüenza?",
];

function CheckSVG({ checked, low }: { checked: boolean; low: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="1"
        y="1"
        width="18"
        height="18"
        rx="2"
        stroke={checked ? "#c8ff00" : "#333"}
        strokeWidth="1.5"
        fill={checked ? "rgba(200,255,0,0.08)" : "none"}
      />
      {checked && (
        <motion.path
          d="M5 10 L9 14 L15 7"
          stroke="#c8ff00"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={low ? undefined : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </svg>
  );
}

export default function ChecklistFiltro() {
  const low = useLowMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  const [checked, setChecked] = useState<boolean[]>(QUESTIONS.map(() => false));

  const allChecked = checked.every(Boolean);

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <div ref={ref} className="my-10 md:my-14">
      <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
        Las preguntas que nadie te hace
      </p>
      <div className="space-y-3">
        {QUESTIONS.map((q, i) => (
          <motion.button
            key={i}
            className="flex w-full items-start gap-4 rounded border border-line bg-[#0d0d0d] p-4 text-left transition-colors hover:border-neon/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon md:p-5"
            style={checked[i] ? { borderColor: "rgba(200,255,0,0.25)", background: "rgba(200,255,0,0.03)" } : {}}
            initial={low ? false : { opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => toggle(i)}
            aria-pressed={checked[i]}
          >
            <CheckSVG checked={checked[i]} low={low} />
            <span
              className="font-serif text-base leading-relaxed transition-colors md:text-lg"
              style={{ color: checked[i] ? "#c8ff00" : "#888" }}
            >
              {q}
            </span>
          </motion.button>
        ))}
      </div>

      {allChecked && (
        <motion.p
          initial={low ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em]"
          style={{ color: "#c8ff00" }}
        >
          Si no podés contestar esto, el logo no es el problema.
        </motion.p>
      )}

      {!allChecked && (
        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.22em] text-mute">
          Hacé clic para marcar las que podés responder hoy
        </p>
      )}
    </div>
  );
}
