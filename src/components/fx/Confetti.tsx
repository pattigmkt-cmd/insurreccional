"use client";

import { useRef, useCallback } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

interface Props {
  children: React.ReactNode;
  className?: string;
  count?: number;
}

const COLORS = ["#e30613", "#b00002", "#f0ece4", "#888888", "#e3061388"];

export default function Confetti({ children, className = "", count = 40 }: Props) {
  const low = useLowMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const burst = useCallback((originX: number, originY: number) => {
    if (low || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.style.pointerEvents = "none";
    const DPR = Math.min(window.devicePixelRatio ?? 1, 1.25);
    canvas.width = window.innerWidth * DPR;
    canvas.height = window.innerHeight * DPR;
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";

    const particles = Array.from({ length: count }, () => ({
      x: originX * DPR,
      y: originY * DPR,
      vx: (Math.random() - 0.5) * 12 * DPR,
      vy: (Math.random() * -14 - 2) * DPR,
      gravity: 0.5 * DPR,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      w: (4 + Math.random() * 6) * DPR,
      h: (2 + Math.random() * 3) * DPR,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.2,
      life: 1,
      decay: 0.012 + Math.random() * 0.015,
    }));

    let rafId: number;

    const step = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotSpeed;
        p.life -= p.decay;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alive) {
        rafId = requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    rafId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafId);
  }, [low, count]);

  const handleClick = (e: React.MouseEvent) => {
    burst(e.clientX, e.clientY);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    burst(e.clientX, e.clientY);
  };

  return (
    <>
      {!low && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}
      <div
        ref={triggerRef}
        className={className}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        style={{ display: "contents" }}
      >
        {children}
      </div>
    </>
  );
}
