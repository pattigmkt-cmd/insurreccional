"use client";

import { motion } from "framer-motion";
import HoverRevealCard from "../../fx/HoverRevealCard";

interface PostItem {
  id: string;
  title: string;
  description: string;
  category: string;
  kicker?: string;
  readingMinutes: number;
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
      style={{ marginTop: "4rem" }}
    >
      <div
        style={{
          marginBottom: "2rem",
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <HoverRevealCard
              href={`/blog/${post.id}`}
              title={post.title}
              subtitle={post.kicker}
              description={post.description}
              category={post.category}
              meta={`${post.readingMinutes} min`}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
