"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { smoothstep } from "@/utils/math";

interface MountainsProps {
  scrollProgress: number;
}

function MountainLayer({
  position,
  scale,
  color,
  opacity,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  opacity: number;
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(1, 1, 6);
    geo.translate(0, 0.5, 0);
    return geo;
  }, []);

  return (
    <mesh position={position} scale={scale} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        flatShading
        roughness={0.9}
        metalness={0.05}
      />
    </mesh>
  );
}

export function Mountains({ scrollProgress }: MountainsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const visibility = smoothstep(0.05, 0.25, scrollProgress);

  const layers = useMemo(
    () => [
      { pos: [-18, -2, -35] as const, scale: [22, 14, 22] as const, color: "#2d3a4a", opacity: 0.5 },
      { pos: [-8, -1, -30] as const, scale: [16, 18, 16] as const, color: "#3d4f5f", opacity: 0.65 },
      { pos: [0, 0, -28] as const, scale: [20, 22, 20] as const, color: "#4a5d6e", opacity: 0.75 },
      { pos: [10, -1, -32] as const, scale: [18, 16, 18] as const, color: "#3a4d5c", opacity: 0.6 },
      { pos: [20, -2, -38] as const, scale: [24, 12, 24] as const, color: "#2a3848", opacity: 0.45 },
      { pos: [-5, 1, -45] as const, scale: [28, 26, 28] as const, color: "#526878", opacity: 0.85 },
      { pos: [8, 0, -48] as const, scale: [22, 20, 22] as const, color: "#455865", opacity: 0.7 },
    ],
    []
  );

  useFrame(() => {
    if (!groupRef.current) return;
    const parallax = scrollProgress * 4;
    groupRef.current.position.y = -parallax * 0.3;
    groupRef.current.position.z = parallax * 0.5;
  });

  if (visibility <= 0.01) return null;

  return (
    <group ref={groupRef}>
      {layers.map((layer, i) => (
        <MountainLayer
          key={i}
          position={[layer.pos[0], layer.pos[1], layer.pos[2]]}
          scale={[layer.scale[0], layer.scale[1], layer.scale[2]]}
          color={layer.color}
          opacity={layer.opacity * visibility}
        />
      ))}
    </group>
  );
}
