// Static — no JS needed

interface Props {
  className?: string;
  opacity?: number;
}

export default function RetroGrid({ className = "", opacity = 0.12 }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ perspective: "600px" }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "-20%",
          right: "-20%",
          height: "70%",
          transform: "rotateX(72deg)",
          transformOrigin: "bottom center",
          backgroundImage: `
            linear-gradient(to right, rgba(200,255,0,${opacity}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(200,255,0,${opacity}) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)",
        }}
      />
    </div>
  );
}
