"use client";

import { useEffect, useRef } from "react";
import { useLowMotion } from "../../../lib/useLowMotion";

interface Props {
  className?: string;
  density?: number;
  color?: string;
}

export default function Sparkles({ className = "", density = 60, color = "#e30613" }: Props) {
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

    const hexToRgb = (hex: string) => ({
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    });
    const rgb = hexToRgb(color.startsWith("#") ? color : "#e30613");

    const particles = Array.from({ length: density }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: 0.5 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.04,
      life: Math.random(),
    }));

    const draw = (now: number) => {
      rafRef.current = requestAnimationFrame(draw);
      if (now - lastFrameRef.current < FRAME_MS) return;
      lastFrameRef.current = now;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.phase += p.speed;
        p.life = (Math.sin(p.phase) + 1) / 2;

        const x = p.x * w;
        const y = p.y * h;
        const alpha = p.life * 0.8;
        const s = p.size * p.life;

        if (s < 0.1) continue;

        // Draw 4-point star
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;

        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2;
          const outerR = s * 2;
          const innerR = s * 0.5;
          const a1 = angle;
          const a2 = angle + Math.PI / 4;
          if (i === 0) ctx.moveTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
          else ctx.lineTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
          ctx.lineTo(Math.cos(a2) * innerR, Math.sin(a2) * innerR);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [low, density, color]);

  if (low) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
