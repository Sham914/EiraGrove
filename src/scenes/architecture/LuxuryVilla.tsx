"use client";

import { useMemo } from "react";
import { sampleTerrainHeight } from "@/utils/terrain-height";

interface LuxuryVillaProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  lightIntensity?: number;
}

const PILLAR_OFFSETS: [number, number][] = [
  [-2, -1.5],
  [-2, 1.5],
  [2, -1.5],
  [2, 1.5],
];

const DECK_HEIGHT = 3.2;

export function LuxuryVilla({
  position,
  rotation = [0, 0, 0],
  lightIntensity = 0,
}: LuxuryVillaProps) {
  const rotY = rotation[1];

  const pillars = useMemo(() => {
    const [cx, groundY, cz] = position;
    return PILLAR_OFFSETS.map(([lx, lz]) => {
      const wx = cx + lx * Math.cos(rotY) - lz * Math.sin(rotY);
      const wz = cz + lx * Math.sin(rotY) + lz * Math.cos(rotY);
      const terrainY = sampleTerrainHeight(wx, wz);
      const pillarBottom = terrainY - groundY;
      const height = Math.max(0.5, DECK_HEIGHT - pillarBottom);
      const centerY = pillarBottom + height / 2;
      return { lx, lz, height, centerY };
    });
  }, [position, rotY]);

  return (
    <group position={position} rotation={rotation}>
      {pillars.map(({ lx, lz, height, centerY }, i) => (
        <mesh key={i} position={[lx, centerY, lz]}>
          <cylinderGeometry args={[0.22, 0.28, height, 6]} />
          <meshStandardMaterial color="#5a4030" roughness={0.85} />
        </mesh>
      ))}
      {/* Stone retaining base */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[5.8, 0.3, 4.8]} />
        <meshStandardMaterial color="#6a6058" roughness={0.95} />
      </mesh>
      {/* Main deck */}
      <mesh position={[0, DECK_HEIGHT, 0]}>
        <boxGeometry args={[5.5, 0.25, 4.5]} />
        <meshStandardMaterial color="#8a6848" roughness={0.65} />
      </mesh>
      {/* Glass walls */}
      <mesh position={[0, DECK_HEIGHT + 1.2, 0]}>
        <boxGeometry args={[5, 2, 3.8]} />
        <meshStandardMaterial
          color="#88aabb"
          transparent
          opacity={0.45}
          roughness={0.1}
          metalness={0.4}
        />
      </mesh>
      {/* Gabled roof */}
      <mesh position={[0, DECK_HEIGHT + 2.8, 0]}>
        <coneGeometry args={[4, 2, 4]} />
        <meshStandardMaterial color="#2a2825" roughness={0.8} flatShading />
      </mesh>
      {/* Wood soffit */}
      <mesh position={[0, DECK_HEIGHT + 2.2, 0]}>
        <boxGeometry args={[5.2, 0.2, 4]} />
        <meshStandardMaterial color="#9a7848" roughness={0.6} />
      </mesh>
      {/* Railing */}
      <mesh position={[0, DECK_HEIGHT + 0.6, 2.3]}>
        <boxGeometry args={[5.5, 0.8, 0.08]} />
        <meshStandardMaterial color="#3a3028" roughness={0.7} />
      </mesh>
      {lightIntensity > 0 && (
        <pointLight
          position={[0, DECK_HEIGHT + 1, 0]}
          intensity={lightIntensity * 46}
          color="#FFD0A0"
          distance={12}
        />
      )}
    </group>
  );
}
