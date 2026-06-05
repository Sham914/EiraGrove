"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { smoothstep } from "@/utils/math";

interface InfinityPoolProps {
  scrollProgress: number;
}

export function InfinityPool({ scrollProgress }: InfinityPoolProps) {
  const waterRef = useRef<THREE.Mesh>(null);
  const visibility = smoothstep(0.48, 0.68, scrollProgress);

  useFrame((state) => {
    if (waterRef.current?.material instanceof THREE.MeshStandardMaterial) {
      waterRef.current.material.emissiveIntensity =
        0.15 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  if (visibility <= 0.01) return null;

  return (
    <group position={[0, 0, -45]}>
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[12, 0.6, 6]} />
        <meshStandardMaterial
          color="#5a5048"
          transparent
          opacity={0.8 * visibility}
          roughness={0.7}
        />
      </mesh>
      <mesh ref={waterRef} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[11, 5.5, 32, 16]} />
        <meshStandardMaterial
          color="#4a8fa8"
          transparent
          opacity={0.85 * visibility}
          roughness={0.1}
          metalness={0.6}
          emissive="#2a6a80"
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh position={[0, 0.5, -3.2]}>
        <boxGeometry args={[12, 0.15, 0.3]} />
        <meshStandardMaterial
          color="#8a8078"
          transparent
          opacity={0.9 * visibility}
        />
      </mesh>
      <pointLight
        position={[0, 3, 0]}
        intensity={1.2 * visibility}
        color="#a8d4e8"
        distance={15}
      />
    </group>
  );
}
