"use client";

import { useMemo } from "react";
import { smoothstep } from "@/utils/math";

interface NightLightingProps {
  scrollProgress: number;
}

export function NightLighting({ scrollProgress }: NightLightingProps) {
  const intensity = smoothstep(0.75, 0.9, scrollProgress);

  const lights = useMemo(
    () => [
      { pos: [0, 2, -12] as const, color: "#C9A962" },
      { pos: [-5, 1.5, -20] as const, color: "#E8D5A0" },
      { pos: [4, 1.5, -30] as const, color: "#C9A962" },
      { pos: [0, 1, -45] as const, color: "#4a8fa8" },
      { pos: [-3, 2, -50] as const, color: "#E8D5A0" },
    ],
    []
  );

  if (intensity <= 0.01) return null;

  return (
    <group>
      {lights.map((light, i) => (
        <pointLight
          key={i}
          position={light.pos}
          intensity={1.5 * intensity}
          color={light.color}
          distance={12}
          decay={2}
        />
      ))}
      <ambientLight intensity={0.08 * intensity} color="#1a2744" />
    </group>
  );
}
