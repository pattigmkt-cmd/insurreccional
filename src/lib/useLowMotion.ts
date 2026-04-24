import { useEffect, useState } from "react";

/**
 * Returns true when the device prefers reduced motion OR has a coarse pointer
 * (mobile/tablet). Use it to gate heavy animations.
 */
export function useLowMotion() {
  const [low, setLow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mqCoarse = window.matchMedia("(hover: none), (pointer: coarse)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setLow(mqCoarse.matches || mqReduced.matches);
    update();
    mqCoarse.addEventListener?.("change", update);
    mqReduced.addEventListener?.("change", update);
    return () => {
      mqCoarse.removeEventListener?.("change", update);
      mqReduced.removeEventListener?.("change", update);
    };
  }, []);

  return low;
}
