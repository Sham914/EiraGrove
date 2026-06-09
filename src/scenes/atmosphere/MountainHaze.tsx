"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mountainBackdropConfig } from "@/config/resort-layout.config";
import { sampleTerrainHeight } from "@/utils/terrain-height";

interface MountainHazeProps {
  enabled?: boolean;
}

export function MountainHaze({ enabled = true }: MountainHazeProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current || !enabled) return;
    ref.current.position.x = Math.sin(state.clock.elapsedTime * 0.04) * 2;
  });

  if (!enabled) return null;

  return (
    <group ref={ref}>
      {mountainBackdropConfig.peaks.map((peak, i) => {
        const y = sampleTerrainHeight(peak.position[0], peak.position[2]);
        return (
          <mesh
            key={i}
            position={[peak.position[0], y + peak.scale[1] * 0.5, peak.position[2]]}
          >
            <sphereGeometry args={[peak.scale[0] * 0.6, 8, 8]} />
            <meshBasicMaterial
              color="#8899aa"
              transparent
              opacity={0.08 + i * 0.02}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}
