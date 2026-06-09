"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AtmosphericEffectsProps {
  scrollProgress: number;
  fogColor: string;
  fogNear: number;
  fogFar: number;
}

export function AtmosphericEffects({
  scrollProgress,
  fogColor,
  fogNear,
  fogFar,
}: AtmosphericEffectsProps) {
  const mistRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mistRef.current) {
      const mat = mistRef.current.material as THREE.MeshBasicMaterial;
      mistRef.current.position.y =
        4 + Math.sin(state.clock.elapsedTime * 0.15) * 0.8;
      mat.opacity =
        0.06 +
        scrollProgress * 0.04 +
        Math.sin(state.clock.elapsedTime * 0.2) * 0.01;
    }
  });

  return (
    <group>
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
      <mesh ref={mistRef} position={[0, 5, -15]}>
        <sphereGeometry args={[40, 16, 16]} />
        <meshBasicMaterial
          color={fogColor}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      {scrollProgress < 0.2 && (
        <mesh position={[0, 8, 10]}>
          <sphereGeometry args={[35, 12, 12]} />
          <meshBasicMaterial
            color="#8899aa"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
