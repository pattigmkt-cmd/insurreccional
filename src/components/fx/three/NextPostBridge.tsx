import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
import * as THREE from "three";
import { useLowMotion } from "../../../lib/useLowMotion";

const NEON = "#B00002";
const FONT_URL = "/fonts/helvetiker_bold.typeface.json";

type ProgressRef = { value: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function MorphTitle({
  text,
  side,
  progressRef,
}: {
  text: string;
  side: "current" | "next";
  progressRef: React.MutableRefObject<ProgressRef>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const { viewport } = useThree();

  const fontSize = useMemo(() => {
    const longest = text.split(/\s+/).reduce((a, b) => (a.length > b.length ? a : b), "");
    const charBudget = Math.max(longest.length, 6);
    return Math.min(1.4, (viewport.width * 0.92) / (charBudget * 0.62));
  }, [text, viewport.width]);

  useFrame(() => {
    const p = progressRef.current.value;
    if (!groupRef.current || !matRef.current) return;

    if (side === "current") {
      // current: starts at z=0 large+visible, exits forward (toward camera) and dissolves
      const localP = clamp(p / 0.55, 0, 1);
      groupRef.current.position.z = THREE.MathUtils.lerp(0, 4.5, localP);
      const scale = THREE.MathUtils.lerp(1, 1.8, localP);
      groupRef.current.scale.setScalar(scale);
      matRef.current.opacity = 1 - localP;
      matRef.current.emissiveIntensity = THREE.MathUtils.lerp(1.5, 0.2, localP);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(0, -0.18, localP);
    } else {
      // next: starts far away small+invisible, arrives at z=0 large+visible
      const localP = clamp((p - 0.35) / 0.65, 0, 1);
      groupRef.current.position.z = THREE.MathUtils.lerp(-9, 0, localP);
      const scale = THREE.MathUtils.lerp(0.35, 1, localP);
      groupRef.current.scale.setScalar(scale);
      matRef.current.opacity = localP;
      matRef.current.emissiveIntensity = THREE.MathUtils.lerp(0.4, 1.6, localP);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(0.22, 0, localP);
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <Text3D
          font={FONT_URL}
          size={fontSize}
          height={fontSize * 0.16}
          curveSegments={6}
          bevelEnabled
          bevelThickness={fontSize * 0.016}
          bevelSize={fontSize * 0.01}
          bevelSegments={3}
          letterSpacing={-0.04}
          lineHeight={0.92}
        >
          {text}
          <meshStandardMaterial
            ref={matRef}
            color={NEON}
            emissive={NEON}
            emissiveIntensity={1.5}
            metalness={0.3}
            roughness={0.45}
            transparent
            opacity={1}
          />
        </Text3D>
      </Center>
    </group>
  );
}

function CameraDrift({ progressRef }: { progressRef: React.MutableRefObject<ProgressRef> }) {
  useFrame((state) => {
    const p = progressRef.current.value;
    state.camera.position.z = THREE.MathUtils.lerp(5, 3.4, p);
    state.camera.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.04;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function BridgeScene({
  currentTitle,
  nextTitle,
  progressRef,
}: {
  currentTitle: string;
  nextTitle: string;
  progressRef: React.MutableRefObject<ProgressRef>;
}) {
  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 5, 16]} />
      <ambientLight intensity={0.16} />
      <pointLight position={[0, 0, 6]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-4, -3, -2]} intensity={2.6} color={NEON} distance={14} decay={1.5} />
      <pointLight position={[4, 3, -1]} intensity={1.4} color="#ff3da6" distance={10} decay={1.8} />
      <CameraDrift progressRef={progressRef} />
      <Suspense fallback={null}>
        <MorphTitle text={currentTitle} side="current" progressRef={progressRef} />
        <MorphTitle text={nextTitle} side="next" progressRef={progressRef} />
      </Suspense>
    </>
  );
}

export interface NextPostBridgeProps {
  currentTitle: string;
  nextTitle: string;
  nextHook?: string;
  nextHref: string;
  nextCategory?: string;
  nextReadingMinutes?: number;
}

export default function NextPostBridge({
  currentTitle,
  nextTitle,
  nextHook,
  nextHref,
  nextCategory,
  nextReadingMinutes,
}: NextPostBridgeProps) {
  const low = useLowMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<ProgressRef>({ value: 0 });
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (low) return;
    const update = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress 0 when top of section enters viewport bottom; 1 when bottom of section reaches viewport top
      const total = rect.height + vh;
      const traveled = vh - rect.top;
      const p = clamp(traveled / total, 0, 1);
      progressRef.current.value = p;
      if (ctaRef.current) {
        ctaRef.current.style.opacity = p > 0.78 ? "1" : `${Math.max(0, (p - 0.55) / 0.23) * 0.6}`;
        ctaRef.current.style.transform = `translateY(${(1 - p) * 30}px)`;
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [low]);

  // Low-motion fallback: simple text card linking to next post.
  if (low) {
    return (
      <aside className="mx-auto mt-24 max-w-2xl border-t border-line pt-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
          Continúa →
        </p>
        <a
          href={nextHref}
          className="mt-4 block font-serif text-2xl leading-tight text-bone transition-colors hover:text-neon md:text-3xl"
        >
          {nextTitle}
        </a>
        {nextHook && (
          <p className="mt-3 max-w-xl font-serif italic text-mute">{nextHook}</p>
        )}
        <div className="mt-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-mute-dim">
          {nextCategory && <span>{nextCategory}</span>}
          {nextReadingMinutes && <span>· {nextReadingMinutes} min</span>}
        </div>
      </aside>
    );
  }

  return (
    <section
      ref={wrapperRef}
      className="relative mt-32 h-[180vh] w-full"
      aria-label="Próxima nota"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 42 }}
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        >
          <BridgeScene
            currentTitle={currentTitle}
            nextTitle={nextTitle}
            progressRef={progressRef}
          />
        </Canvas>

        {/* Vignette + ambient gradient */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 50%, rgba(5,5,5,0) 50%, rgba(5,5,5,0.85) 100%)",
          }}
        />

        {/* Fixed UI overlay */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 sm:p-10">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-neon">
            <span className="h-px w-8 bg-neon/60" />
            <span>Próxima nota</span>
          </div>

          <div className="flex flex-col items-center gap-6">
            {nextHook && (
              <p
                className="max-w-xl text-center font-serif text-base italic text-bone-soft md:text-lg"
                style={{
                  opacity: 0,
                  animation: "none",
                }}
                ref={(el) => {
                  if (!el) return;
                  // Hook text uses CSS to fade in tied to scroll via dataset; simpler: rely on JS
                }}
              >
                {nextHook}
              </p>
            )}
            <a
              ref={ctaRef}
              href={nextHref}
              className="pointer-events-auto inline-flex items-center gap-3 border border-neon/40 bg-neon/5 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.32em] text-neon backdrop-blur-sm transition-all duration-500 hover:bg-neon hover:text-ink"
              style={{ opacity: 0, transform: "translateY(30px)" }}
            >
              <span>Entrar</span>
              <span aria-hidden="true">→</span>
            </a>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-mute">
              {nextCategory && <span>{nextCategory}</span>}
              {nextReadingMinutes && <span>· {nextReadingMinutes} min</span>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
