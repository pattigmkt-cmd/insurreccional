"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLowMotion } from "../../lib/useLowMotion";

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "span";

interface Props {
  text: string;
  as?: Tag;
  delay?: number;
  staggerDelay?: number;
  className?: string;
  once?: boolean;
}

export default function SplitText({
  text,
  as: Tag = "span",
  delay = 0,
  staggerDelay = 0.025,
  className = "",
  once = true,
}: Props) {
  const low = useLowMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once, margin: "-40px" });

  const chars = text.split("");

  if (low) {
    return (
      <Tag ref={ref as any} className={className}>
        {text}
      </Tag>
    );
  }

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const charVariant = {
    hidden: {
      opacity: 0,
      y: 18,
      rotateX: -40,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const MotionTag = motion[Tag] as any;

  return (
    <MotionTag
      ref={ref}
      className={`${className} inline-block`}
      style={{ perspective: "600px" }}
      variants={container}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      aria-label={text}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          variants={charVariant}
          className="inline-block"
          style={{
            whiteSpace: char === " " ? "pre" : undefined,
            transformOrigin: "50% 0%",
          }}
          aria-hidden="true"
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </MotionTag>
  );
}
