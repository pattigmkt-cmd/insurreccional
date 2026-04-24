"use client";

import { useLowMotion } from "../../../lib/useLowMotion";

interface Props {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  duration?: number;
}

export default function TextShimmer({
  text,
  className = "",
  as: Tag = "span",
  duration = 2.5,
}: Props) {
  const low = useLowMotion();

  const shimId = `shimmer-${text.slice(0, 6).replace(/\s/g, "")}`;

  if (low) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <>
      <style>{`
        @keyframes ${shimId}-move {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .${shimId} {
          background: linear-gradient(
            90deg,
            var(--color-bone-soft) 0%,
            var(--color-bone-soft) 40%,
            var(--color-neon) 50%,
            var(--color-bone-soft) 60%,
            var(--color-bone-soft) 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: ${shimId}-move ${duration}s linear infinite;
        }
      `}</style>
      <Tag className={`${shimId} ${className}`}>{text}</Tag>
    </>
  );
}
