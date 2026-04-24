// Static — no JS needed

interface Props {
  className?: string;
  opacity?: number;
  spacing?: number;
}

export default function DotPattern({
  className = "",
  opacity = 0.18,
  spacing = 28,
}: Props) {
  const id = `dot-${spacing}`;
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={id} x="0" y="0" width={spacing} height={spacing} patternUnits="userSpaceOnUse">
          <circle cx={spacing / 2} cy={spacing / 2} r="0.8" fill="#f0ece4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity={opacity} />
    </svg>
  );
}
