"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

const MULTI_SKILLS = [
  { label: "Diseño", depth: 0.55 },
  { label: "Reels", depth: 0.45 },
  { label: "Copy", depth: 0.50 },
  { label: "DMs", depth: 0.40 },
  { label: "Pauta", depth: 0.35 },
  { label: "Crono", depth: 0.42 },
];

const SPECIALIST = { label: "Diseñadora de marca", depth: 0.95 };

export default function CVDepthVsWidth() {
  const low = useLowMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="my-10 md:my-14">
      <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
        El CV que leen vs el que querés tener
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Multi / wide */}
        <div className="rounded border border-[#222] bg-[#0d0d0d] p-5">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#555]">
            Multi-role
          </p>
          <p className="mb-5 font-serif text-sm italic text-mute">
            "Esta no es fuerte en nada"
          </p>
          <div className="space-y-2">
            {MULTI_SKILLS.map((skill, i) => (
              <div key={i}>
                <div className="mb-1 flex justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#555]">
                    {skill.label}
                  </span>
                  <span className="font-mono text-[9px] text-[#444]">
                    {Math.round(skill.depth * 100)}%
                  </span>
                </div>
                <div className="h-[4px] w-full rounded-full bg-[#1a1a1a]">
                  <motion.div
                    className="h-full rounded-full bg-[#333]"
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${skill.depth * 100}%` } : { width: 0 }}
                    transition={{
                      duration: low ? 0 : 0.7,
                      delay: low ? 0 : 0.1 + i * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#333]">
            3 años exp · 3 años de aprendizaje
          </p>
        </div>

        {/* Specialist / deep */}
        <div
          className="rounded border p-5"
          style={{ borderColor: "rgba(176, 0, 2,0.25)", background: "rgba(176, 0, 2,0.03)" }}
        >
          <p
            className="mb-1 font-mono text-[10px] uppercase tracking-[0.25em]"
            style={{ color: "#B00002" }}
          >
            Especialista
          </p>
          <p className="mb-5 font-serif text-sm italic" style={{ color: "#B00002", opacity: 0.7 }}>
            "Exactamente lo que buscamos"
          </p>

          {/* Single deep bar */}
          <div className="mb-6">
            <div className="mb-2 flex justify-between">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.15em]"
                style={{ color: "#B00002" }}
              >
                {SPECIALIST.label}
              </span>
              <span className="font-mono text-[9px]" style={{ color: "#B00002" }}>
                {Math.round(SPECIALIST.depth * 100)}%
              </span>
            </div>
            <div className="h-[4px] w-full rounded-full bg-[#1a1a1a]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "#B00002" }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${SPECIALIST.depth * 100}%` } : { width: 0 }}
                transition={{
                  duration: low ? 0 : 1.1,
                  delay: low ? 0 : 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
          </div>

          {/* Depth visual */}
          <div className="flex items-end gap-1 h-20">
            {[0.3, 0.5, 0.7, 0.85, 0.95].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-sm"
                style={{ background: `rgba(176, 0, 2,${0.15 + h * 0.4})` }}
                initial={{ height: 0 }}
                animate={inView ? { height: `${h * 100}%` } : { height: 0 }}
                transition={{
                  duration: low ? 0 : 0.6,
                  delay: low ? 0 : 0.5 + i * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ))}
          </div>
          <p
            className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em]"
            style={{ color: "#B00002", opacity: 0.5 }}
          >
            Profundidad compounding
          </p>

          <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: "#B00002", opacity: 0.6 }}>
            3 años exp · 5 años de avance
          </p>
        </div>
      </div>
    </div>
  );
}
