"use client";

import { motion } from "framer-motion";
import BlogCardReact from "../../BlogCardReact";

interface PostItem {
  id: string;
  title: string;
  description: string;
  category: string;
  kicker?: string;
  readingMinutes: number;
  pubDate?: string;
}

interface Props {
  posts: PostItem[];
  className?: string;
}

export default function RelatedPosts({ posts, className = "" }: Props) {
  if (!posts.length) return null;

  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginTop: "5rem" }}
    >
      <div
        style={{
          marginBottom: "2.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "var(--color-neon)",
          }}
        >
          [ Seguí leyendo ]
        </span>
        <span style={{ height: 1, flex: 1, background: "var(--color-line)" }} />
      </div>

      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <BlogCardReact
              href={`/blog/${post.id}`}
              title={post.title}
              description={post.description}
              category={post.category}
              kicker={post.kicker}
              pubDate={post.pubDate ?? new Date().toISOString()}
              readingMinutes={post.readingMinutes}
              index={i}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
