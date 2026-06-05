"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { smoothstep } from "@/utils/math";

interface LandscapePathsProps {
  scrollProgress: number;
}

export function LandscapePaths({ scrollProgress }: LandscapePathsProps) {
  const pathRef = useRef<THREE.Mesh>(null);
  const visibility = smoothstep(0.35, 0.55, scrollProgress);

  const pathGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2, 0.05, -8),
      new THREE.Vector3(0, 0.05, -15),
      new THREE.Vector3(-2, 0.05, -22),
      new THREE.Vector3(1, 0.05, -30),
      new THREE.Vector3(0, 0.05, -38),
    ]);
    return new THREE.TubeGeometry(curve, 64, 0.35, 8, false);
  }, []);

  useFrame(() => {
    if (pathRef.current) {
      pathRef.current.position.z = -scrollProgress * 2;
    }
  });

  if (visibility <= 0.01) return null;

  return (
    <group>
      <mesh ref={pathRef} geometry={pathGeometry}>
        <meshStandardMaterial
          color="#6b5d4f"
          transparent
          opacity={0.7 * visibility}
          roughness={0.9}
        />
      </mesh>
      {[-4, 0, 4].map((x, i) => (
        <mesh key={i} position={[x, 0, -20 - i * 8]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.2 + i * 0.3, 8]} />
          <meshStandardMaterial
            color="#2d4a2d"
            transparent
            opacity={0.5 * visibility}
          />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -28]}>
        <planeGeometry args={[30, 50]} />
        <meshStandardMaterial
          color="#3a5238"
          transparent
          opacity={0.35 * visibility}
        />
      </mesh>
    </group>
  );
}
