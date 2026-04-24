"use client";

import { useEffect, useState } from "react";
import { useLowMotion } from "../../../lib/useLowMotion";

interface Props {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseMs?: number;
  className?: string;
  cursorClassName?: string;
}

export default function Typewriter({
  texts,
  speed = 60,
  deleteSpeed = 35,
  pauseMs = 2200,
  className = "",
  cursorClassName = "",
}: Props) {
  const low = useLowMotion();
  const [display, setDisplay] = useState(low ? texts[0] : "");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");
  const [textIdx, setTextIdx] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);

  // Cursor blink
  useEffect(() => {
    if (low) return;
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
  }, [low]);

  useEffect(() => {
    if (low) return;
    const current = texts[textIdx % texts.length];

    if (phase === "typing") {
      if (display.length < current.length) {
        const id = setTimeout(() => setDisplay(current.slice(0, display.length + 1)), speed);
        return () => clearTimeout(id);
      } else {
        const id = setTimeout(() => setPhase("pausing"), pauseMs);
        return () => clearTimeout(id);
      }
    }

    if (phase === "pausing") {
      setPhase("deleting");
    }

    if (phase === "deleting") {
      if (display.length > 0) {
        const id = setTimeout(() => setDisplay(display.slice(0, -1)), deleteSpeed);
        return () => clearTimeout(id);
      } else {
        setTextIdx((i) => (i + 1) % texts.length);
        setPhase("typing");
      }
    }
  }, [low, display, phase, textIdx, texts, speed, deleteSpeed, pauseMs]);

  if (low) {
    return <span className={className}>{texts[0]}</span>;
  }

  return (
    <span className={className}>
      {display}
      <span
        aria-hidden="true"
        className={cursorClassName}
        style={{
          display: "inline-block",
          width: "2px",
          height: "1.1em",
          background: "var(--color-neon)",
          marginLeft: "2px",
          verticalAlign: "text-bottom",
          opacity: cursorOn ? 1 : 0,
          transition: "opacity 0.1s",
        }}
      />
    </span>
  );
}
