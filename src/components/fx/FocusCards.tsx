"use client";

import React, { useState } from "react";
import { useCoarsePointer } from "../../lib/useCoarsePointer";

interface Props {
  children: React.ReactNode;
  className?: string;
  blurAmount?: number;
}

export default function FocusCards({ children, className = "", blurAmount = 4 }: Props) {
  const coarse = useCoarsePointer();
  const [hovered, setHovered] = useState<number | null>(null);
  const childArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childArray.map((child, i) => (
        <div
          key={i}
          onMouseEnter={() => !coarse && setHovered(i)}
          onMouseLeave={() => !coarse && setHovered(null)}
          style={{
            transition: "filter 0.35s ease, opacity 0.35s ease",
            filter:
              !coarse && hovered !== null && hovered !== i
                ? `blur(${blurAmount}px)`
                : undefined,
            opacity:
              !coarse && hovered !== null && hovered !== i
                ? 0.55
                : 1,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
