"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TabsSlide from "./fx/TabsSlide";
import HoverRevealCard from "./fx/HoverRevealCard";

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
  const [active, setActive] = useState("todos");

  const tabs = [
    { label: "Todos", value: "todos" },
    ...categories.map((c) => ({ label: c, value: c })),
  ];

  const filtered = active === "todos" ? posts : posts.filter((p) => p.category === active);

  // Group by category for display
  const grouped: Record<string, Post[]> = {};
  if (active === "todos") {
    categories.forEach((cat) => {
      grouped[cat] = posts.filter((p) => p.category === cat);
    });
  } else {
    grouped[active] = filtered;
  }

  return (
    <div>
      {/* Tabs */}
      <div className="mb-12 flex flex-wrap items-center gap-3">
        <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
          Filtrar:
        </span>
        <TabsSlide tabs={tabs} active={active} onChange={setActive} />
      </div>

      {/* Posts grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {Object.entries(grouped).map(([category, catPosts]) => (
            <div key={category} className="mb-20">
              <header className="mb-8 flex items-baseline justify-between gap-6 border-b border-line pb-4">
                <h2 className="font-serif text-3xl font-bold italic text-bone md:text-4xl">
                  {category}
                </h2>
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute">
                  {String(catPosts.length).padStart(2, "0")} texto{catPosts.length !== 1 ? "s" : ""}
                </span>
              </header>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {catPosts.map((post) => (
                  <HoverRevealCard
                    key={post.id}
                    href={`/blog/${post.id}`}
                    title={post.title}
                    subtitle={post.kicker}
                    description={post.description}
                    category={post.category}
                    meta={`${post.readingMinutes} min`}
                    className="h-full"
                  />
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
