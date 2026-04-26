"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Home, BookOpen, Megaphone, type LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  home: Home,
  archive: BookOpen,
  manifesto: Megaphone,
};
import { useRef } from "react";
import { useCoarsePointer } from "../../lib/useCoarsePointer";

interface DockItem {
  href: string;
  label: string;
  icon: string;
  active?: boolean;
}

interface Props {
  items: DockItem[];
}

function DockItemDesktop({ item }: { item: DockItem }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.a
      ref={ref}
      href={item.href}
      aria-label={item.label}
      aria-current={item.active ? "page" : undefined}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        padding: "6px 14px",
        borderRadius: "8px",
        background: item.active ? "rgba(227, 6, 19,0.12)" : "transparent",
        transition: "background 150ms",
        textDecoration: "none",
      }}
      whileHover={{ y: -2 }}
    >
      {(() => { const I = ICON_MAP[item.icon]; return I ? <I size={16} strokeWidth={1.5} /> : null; })()}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: item.active ? "#e30613" : "#888888",
          transition: "color 150ms",
        }}
      >
        {item.label}
      </span>
      {item.active && (
        <span
          style={{
            position: "absolute",
            bottom: "-2px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            background: "#e30613",
          }}
        />
      )}
    </motion.a>
  );
}

export default function FloatingDock({ items }: Props) {
  const coarse = useCoarsePointer();

  const mobileNav = (
    <nav
      aria-label="Navegación flotante"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "8px 12px",
        background: "rgba(17,17,17,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "999px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
      }}
    >
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          aria-label={item.label}
          aria-current={item.active ? "page" : undefined}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            padding: "6px 14px",
            borderRadius: "999px",
            background: item.active ? "rgba(227, 6, 19,0.14)" : "transparent",
            textDecoration: "none",
            minWidth: "52px",
          }}
        >
          {(() => { const I = ICON_MAP[item.icon]; return I ? <I size={18} strokeWidth={1.5} /> : null; })()}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: item.active ? "#e30613" : "#888888",
            }}
          >
            {item.label}
          </span>
        </a>
      ))}
    </nav>
  );

  const desktopNav = null;

  return (
    <>
      <div className="md:hidden">{mobileNav}</div>
    </>
  );
}
