"use client";

import { Suspense, lazy } from "react";
import { DynamicDayCycle, useDayCycleState } from "@/scenes/lighting/DynamicDayCycle";
import { CameraController } from "@/scenes/CameraController";
import { ExploreControls } from "@/scenes/ExploreControls";
import { Terrain, MountainBackdrop } from "@/scenes/environment/Terrain";
import { StonePaths } from "@/scenes/environment/StonePaths";
import { Vegetation } from "@/scenes/environment/Vegetation";
import { GrassPatches } from "@/scenes/environment/GrassPatches";
import { AtmosphericEffects } from "@/scenes/environment/AtmosphericEffects";
import { ResortArchitecture } from "@/scenes/architecture/ResortArchitecture";
import { InfinityPoolWater } from "@/scenes/water/InfinityPoolWater";
import { VolumetricFog } from "@/scenes/atmosphere/VolumetricFog";
import { GodRays } from "@/scenes/atmosphere/GodRays";
import { MountainHaze } from "@/scenes/atmosphere/MountainHaze";
import { Fireflies, WaterParticles } from "@/scenes/atmosphere/Fireflies";
import { LocationMarkers } from "@/scenes/interactions/LocationMarkers";
import { useAppMode, useReducedMotion } from "@/hooks/useAppState";
import type { DeviceCapabilities } from "@/hooks/useDeviceCapability";

const CloudLayer = lazy(() =>
  import("@/scenes/environment/CloudLayer").then((m) => ({
    default: m.CloudLayer,
  }))
);

const BirdFlock = lazy(() =>
  import("@/scenes/environment/BirdFlock").then((m) => ({
    default: m.BirdFlock,
  }))
);

interface SceneEnvironmentProps {
  scrollProgress: number;
  capabilities: DeviceCapabilities;
}

function LifeSystems({
  scrollProgress,
  capabilities,
  reducedMotion,
}: {
  scrollProgress: number;
  capabilities: DeviceCapabilities;
  reducedMotion: boolean;
}) {
  if (reducedMotion) return null;

  return (
    <Suspense fallback={null}>
      <CloudLayer
        capabilities={capabilities}
        scrollProgress={scrollProgress}
      />
      <BirdFlock capabilities={capabilities} />
    </Suspense>
  );
}

export function SceneEnvironment({
  scrollProgress,
  capabilities,
}: SceneEnvironmentProps) {
  const cycle = useDayCycleState(scrollProgress);
  const mode = useAppMode();
  const reducedMotion = useReducedMotion();
  const windStrength = reducedMotion ? 0.2 : 0.6 + scrollProgress * 0.4;
  const atmosphereEnabled =
    !reducedMotion && capabilities.tier !== "low";

  const godRayIntensity =
    cycle.sunIntensity * (1 - cycle.starVisibility) * 0.18;

  return (
    <>
      <DynamicDayCycle scrollProgress={scrollProgress} />
      <AtmosphericEffects
        scrollProgress={scrollProgress}
        fogColor={cycle.fogColor}
        fogNear={cycle.fogNear}
        fogFar={cycle.fogFar}
      />

      {atmosphereEnabled && (
        <>
          <VolumetricFog color={cycle.fogColor} density={0.035} />
          <MountainHaze />
          <GodRays
            sunPosition={cycle.sunPosition}
            intensity={godRayIntensity}
          />
          <Fireflies
            count={capabilities.tier === "high" ? 45 : 20}
            scrollProgress={scrollProgress}
          />
          <WaterParticles
            count={capabilities.tier === "high" ? 30 : 12}
          />
        </>
      )}

      <MountainBackdrop />
      <Terrain capabilities={capabilities} />
      <StonePaths />
      <Vegetation capabilities={capabilities} windStrength={windStrength} />
      <GrassPatches capabilities={capabilities} windStrength={windStrength} />

      <ResortArchitecture
        architecturalLightIntensity={cycle.architecturalLightIntensity}
      />
      <InfinityPoolWater
        poolLightIntensity={cycle.poolLightIntensity}
        sunDirection={cycle.sunPosition}
      />

      <LocationMarkers interactive={mode === "explore" || scrollProgress > 0.85} />

      <LifeSystems
        scrollProgress={scrollProgress}
        capabilities={capabilities}
        reducedMotion={reducedMotion}
      />

      <CameraController scrollProgress={scrollProgress} />
      <ExploreControls />
    </>
  );
}
