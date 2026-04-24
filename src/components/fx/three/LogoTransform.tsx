import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useLowMotion } from "../../../lib/useLowMotion";

const NEON = "#c8ff00";
const BONE = "#f0ece4";
const PARTICLE_COUNT = 1400;

type Vec3 = [number, number, number];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Sample N points from the brand mark: circle outline + italic "I" inside.
 * Returns world-unit positions roughly bounded in [-0.6, 0.6].
 */
function sampleLogoPositions(n: number): Vec3[] {
  const points: Vec3[] = [];
  const circleN = Math.floor(n * 0.55);
  const radius = 0.55;
  for (let i = 0; i < circleN; i++) {
    const t = (i / circleN) * Math.PI * 2;
    const jitter = (Math.random() - 0.5) * 0.018;
    points.push([
      Math.cos(t) * (radius + jitter),
      Math.sin(t) * (radius + jitter),
      (Math.random() - 0.5) * 0.04,
    ]);
  }
  const barN = n - circleN;
  for (let i = 0; i < barN; i++) {
    const yt = Math.random();
    const y = (yt - 0.5) * 0.78;
    // italic skew: x shifts right as y decreases (since +Y is up; italic leans right at top)
    const skew = -y * 0.18;
    const x = (Math.random() - 0.5) * 0.12 + skew;
    points.push([x, y, (Math.random() - 0.5) * 0.04]);
  }
  return points;
}

/**
 * Rasterize text on an offscreen canvas and sample non-empty pixels.
 * Returns positions in world units, centered at origin, fitted to maxWidthWorld.
 */
function sampleTextPositions(
  text: string,
  n: number,
  maxWidthWorld: number,
  maxHeightWorld: number,
): Vec3[] {
  if (typeof document === "undefined") return [];
  const cvs = document.createElement("canvas");
  // High enough resolution for clean sampling
  const baseW = 1400;
  const baseFont = 110;
  const font = `900 ${baseFont}px Georgia, "Playfair Display", serif`;

  const measureCtx = cvs.getContext("2d")!;
  measureCtx.font = font;

  // Word-wrap to maxWidth (in canvas px)
  const maxLineWidth = baseW - 60;
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? current + " " + word : word;
    const width = measureCtx.measureText(test).width;
    if (width > maxLineWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  const lineHeight = baseFont * 1.05;
  const totalH = lines.length * lineHeight + 40;
  cvs.width = baseW;
  cvs.height = totalH;

  const ctx = cvs.getContext("2d")!;
  ctx.font = font;
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "top";
  ctx.textAlign = "center";
  lines.forEach((line, i) => {
    ctx.fillText(line, baseW / 2, 20 + i * lineHeight);
  });

  // Sample non-empty pixels
  const data = ctx.getImageData(0, 0, cvs.width, cvs.height).data;
  const candidates: Vec3[] = [];
  const step = 3;
  for (let y = 0; y < cvs.height; y += step) {
    for (let x = 0; x < cvs.width; x += step) {
      const idx = (y * cvs.width + x) * 4;
      if (data[idx + 3] > 128) {
        candidates.push([x, y, 0]);
      }
    }
  }
  if (candidates.length === 0) return [];

  // Pick exactly N points (sample with replacement if needed)
  const picked: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const c = candidates[Math.floor(Math.random() * candidates.length)];
    picked.push([c[0], c[1], c[2]]);
  }

  // Normalize to world: fit cvs into [maxWidthWorld × maxHeightWorld]
  const scaleX = maxWidthWorld / cvs.width;
  const scaleY = maxHeightWorld / cvs.height;
  const scale = Math.min(scaleX, scaleY);
  const cx = cvs.width / 2;
  const cy = cvs.height / 2;
  return picked.map(([x, y, z]) => [
    (x - cx) * scale,
    -(y - cy) * scale, // flip Y for 3D space
    z + (Math.random() - 0.5) * 0.04,
  ]);
}

interface ParticlesProps {
  text: string;
}

function Particles({ text }: ParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const startRef = useRef<number | null>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Compute target positions once viewport + text are known
  const { from, to, perDelay, perAxis, perSpinSpeed } = useMemo(() => {
    const targetW = Math.min(viewport.width * 0.92, 7);
    const targetH = Math.min(viewport.height * 0.7, 3.6);
    const fromArr = sampleLogoPositions(PARTICLE_COUNT);
    const toArr = sampleTextPositions(text, PARTICLE_COUNT, targetW, targetH);
    const delays: number[] = [];
    const axes: Vec3[] = [];
    const spins: number[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      delays.push(Math.random() * 0.45);
      // random unit axis
      const v = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      ).normalize();
      axes.push([v.x, v.y, v.z]);
      spins.push(2 + Math.random() * 4);
    }
    return { from: fromArr, to: toArr, perDelay: delays, perAxis: axes, perSpinSpeed: spins };
  }, [text, viewport.width, viewport.height]);

  // Color per particle: starts bone-ish, ends neon. Set on init.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const colorBone = new THREE.Color(BONE);
    const colorNeon = new THREE.Color(NEON);
    const tmp = new THREE.Color();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // mix per particle for variety; will animate via emissive intensity
      const t = Math.random();
      tmp.copy(colorBone).lerp(colorNeon, t);
      mesh.setColorAt(i, tmp);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh || to.length === 0) return;
    if (startRef.current === null) startRef.current = clock.elapsedTime;
    const elapsed = clock.elapsedTime - startRef.current;

    // Total morph duration ~ 2.4s + max delay
    const morphDur = 2.0;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const delay = perDelay[i];
      const localT = clamp((elapsed - delay) / morphDur, 0, 1);
      const eased = easeInOutCubic(localT);

      const a = from[i];
      const b = to[i];
      const x = a[0] + (b[0] - a[0]) * eased;
      const y = a[1] + (b[1] - a[1]) * eased;
      // Arc: lift particles in Z mid-flight (camera looks down -Z, +Z is toward viewer)
      const arc = Math.sin(eased * Math.PI) * 0.6;
      const z = a[2] + (b[2] - a[2]) * eased + arc;

      // Rotation: spins fast at start, slows to zero at landing
      const spin = (1 - eased) * perSpinSpeed[i] * (elapsed - delay);
      const ax = perAxis[i];
      dummy.position.set(x, y, z);
      dummy.quaternion.setFromAxisAngle(new THREE.Vector3(ax[0], ax[1], ax[2]), spin);
      // Scale: bigger mid-flight, smaller when landed (settles at 0.018)
      const settleScale = 0.022;
      const flightBoost = Math.sin(eased * Math.PI) * 0.012;
      const s = settleScale + flightBoost;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    // After landing, gentle idle drift on whole group
    if (elapsed > morphDur + 0.5) {
      const idle = elapsed - (morphDur + 0.5);
      mesh.rotation.y = Math.sin(idle * 0.25) * 0.02;
      mesh.position.y = Math.sin(idle * 0.4) * 0.03;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        emissive={NEON}
        emissiveIntensity={0.85}
        metalness={0.55}
        roughness={0.35}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function Scene({ text }: { text: string }) {
  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 6, 16]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 0, 6]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-4, -2, 3]} intensity={2.2} color={NEON} distance={14} decay={1.5} />
      <pointLight position={[4, 3, 2]} intensity={1.1} color="#ff3da6" distance={10} decay={1.8} />
      <Particles text={text} />
    </>
  );
}

export interface LogoTransformProps {
  text: string;
  className?: string;
}

export default function LogoTransform({ text, className }: LogoTransformProps) {
  const low = useLowMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (low) return null;

  return (
    <div
      className={
        className ??
        "relative h-[58vh] min-h-[360px] w-full overflow-hidden bg-[#050505]"
      }
      aria-hidden="true"
    >
      {mounted && (
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 42 }}
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        >
          <Scene text={text} />
        </Canvas>
      )}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(140% 90% at 50% 100%, rgba(5,5,5,0) 50%, rgba(5,5,5,0.95) 100%)",
        }}
      />
    </div>
  );
}
