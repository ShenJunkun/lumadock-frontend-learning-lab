import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { Group } from "three";

type ProductSceneProps = {
  accent?: string;
};

function DockModel({ accent, animate }: { accent: string; animate: boolean }) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!animate || !groupRef.current) {
      return;
    }
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.16;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.035;
  });

  return (
    <group ref={groupRef} rotation={[0.15, -0.35, 0]}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.34, 1.24]} />
        <meshStandardMaterial color="#20252d" metalness={0.62} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.2, -0.55]}>
        <boxGeometry args={[3.1, 0.08, 0.08]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.75} />
      </mesh>
      <mesh position={[-1.12, 0.23, 0.66]}>
        <boxGeometry args={[0.54, 0.12, 0.08]} />
        <meshStandardMaterial color="#dfe7e9" metalness={0.5} roughness={0.22} />
      </mesh>
      <mesh position={[-0.28, 0.23, 0.66]}>
        <boxGeometry args={[0.54, 0.12, 0.08]} />
        <meshStandardMaterial color="#dfe7e9" metalness={0.5} roughness={0.22} />
      </mesh>
      <mesh position={[0.64, 0.25, 0.66]}>
        <boxGeometry args={[0.88, 0.16, 0.08]} />
        <meshStandardMaterial color="#12161c" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[1.35, 0.28, -0.02]}>
        <boxGeometry args={[0.62, 0.28, 0.94]} />
        <meshStandardMaterial color="#f4f6f2" metalness={0.12} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[3.9, 0.08, 1.58]} />
        <meshStandardMaterial color="#d9dee0" metalness={0.4} roughness={0.36} />
      </mesh>
    </group>
  );
}

export function ProductScene({ accent = "#16a3a3" }: ProductSceneProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="product-scene" aria-label="Interactive 3D LumaDock preview">
      <Canvas camera={{ position: [0, 2.2, 5.2], fov: 44 }} shadows>
        <ambientLight intensity={0.95} />
        <directionalLight position={[4, 4, 4]} intensity={1.7} castShadow />
        <pointLight position={[-3, 1.8, 2]} intensity={0.65} color={accent} />
        <DockModel accent={accent} animate={!reducedMotion} />
      </Canvas>
    </div>
  );
}
