import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";

function Pen() {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const targetX = -mouse.current.y * 0.25 + 0.25;
    const targetZ = mouse.current.x * 0.25 - 0.4;
    g.rotation.x += (targetX - g.rotation.x) * Math.min(1, delta * 3);
    g.rotation.z += (targetZ - g.rotation.z) * Math.min(1, delta * 3);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
      <group ref={group} rotation={[0.25, 0, -0.4]}>
        {/* Body cap (top) */}
        <mesh castShadow position={[0, 1.55, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.18, 64]} />
          <meshPhysicalMaterial color="#e6d9b3" metalness={1} roughness={0.28} clearcoat={0.7} />
        </mesh>

        {/* Top dome */}
        <mesh castShadow position={[0, 1.66, 0]}>
          <sphereGeometry args={[0.27, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial color="#e6d9b3" metalness={1} roughness={0.28} clearcoat={0.7} />
        </mesh>

        {/* Main barrel (cream) */}
        <mesh castShadow>
          <cylinderGeometry args={[0.28, 0.28, 2.9, 64]} />
          <meshPhysicalMaterial color="#f6efe0" metalness={0.15} roughness={0.5} clearcoat={0.85} sheen={0.6} sheenColor="#fff" />
        </mesh>

        {/* Gold band */}
        <mesh castShadow position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.29, 0.29, 0.06, 64]} />
          <meshPhysicalMaterial color="#c9b582" metalness={1} roughness={0.2} />
        </mesh>

        {/* Lower taper */}
        <mesh castShadow position={[0, -1.55, 0]}>
          <cylinderGeometry args={[0.28, 0.12, 0.25, 64]} />
          <meshPhysicalMaterial color="#f6efe0" metalness={0.2} roughness={0.5} clearcoat={0.7} />
        </mesh>

        {/* Tip */}
        <mesh castShadow position={[0, -1.74, 0]}>
          <cylinderGeometry args={[0.12, 0.08, 0.14, 64]} />
          <meshPhysicalMaterial color="#cdbf8e" metalness={1} roughness={0.3} />
        </mesh>

        {/* Subtle label engraving */}
        <mesh position={[0, 0.2, 0.281]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.32, 0.06]} />
          <meshBasicMaterial color="#9a8b58" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
}

export function Pen3D({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className={className} />;

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 32 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-5, 3, -2]} intensity={0.5} color="#cfe0f7" />
        <Suspense fallback={null}>
          <Pen />
          <ContactShadows position={[0, -2.1, 0]} opacity={0.3} blur={2.6} far={4} />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
