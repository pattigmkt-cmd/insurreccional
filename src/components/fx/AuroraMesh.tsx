"use client";

import { useEffect, useRef } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

interface Props {
  dense?: boolean;
  className?: string;
}

export default function AuroraMesh({ dense = false, className = "" }: Props) {
  const low = useLowMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);

  useEffect(() => {
    if (low || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const TARGET_FPS = 30;
    const FRAME_MS = 1000 / TARGET_FPS;
    const DPR = Math.min(window.devicePixelRatio ?? 1, 1.25);

    const resize = () => {
      canvas.width = Math.floor(canvas.offsetWidth * DPR);
      canvas.height = Math.floor(canvas.offsetHeight * DPR);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let t = 0;

    const draw = (now: number) => {
      rafRef.current = requestAnimationFrame(draw);
      if (now - lastFrameRef.current < FRAME_MS) return;
      lastFrameRef.current = now;
      t += 0.006;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const blobs = dense
        ? [
            { x: 0.2 + 0.12 * Math.sin(t * 0.7), y: 0.3 + 0.1 * Math.cos(t * 0.5), r: 0.45, color: "rgba(200,255,0,0.13)" },
            { x: 0.7 + 0.1 * Math.cos(t * 0.6), y: 0.2 + 0.1 * Math.sin(t * 0.8), r: 0.38, color: "rgba(120,40,180,0.11)" },
            { x: 0.5 + 0.14 * Math.sin(t * 0.4), y: 0.7 + 0.09 * Math.cos(t * 0.9), r: 0.42, color: "rgba(200,255,0,0.09)" },
            { x: 0.15 + 0.08 * Math.cos(t * 0.5), y: 0.8 + 0.07 * Math.sin(t * 0.7), r: 0.3, color: "rgba(60,0,120,0.1)" },
          ]
        : [
            { x: 0.18 + 0.1 * Math.sin(t * 0.7), y: 0.28 + 0.08 * Math.cos(t * 0.5), r: 0.38, color: "rgba(200,255,0,0.10)" },
            { x: 0.72 + 0.09 * Math.cos(t * 0.6), y: 0.22 + 0.09 * Math.sin(t * 0.8), r: 0.32, color: "rgba(100,20,160,0.09)" },
            { x: 0.5 + 0.12 * Math.sin(t * 0.4), y: 0.68 + 0.07 * Math.cos(t * 0.9), r: 0.36, color: "rgba(200,255,0,0.07)" },
          ];

      for (const blob of blobs) {
        const gx = blob.x * w;
        const gy = blob.y * h;
        const gr = blob.r * Math.max(w, h);
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        grad.addColorStop(0, blob.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [low, dense]);

  if (low) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${className}`}
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(200,255,0,0.07) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 75% 25%, rgba(100,20,160,0.06) 0%, transparent 70%)",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
