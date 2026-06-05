"use client";

import { useMemo } from "react";
import { skyPhasesConfig } from "@/config/environment.config";
import { sampleSkyPhase } from "@/utils/sky-phase";

interface DynamicSkyProps {
  scrollProgress: number;
}

export function DynamicSky({ scrollProgress }: DynamicSkyProps) {
  const sky = useMemo(
    () => sampleSkyPhase(skyPhasesConfig, scrollProgress),
    [scrollProgress]
  );

  return (
    <>
      <color attach="background" args={[sky.topColor]} />
      <fog attach="fog" args={[sky.fogColor, 15, 80]} />
      <hemisphereLight
        args={[sky.topColor, sky.horizonColor, sky.ambientIntensity]}
      />
      <directionalLight
        position={[20, 30, -10]}
        intensity={sky.sunIntensity}
        color={scrollProgress > 0.66 && scrollProgress < 0.78 ? "#FFB366" : "#FFF5E6"}
        castShadow={false}
      />
    </>
  );
}
