"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GodRaysProps {
  sunPosition: [number, number, number];
  intensity?: number;
  enabled?: boolean;
}

export function GodRays({
  sunPosition,
  intensity = 0.15,
  enabled = true,
}: GodRaysProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || !enabled) return;
    groupRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.08) * 0.05;
  });

  if (!enabled || intensity <= 0.01) return null;

  return (
    <group ref={groupRef} position={sunPosition}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          rotation={[0, 0, -0.3 + i * 0.15]}
          position={[i * 2 - 3, -5, 0]}
        >
          <planeGeometry args={[3, 25]} />
          <meshBasicMaterial
            color="#FFF8E8"
            transparent
            opacity={intensity * (0.8 - i * 0.15)}
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
