"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { DeviceCapabilities } from "@/hooks/useDeviceCapability";

interface CloudLayerProps {
  capabilities: DeviceCapabilities;
  scrollProgress: number;
}

const CLOUD_POSITIONS: [number, number, number][] = [
  [-30, 38, -20],
  [20, 42, -35],
  [0, 45, -50],
  [-15, 40, 10],
  [25, 36, -10],
  [-25, 44, -45],
  [10, 48, -60],
  [35, 39, -30],
];

function CloudPuff({
  position,
  scale,
  opacity,
}: {
  position: [number, number, number];
  scale: number;
  opacity: number;
}) {
  return (
    <group position={position}>
      {[
        [0, 0, 0],
        [1.2, 0.2, 0.3],
        [-1, 0.1, 0.5],
        [0.5, 0.3, -0.8],
      ].map((offset, i) => (
        <mesh key={i} position={offset as [number, number, number]} scale={scale * (0.8 + i * 0.15)}>
          <sphereGeometry args={[1.2, 8, 6]} />
          <meshStandardMaterial
            color="#f0f4f8"
            transparent
            opacity={opacity}
            depthWrite={false}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}

export function CloudLayer({ capabilities, scrollProgress }: CloudLayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const count = Math.min(capabilities.cloudCount, CLOUD_POSITIONS.length);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.x =
      Math.sin(state.clock.elapsedTime * 0.05) * 3;
    groupRef.current.position.z =
      scrollProgress * -5 + Math.cos(state.clock.elapsedTime * 0.04) * 2;
  });

  return (
    <group ref={groupRef}>
      {CLOUD_POSITIONS.slice(0, count).map((pos, i) => (
        <CloudPuff
          key={i}
          position={pos}
          scale={2 + i * 0.4}
          opacity={0.18 + (i % 3) * 0.06}
        />
      ))}
    </group>
  );
}
