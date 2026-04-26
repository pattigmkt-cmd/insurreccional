"use client";

import { useEffect, useRef } from "react";
import { useLowMotion } from "../../../lib/useLowMotion";

interface Props {
  className?: string;
  cellSize?: number;
  flickerChance?: number;
  color?: string;
  opacity?: number;
}

export default function FlickeringGrid({
  className = "",
  cellSize = 20,
  flickerChance = 0.003,
  color = "#e30613",
  opacity = 0.06,
}: Props) {
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
    const TARGET_FPS = 24;
    const FRAME_MS = 1000 / TARGET_FPS;

    let cols = 0;
    let rows = 0;
    let grid: number[][] = [];

    const resize = () => {
      canvas.width = Math.floor(canvas.offsetWidth * DPR);
      canvas.height = Math.floor(canvas.offsetHeight * DPR);
      cols = Math.ceil(canvas.width / (cellSize * DPR));
      rows = Math.ceil(canvas.height / (cellSize * DPR));
      grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Math.random() > 0.85 ? 1 : 0)
      );
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const rgb = hexToRgb(color.startsWith("#") ? color : "#e30613");

    const draw = (now: number) => {
      rafRef.current = requestAnimationFrame(draw);
      if (now - lastFrameRef.current < FRAME_MS) return;
      lastFrameRef.current = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cs = cellSize * DPR;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() < flickerChance) {
            grid[r][c] = Math.random() > 0.5 ? 1 : 0;
          }
          if (grid[r][c]) {
            const alpha = opacity * (0.4 + Math.random() * 0.6);
            ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
            ctx.fillRect(c * cs + 1, r * cs + 1, cs - 2, cs - 2);
          }
        }
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [low, cellSize, flickerChance, color, opacity]);

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
