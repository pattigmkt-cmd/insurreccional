"use client";

import { useEffect, useRef } from "react";
import { useLowMotion } from "../../../lib/useLowMotion";

interface Props {
  className?: string;
  count?: number;
}

export default function ShootingStars({ className = "", count = 6 }: Props) {
  const low = useLowMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (low || !containerRef.current) return;
    const container = containerRef.current;

    const colors = ["#B00002", "#7a0001", "#f0ece4", "#888888"];

    const spawn = () => {
      if (!container) return;
      const star = document.createElement("span");
      const angle = 30 + Math.random() * 20;
      const startX = Math.random() * 110 - 5;
      const startY = Math.random() * 40 - 10;
      const length = 80 + Math.random() * 120;
      const duration = 800 + Math.random() * 1200;
      const color = colors[Math.floor(Math.random() * colors.length)];

      star.style.cssText = `
        position: absolute;
        top: ${startY}%;
        left: ${startX}%;
        width: ${length}px;
        height: 1px;
        background: linear-gradient(90deg, transparent, ${color}, transparent);
        transform: rotate(${angle}deg);
        transform-origin: left center;
        opacity: 0;
        pointer-events: none;
        animation: shoot-${Date.now()} ${duration}ms ease-out forwards;
      `;

      const keyframes = `
        @keyframes shoot-${Date.now()} {
          0% { opacity: 0; transform: translateX(0) translateY(0) rotate(${angle}deg); }
          10% { opacity: 1; }
          100% { opacity: 0; transform: translateX(${Math.cos((angle * Math.PI) / 180) * 400}px) translateY(${Math.sin((angle * Math.PI) / 180) * 400}px) rotate(${angle}deg); }
        }
      `;

      const style = document.createElement("style");
      style.textContent = keyframes;
      document.head.appendChild(style);

      container.appendChild(star);
      setTimeout(() => {
        star.remove();
        style.remove();
      }, duration + 100);
    };

    const intervals: ReturnType<typeof setInterval>[] = [];
    for (let i = 0; i < count; i++) {
      const delay = Math.random() * 4000;
      const interval = 2000 + Math.random() * 5000;
      setTimeout(() => {
        spawn();
        const id = setInterval(spawn, interval);
        intervals.push(id);
      }, delay);
    }

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [low, count]);

  if (low) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}
    />
  );
}
