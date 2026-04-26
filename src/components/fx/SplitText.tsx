"use client";

import { motion } from "framer-motion";
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
}: Props) {
  const low = useLowMotion();

  if (low) {
    return <Tag className={className}>{text}</Tag>;
  }

  const tokens = text.split(/(\s+)/);

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

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const MotionTag = motion[Tag] as any;

  return (
    <MotionTag
      className={className}
      style={{ perspective: "600px" }}
      variants={container}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {tokens.map((token, ti) => {
        if (/^\s+$/.test(token)) {
          return (
            <span key={`s-${ti}`} style={{ whiteSpace: "pre" }} aria-hidden="true">
              {token}
            </span>
          );
        }
        return (
          <span
            key={`w-${ti}`}
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
            aria-hidden="true"
          >
            {Array.from(token).map((char, ci) => (
              <motion.span
                key={`w-${ti}-${ci}`}
                variants={charVariant}
                style={{
                  display: "inline-block",
                  transformOrigin: "50% 0%",
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        );
      })}
    </MotionTag>
  );
}
