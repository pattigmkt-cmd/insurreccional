import { useEffect, useState } from "react";

/**
 * Returns true when the user has explicitly opted into reduced motion via the
 * OS, or when the device reports under 4GB of memory. Touch alone no longer
 * triggers low mode (mobile devices get the full animations unless they signal
 * one of the constraints above). Use it to gate WebGL canvases, heavy rAF
 * loops, and pointer-following gradients with a static fallback.
 */
export function useLowMotion() {
  const [low, setLow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const navAny = navigator as Navigator & { deviceMemory?: number };
    const lowMem =
      typeof navAny.deviceMemory === "number" && navAny.deviceMemory < 4;
    const update = () => setLow(mqReduced.matches || lowMem);
    update();
    mqReduced.addEventListener?.("change", update);
    return () => {
      mqReduced.removeEventListener?.("change", update);
    };
  }, []);

  return low;
}
