"use client";

import { useLowMotion } from "../../lib/useLowMotion";

interface QuoteItem {
  quote: string;
  author: string;
}

interface Props {
  items: QuoteItem[];
  speed?: number;
  direction?: "normal" | "reverse";
  className?: string;
}

function QuoteCard({ item }: { item: QuoteItem }) {
  return (
    <div
      className="flex-shrink-0 w-72 sm:w-80 border border-line bg-surface/60 p-6 mx-3"
      style={{ backdropFilter: "blur(4px)" }}
    >
      <p className="font-serif text-base italic leading-snug text-bone md:text-lg">
        &ldquo;{item.quote}&rdquo;
      </p>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-neon">
        · {item.author}
      </p>
    </div>
  );
}

export default function InfiniteQuotes({
  items,
  speed = 50,
  direction = "normal",
  className = "",
}: Props) {
  const low = useLowMotion();
  const duration = `${140 / (speed / 10)}s`;
  const animDir = direction === "reverse" ? "reverse" : "normal";

  if (low) {
    return (
      <div className={`flex flex-wrap gap-4 ${className}`}>
        {items.slice(0, 3).map((item, i) => (
          <QuoteCard key={i} item={item} />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex overflow-hidden ${className}`} aria-label="Citas del archivo">
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          style={{
            display: "flex",
            flexShrink: 0,
            animation: `iq-scroll ${duration} linear infinite ${animDir}`,
          }}
          className="iq-track"
        >
          {items.map((item, i) => (
            <QuoteCard key={i} item={item} />
          ))}
        </div>
      ))}
      <style>{`
        @keyframes iq-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .iq-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .iq-track { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
