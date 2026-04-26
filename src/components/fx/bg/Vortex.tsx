"use client";

import { useEffect, useRef } from "react";
import { useLowMotion } from "../../../lib/useLowMotion";

interface Props {
  className?: string;
  particleCount?: number;
  dense?: boolean;
}

export default function Vortex({ className = "", particleCount = 120, dense = false }: Props) {
  const low = useLowMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);

  useEffect(() => {
    if (low || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio ?? 1, 1.25);
    const TARGET_FPS = 30;
    const FRAME_MS = 1000 / TARGET_FPS;

    const resize = () => {
      canvas.width = Math.floor(canvas.offsetWidth * DPR);
      canvas.height = Math.floor(canvas.offsetHeight * DPR);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const count = dense ? particleCount * 1.5 : particleCount;
    const particles = Array.from({ length: count }, (_, i) => ({
      angle: (Math.PI * 2 * i) / count,
      radius: 20 + Math.random() * 200,
      speed: 0.003 + Math.random() * 0.006,
      size: 0.5 + Math.random() * 1.5,
      opacity: 0.2 + Math.random() * 0.6,
      color: Math.random() > 0.7 ? "#B00002" : Math.random() > 0.5 ? "#7a0001" : "#888888",
    }));

    let t = 0;

    const draw = (now: number) => {
      rafRef.current = requestAnimationFrame(draw);
      if (now - lastFrameRef.current < FRAME_MS) return;
      lastFrameRef.current = now;
      t += 1;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = "rgba(10,10,10,0.12)";
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        p.angle += p.speed;
        const drift = Math.sin(t * 0.01 + p.angle) * 40;
        const r = p.radius + drift;
        const x = cx + Math.cos(p.angle) * r;
        const y = cy + Math.sin(p.angle) * r * 0.5;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * Math.abs(Math.sin(t * 0.02 + p.angle));
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [low, particleCount, dense]);

  if (low) {
    return (
      <div
        aria-hidden="true"
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(176, 0, 2,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
