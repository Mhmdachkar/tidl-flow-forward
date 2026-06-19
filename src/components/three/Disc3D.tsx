import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";

function Disc({ scrollY }: { scrollY: { current: number } }) {
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
    // mouse-follow rotation
    const targetX = -mouse.current.y * 0.35 + scrollY.current * 0.4;
    const targetY = mouse.current.x * 0.5;
    g.rotation.x += (targetX - g.rotation.x) * Math.min(1, delta * 4);
    g.rotation.y += (targetY - g.rotation.y) * Math.min(1, delta * 4);
    // continuous slow spin
    g.rotation.z += delta * 0.08;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.45}>
      <group ref={group} rotation={[0.55, 0, 0]}>
        {/* Outer ring (brushed gold metal) */}
        <mesh castShadow receiveShadow>
          <torusGeometry args={[1.35, 0.07, 64, 200]} />
          <meshPhysicalMaterial
            color="#d8c79a"
            metalness={1}
            roughness={0.22}
            clearcoat={1}
            clearcoatRoughness={0.15}
          />
        </mesh>

        {/* Main disc body */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.32, 1.32, 0.18, 200]} />
          <meshPhysicalMaterial
            color="#f1eadb"
            metalness={0.85}
            roughness={0.32}
            clearcoat={0.6}
            sheen={0.5}
            sheenColor="#fff4d6"
          />
        </mesh>

        {/* Inner inset */}
        <mesh position={[0, 0.092, 0]} castShadow>
          <cylinderGeometry args={[1.15, 1.15, 0.02, 128]} />
          <meshPhysicalMaterial
            color="#e8dcb8"
            metalness={1}
            roughness={0.4}
          />
        </mesh>

        {/* Engraved center dot */}
        <mesh position={[0, 0.105, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.005, 64]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Subtle inner ring */}
        <mesh position={[0, 0.102, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.58, 128]} />
          <meshBasicMaterial color="#9a8c5a" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
}

export function Disc3D({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const scrollY = useRef(0);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      const max = window.innerHeight;
      scrollY.current = Math.min(1, Math.max(-1, window.scrollY / max));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!mounted) return <div className={className} />;

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0.4, 4.2], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 4]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-4, 2, -2]} intensity={0.6} color="#cbd9ee" />
        <Suspense fallback={null}>
          <Disc scrollY={scrollY} />
          <ContactShadows position={[0, -1.4, 0]} opacity={0.35} blur={2.4} far={3} resolution={512} />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
