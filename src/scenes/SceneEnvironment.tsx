"use client";

import { Mountains } from "./Mountains";
import { ArrivalMarkers } from "./ArrivalMarkers";
import { LandscapePaths } from "./LandscapePaths";
import { InfinityPool } from "./InfinityPool";
import { DynamicSky } from "./DynamicSky";
import { IntroFog } from "./IntroFog";
import { NightLighting } from "./NightLighting";
import { CameraController } from "./CameraController";

interface SceneEnvironmentProps {
  scrollProgress: number;
}

export function SceneEnvironment({ scrollProgress }: SceneEnvironmentProps) {
  return (
    <>
      <DynamicSky scrollProgress={scrollProgress} />
      <IntroFog scrollProgress={scrollProgress} />
      <Mountains scrollProgress={scrollProgress} />
      <ArrivalMarkers scrollProgress={scrollProgress} />
      <LandscapePaths scrollProgress={scrollProgress} />
      <InfinityPool scrollProgress={scrollProgress} />
      <NightLighting scrollProgress={scrollProgress} />
      <CameraController scrollProgress={scrollProgress} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -30]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#1a2420" roughness={1} />
      </mesh>
    </>
  );
}
