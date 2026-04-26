"use client";

import { motion } from "framer-motion";

interface Props {
  href: string;
  title: string;
  description: string;
  category: string;
  kicker?: string;
  pubDate: string;
  readingMinutes: number;
  index?: number;
}

const CATEGORY_TINT: Record<string, string> = {
  Criterio: "227, 6, 19",
  Industria: "255, 107, 107",
  Estrategia: "125, 211, 252",
};

function GraphicBlock({
  category,
  index,
}: {
  category: string;
  index: number;
}) {
  const tint = CATEGORY_TINT[category] ?? CATEGORY_TINT.Criterio;
  const indexLabel = String(index + 1).padStart(2, "0");

  return (
    <div
      className="relative h-44 w-full overflow-hidden rounded-2xl border border-line"
      style={{
        background: `radial-gradient(circle at 20% 20%, rgba(${tint}, 0.18) 0%, rgba(${tint}, 0.04) 45%, var(--color-surface) 80%)`,
      }}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 200 110"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id={`dots-${category}`}
            x="0"
            y="0"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="0.8" fill={`rgba(${tint}, 0.5)`} />
          </pattern>
        </defs>
        <rect
          width="200"
          height="110"
          fill={`url(#dots-${category})`}
          opacity="0.5"
        />
        <path
          d="M 130 80 Q 150 50, 170 70 T 200 60"
          stroke={`rgba(${tint}, 0.85)`}
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="195" cy="58" r="2" fill={`rgba(${tint}, 1)`} />
      </svg>

      <div className="absolute left-5 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
        / {indexLabel}
      </div>
      <div
        className="absolute bottom-4 left-5 font-serif text-3xl font-bold italic"
        style={{ color: `rgba(${tint}, 0.85)` }}
      >
        {category}
      </div>
    </div>
  );
}

export default function BlogCardReact({
  href,
  title,
  description,
  category,
  pubDate,
  readingMinutes,
  index = 0,
}: Props) {
  const date = new Date(pubDate).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.a
      href={href}
      className="group flex h-full flex-col gap-5"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <GraphicBlock category={category} index={index} />

      <div className="flex flex-1 flex-col gap-3 px-1">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-mute-dim">
          <span>{date}</span>
          <span aria-hidden="true">·</span>
          <span>{readingMinutes} min</span>
        </div>

        <h3 className="font-serif text-xl font-bold leading-[1.15] text-bone transition-colors group-hover:text-neon md:text-[1.4rem]">
          {title}
        </h3>

        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-mute">
          {description}
        </p>

        <span className="mt-auto inline-flex items-center gap-2 pt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-bone transition-colors group-hover:text-neon">
          Leer artículo
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </motion.a>
  );
}
