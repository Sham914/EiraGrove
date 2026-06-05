"use client";

import { useMemo } from "react";
import { resortMarkersConfig } from "@/config/environment.config";
import { smoothstep } from "@/utils/math";

interface ArrivalMarkersProps {
  scrollProgress: number;
}

export function ArrivalMarkers({ scrollProgress }: ArrivalMarkersProps) {
  const visibility = smoothstep(0.2, 0.4, scrollProgress) *
    (1 - smoothstep(0.42, 0.55, scrollProgress));

  const markers = useMemo(() => resortMarkersConfig, []);

  if (visibility <= 0.01) return null;

  return (
    <group>
      {markers.map((marker) => (
        <group key={marker.id} position={marker.position}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[2, 1.5, 2]} />
            <meshStandardMaterial
              color="#3d4a3a"
              transparent
              opacity={0.6 * visibility}
              roughness={0.85}
            />
          </mesh>
          <mesh position={[0, 1.8, 0]}>
            <coneGeometry args={[0.8, 1.2, 4]} />
            <meshStandardMaterial
              color="#C9A962"
              transparent
              opacity={0.8 * visibility}
              emissive="#C9A962"
              emissiveIntensity={0.2 * visibility}
            />
          </mesh>
          <pointLight
            position={[0, 2.5, 0]}
            intensity={0.5 * visibility}
            color="#C9A962"
            distance={8}
          />
        </group>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -10]}>
        <planeGeometry args={[14, 20]} />
        <meshStandardMaterial
          color="#4a4035"
          transparent
          opacity={0.4 * visibility}
          roughness={0.95}
        />
      </mesh>
    </group>
  );
}
