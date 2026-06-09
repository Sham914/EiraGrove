"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { poolConfig } from "@/config/resort-layout.config";
import { snapToTerrain } from "@/utils/terrain-height";
import { createPoolWaterMaterial } from "@/scenes/shaders/pool-water.shader";

interface InfinityPoolWaterProps {
  poolLightIntensity: number;
  sunDirection: [number, number, number];
}

export function InfinityPoolWater({
  poolLightIntensity,
  sunDirection,
}: InfinityPoolWaterProps) {
  const waterRef = useRef<THREE.Mesh>(null);
  const material = useMemo(() => createPoolWaterMaterial(), []);
  const [px, , pz] = poolConfig.position;
  const [w, h] = poolConfig.size;

  const poolPosition = useMemo(
    () => snapToTerrain(px, pz, 0.05),
    [px, pz]
  );

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uLightIntensity.value = poolLightIntensity;
    material.uniforms.uSunDirection.value.set(...sunDirection).normalize();
  });

  return (
    <group
      position={poolPosition}
      rotation={[0, poolConfig.rotation, 0]}
    >
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[w + 0.6, 0.7, h + 0.6]} />
        <meshStandardMaterial color="#5a5048" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.05, -h / 2 - 0.15]}>
        <boxGeometry args={[w, 0.12, 0.25]} />
        <meshStandardMaterial color="#9a9088" roughness={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[w + 3, h + 4]} />
        <meshStandardMaterial color="#8a7868" roughness={0.8} />
      </mesh>
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <planeGeometry args={[w, h, 32, 16]} />
        <primitive object={material} attach="material" />
      </mesh>
      {poolLightIntensity > 0.1 &&
        [-3, 0, 3].map((x) => (
          <pointLight
            key={x}
            position={[x, -0.2, 0]}
            intensity={poolLightIntensity * 2}
            color="#40d0f0"
            distance={8}
          />
        ))}
    </group>
  );
}
