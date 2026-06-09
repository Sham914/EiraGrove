"use client";

import { useMemo } from "react";
import { Stars } from "@react-three/drei";
import { dayCycleConfig } from "@/config/environment.config";
import { sampleDayCycle } from "@/utils/day-cycle";

interface DynamicDayCycleProps {
  scrollProgress: number;
}

export function DynamicDayCycle({ scrollProgress }: DynamicDayCycleProps) {
  const cycle = useMemo(
    () => sampleDayCycle(dayCycleConfig, scrollProgress),
    [scrollProgress]
  );

  return (
    <>
      <color attach="background" args={[cycle.topColor]} />
      <hemisphereLight
        args={[cycle.topColor, cycle.horizonColor, cycle.ambientIntensity]}
      />
      <directionalLight
        position={cycle.sunPosition}
        intensity={cycle.sunIntensity}
        color={cycle.sunColor}
        castShadow={false}
      />
      {cycle.starVisibility > 0.05 && (
        <Stars
          radius={80}
          depth={40}
          count={Math.floor(800 * cycle.starVisibility)}
          factor={3}
          saturation={0.2}
          fade
          speed={0.3}
        />
      )}
    </>
  );
}

export function useDayCycleState(scrollProgress: number) {
  return useMemo(
    () => sampleDayCycle(dayCycleConfig, scrollProgress),
    [scrollProgress]
  );
}
