"use client";

import { useEffect, useState, useRef } from "react";

interface Heading {
  id: string;
  text: string;
}

interface Props {
  selector?: string;
  className?: string;
}

export default function TableOfContents({
  selector = "article h2",
  className = "",
}: Props) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Extract headings on mount
  useEffect(() => {
    const extractHeadings = () => {
      const els = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
      const items = els.map((el) => {
        // Ensure the heading has an id for anchor linking
        if (!el.id) {
          el.id = el.textContent
            ?.toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "") ?? `h-${Math.random().toString(36).slice(2, 6)}`;
        }
        return { id: el.id, text: el.textContent ?? "" };
      });
      setHeadings(items);
    };

    extractHeadings();

    // MutationObserver in case content loads late (rare with SSG but safe)
    const mo = new MutationObserver(extractHeadings);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [selector]);

  // IntersectionObserver to track active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const observers: IntersectionObserver[] = [];

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveId(id);
          });
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Tabla de contenidos"
      className={`hidden lg:block ${className}`}
    >
      <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
        En este texto
      </p>
      <ul className="space-y-2">
        {headings.map(({ id, text }) => {
          const isActive = id === activeId;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                className="group flex items-start gap-2 text-sm leading-snug transition-colors duration-200"
                style={{
                  color: isActive ? "#c8ff00" : "#888888",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                <span
                  className="mt-[6px] h-[1px] flex-shrink-0 transition-all duration-300"
                  style={{
                    background: isActive ? "#c8ff00" : "rgba(136,136,136,0.4)",
                    width: isActive ? "16px" : "8px",
                  }}
                />
                <span className="line-clamp-2">{text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
