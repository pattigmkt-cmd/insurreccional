"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface Props {
  text: string;
  as?: Tag;
  delay?: number;
  className?: string;
  once?: boolean;
}

export default function TextGenerate({
  text,
  as: Tag = "p",
  delay = 0,
  className = "",
  once = true,
}: Props) {
  const low = useLowMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once, margin: "-40px" });

  const words = text.split(" ");

  if (low) {
    return <Tag ref={ref as any} className={className}>{text}</Tag>;
  }

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const MotionTag = motion[Tag] as any;

  return (
    <MotionTag
      ref={ref}
      className={`${className} inline`}
      variants={container}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={child}
          className="inline-block"
          style={{ marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}
