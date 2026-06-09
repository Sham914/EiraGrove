"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface VolumetricFogProps {
  color: string;
  density?: number;
  enabled?: boolean;
}

export function VolumetricFog({
  color,
  density = 0.04,
  enabled = true,
}: VolumetricFogProps) {
  const layersRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!layersRef.current || !enabled) return;
    const t = state.clock.elapsedTime;
    layersRef.current.children.forEach((child, i) => {
      child.position.y = 3 + i * 2 + Math.sin(t * 0.1 + i) * 0.6;
      child.rotation.y = t * 0.02 * (i % 2 === 0 ? 1 : -1);
    });
  });

  if (!enabled) return null;

  return (
    <group ref={layersRef}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 4 + i * 3, -20 - i * 8]}>
          <boxGeometry args={[80, 3 + i, 60]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={density * (1.2 - i * 0.25)}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
