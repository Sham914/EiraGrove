"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { smoothstep } from "@/utils/math";

interface IntroFogProps {
  scrollProgress: number;
}

export function IntroFog({ scrollProgress }: IntroFogProps) {
  const fogRef = useRef<THREE.Mesh>(null);
  const density = smoothstep(0, 0.15, scrollProgress) *
    (1 - smoothstep(0.12, 0.25, scrollProgress));

  useFrame((state) => {
    if (fogRef.current) {
      fogRef.current.position.y = 2 + Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
    }
  });

  if (density <= 0.01) return null;

  return (
    <mesh ref={fogRef} position={[0, 3, -5]}>
      <sphereGeometry args={[25, 16, 16]} />
      <meshBasicMaterial
        color="#2d3748"
        transparent
        opacity={0.12 * density}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
