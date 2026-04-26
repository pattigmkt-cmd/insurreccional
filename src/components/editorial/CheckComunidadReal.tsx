"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLowMotion } from "../../lib/useLowMotion";

const QUESTIONS = [
  "¿Los miembros se conocen entre sí fuera de tus canales?",
  "¿Alguien empezó una conversación esta semana sin que vos la hayas iniciado?",
  "¿Existe un chiste interno que solo se entiende si estás adentro?",
  "¿Alguien recomendó a otro sin que vos lo pidieras?",
  "¿Perderías miembros si desaparecieras mañana?",
];

type Answer = "si" | "no" | null;

export default function CheckComunidadReal() {
  const low = useLowMotion();
  const [answers, setAnswers] = useState<Answer[]>(QUESTIONS.map(() => null));

  const answered = answers.filter((a) => a !== null).length;
  const noCount = answers.filter((a) => a === "no").length;
  const allAnswered = answered === QUESTIONS.length;

  const verdict =
    allAnswered
      ? noCount >= 3
        ? { label: "Tenés audiencia disfrazada", color: "#ff6b6b", description: "3 o más respuestas negativas. Tus seguidores te ven a vos, no entre sí." }
        : { label: "Comunidad real", color: "#e30613", description: "Menos de 3 negativas. Hay conexión horizontal genuina." }
      : null;

  const setAnswer = (i: number, val: Answer) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
  };

  return (
    <div className="my-10 md:my-14">
      <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
        Test: ¿tenés comunidad o audiencia?
      </p>

      <div className="space-y-3">
        {QUESTIONS.map((q, i) => {
          const ans = answers[i];
          return (
            <div
              key={i}
              className="rounded border border-line bg-[#0d0d0d] p-4 md:p-5"
              style={
                ans === "si"
                  ? { borderColor: "rgba(227, 6, 19,0.25)", background: "rgba(227, 6, 19,0.03)" }
                  : ans === "no"
                  ? { borderColor: "rgba(255,107,107,0.25)", background: "rgba(255,107,107,0.03)" }
                  : {}
              }
            >
              <p className="mb-3 font-serif text-base leading-relaxed text-bone-soft md:text-lg">
                {q}
              </p>
              <div className="flex gap-2" role="group" aria-label={`Respuesta a: ${q}`}>
                {(["si", "no"] as const).map((val) => (
                  <button
                    key={val}
                    onClick={() => setAnswer(i, ans === val ? null : val)}
                    aria-pressed={ans === val}
                    className="relative overflow-hidden rounded px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon"
                    style={{
                      border: `1px solid ${ans === val ? (val === "si" ? "#e30613" : "#ff6b6b") : "#333"}`,
                      background: ans === val ? (val === "si" ? "rgba(227, 6, 19,0.12)" : "rgba(255,107,107,0.12)") : "transparent",
                      color: ans === val ? (val === "si" ? "#e30613" : "#ff6b6b") : "#555",
                    }}
                  >
                    {val === "si" ? "Sí" : "No"}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="mt-5 h-[2px] w-full rounded-full bg-[#1a1a1a]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "#e30613" }}
          animate={{ width: `${(answered / QUESTIONS.length) * 100}%` }}
          transition={{ duration: low ? 0 : 0.3 }}
        />
      </div>
      <p className="mt-2 font-mono text-[9px] text-mute">
        {answered}/{QUESTIONS.length} respondidas
      </p>

      {/* Verdict */}
      <AnimatePresence>
        {verdict && (
          <motion.div
            key="verdict"
            initial={low ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 rounded border p-5"
            style={{
              borderColor: verdict.color + "55",
              background: verdict.color + "0a",
            }}
          >
            <p
              className="font-serif text-xl font-bold italic"
              style={{ color: verdict.color }}
            >
              {verdict.label}
            </p>
            <p className="mt-2 font-mono text-[10px] tracking-[0.15em] text-mute">
              {verdict.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
