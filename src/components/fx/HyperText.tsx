"use client";

import { useState, useEffect, useRef } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";

interface Props {
  text: string;
  duration?: number;
  className?: string;
  trigger?: "mount" | "hover";
}

export default function HyperText({
  text,
  duration = 1500,
  className = "",
  trigger = "hover",
}: Props) {
  const low = useLowMotion();
  const [displayed, setDisplayed] = useState(trigger === "mount" ? "" : text);
  const [animating, setAnimating] = useState(trigger === "mount");
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const scramble = () => {
    if (low) return;
    setAnimating(true);
    startRef.current = performance.now();

    const step = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const resolvedChars = Math.floor(progress * text.length);

      setDisplayed(
        text
          .split("")
          .map((char, i) => {
            if (i < resolvedChars) return char;
            if (char === " ") return " ";
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplayed(text);
        setAnimating(false);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (trigger === "mount") scramble();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (low) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      className={className}
      onMouseEnter={trigger === "hover" ? scramble : undefined}
      style={{ fontFamily: "inherit", cursor: trigger === "hover" ? "default" : undefined }}
      aria-label={text}
    >
      {displayed || text}
    </span>
  );
}
