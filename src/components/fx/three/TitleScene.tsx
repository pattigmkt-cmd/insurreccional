import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
import * as THREE from "three";
import { useLowMotion } from "../../../lib/useLowMotion";

const NEON = "#c8ff00";
const FONT_URL = "/fonts/helvetiker_bold.typeface.json";

/**
 * Why: title rendered in DOM as sr-only for SEO/a11y; the visible 3D mesh is decorative.
 */
function TitleMesh({ text }: { text: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport, pointer } = useThree();

  const fontSize = useMemo(() => {
    const longest = text.split(/\s+/).reduce((a, b) => (a.length > b.length ? a : b), "");
    const charBudget = Math.max(longest.length, 6);
    return Math.min(1.6, (viewport.width * 0.95) / (charBudget * 0.62));
  }, [text, viewport.width]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.05;
    const targetRotX = pointer.y * 0.18;
    const targetRotY = pointer.x * 0.32 + Math.sin(t * 0.25) * 0.04;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <Center>
        <Text3D
          font={FONT_URL}
          size={fontSize}
          height={fontSize * 0.18}
          curveSegments={6}
          bevelEnabled
          bevelThickness={fontSize * 0.018}
          bevelSize={fontSize * 0.012}
          bevelSegments={3}
          letterSpacing={-0.04}
          lineHeight={0.92}
        >
          {text}
          <meshStandardMaterial
            color={NEON}
            emissive={NEON}
            emissiveIntensity={1.4}
            metalness={0.35}
            roughness={0.42}
          />
        </Text3D>
      </Center>
    </group>
  );
}

function Scene({ text }: { text: string }) {
  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 6, 18]} />
      <ambientLight intensity={0.18} />
      <pointLight position={[0, 0, 6]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-4, -3, -2]} intensity={2.4} color={NEON} distance={12} decay={1.5} />
      <pointLight position={[4, 3, -1]} intensity={1.6} color="#ff3da6" distance={10} decay={1.8} />
      <Suspense fallback={null}>
        <TitleMesh text={text} />
      </Suspense>
    </>
  );
}

export interface TitleSceneProps {
  text: string;
  className?: string;
}

export default function TitleScene({ text, className }: TitleSceneProps) {
  const low = useLowMotion();

  if (low) return null;

  return (
    <div
      className={className ?? "relative h-[58vh] min-h-[360px] w-full overflow-hidden"}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 42 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Scene text={text} />
      </Canvas>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 100%, rgba(5,5,5,0) 55%, rgba(5,5,5,0.92) 100%)",
        }}
      />
    </div>
  );
}
