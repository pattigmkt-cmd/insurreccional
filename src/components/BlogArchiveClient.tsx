"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BlogCardReact from "./BlogCardReact";

interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  kicker?: string;
  readingMinutes: number;
  pubDate: string;
}

interface Props {
  posts: Post[];
  categories: string[];
}

export default function BlogArchiveClient({ posts, categories }: Props) {
  const [active, setActive] = useState("Todos");

  const tabs = ["Todos", ...categories];

  const filtered = useMemo(
    () => (active === "Todos" ? posts : posts.filter((p) => p.category === active)),
    [active, posts]
  );

  return (
    <div>
      <div className="mb-12 flex flex-wrap items-center gap-2 md:gap-3">
        {tabs.map((label) => {
          const isActive = active === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActive(label)}
              aria-pressed={isActive}
              className={[
                "rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-200",
                isActive
                  ? "bg-neon text-ink"
                  : "border border-line text-mute hover:border-neon/50 hover:text-bone",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10"
        >
          {filtered.map((post, i) => (
            <BlogCardReact
              key={post.id}
              href={`/blog/${post.id}`}
              title={post.title}
              description={post.description}
              category={post.category}
              kicker={post.kicker}
              pubDate={post.pubDate}
              readingMinutes={post.readingMinutes}
              index={i}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <p className="py-20 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-mute">
          Sin textos en esta categoría todavía
        </p>
      )}
    </div>
  );
}
