"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

interface Item {
  title: string;
  description: string;
}

interface Props {
  items: Item[];
  accent?: string;
}

export default function StickyScroll({ items, accent = "#c8ff00" }: Props) {
  const low = useLowMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (low) return;
    const observers: IntersectionObserver[] = [];
    const itemEls = containerRef.current?.querySelectorAll("[data-sticky-item]");

    itemEls?.forEach((el, i) => {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveIndex(i);
          });
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [low]);

  if (low) {
    return (
      <div className="space-y-10">
        {items.map((item, i) => (
          <div key={i} className="border-l-2 border-line pl-6">
            <p
              className="mb-1 font-mono text-[10px] uppercase tracking-[0.3em]"
              style={{ color: accent }}
            >
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="font-serif text-2xl font-bold text-bone md:text-3xl">
              {item.title}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-bone-soft md:text-lg">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative grid gap-0 md:grid-cols-2">
      {/* Sticky left */}
      <div className="relative hidden md:block">
        <div className="sticky top-1/3 pb-10">
          <p
            className="mb-6 font-mono text-[11px] uppercase tracking-[0.35em]"
            style={{ color: accent }}
          >
            Cinco tesis · {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </p>
          <div className="flex flex-col gap-3">
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  const el = containerRef.current?.querySelectorAll("[data-sticky-item]")[i];
                  el?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className="group flex items-center gap-3 text-left"
              >
                <span
                  className="h-[1px] w-6 transition-all duration-300"
                  style={{
                    background: i === activeIndex ? accent : "rgba(136,136,136,0.4)",
                    width: i === activeIndex ? "32px" : "16px",
                  }}
                />
                <span
                  className="font-serif text-sm transition-colors duration-300"
                  style={{ color: i === activeIndex ? accent : "rgba(240,236,228,0.45)" }}
                >
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: scrollable items */}
      <div className="space-y-0">
        {items.map((item, i) => (
          <div
            key={i}
            data-sticky-item
            className="min-h-[60vh] py-16 md:min-h-[70vh] md:py-24"
          >
            <motion.div
              initial={{ opacity: 0.35, y: 20 }}
              animate={activeIndex === i ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 20 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="font-mono text-4xl font-bold md:text-6xl"
                  style={{ color: accent }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-serif text-3xl font-bold leading-tight text-bone md:text-4xl lg:text-5xl">
                {item.title}
              </h3>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-bone-soft md:text-lg">
                {item.description}
              </p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
