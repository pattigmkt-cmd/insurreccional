// Static grain overlay — no JS

interface Props {
  className?: string;
  opacity?: number;
}

export default function GrainOverlay({ className = "", opacity = 0.04 }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[9998] ${className}`}
      style={{
        opacity,
        mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/></svg>")`,
      }}
    />
  );
}
