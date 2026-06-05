"use client";

import { Canvas } from "@react-three/fiber";
import { SceneEnvironment } from "./SceneEnvironment";
import { cameraRailConfig } from "@/config/camera-rail.config";

interface ExperienceCanvasProps {
  scrollProgress: number;
}

export function ExperienceCanvas({ scrollProgress }: ExperienceCanvasProps) {
  const initialKeyframe = cameraRailConfig.keyframes[0];

  return (
    <Canvas
      className="h-full w-full touch-none"
      camera={{
        position: initialKeyframe.position,
        fov: initialKeyframe.fov,
        near: 0.1,
        far: 200,
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      performance={{ min: 0.5 }}
    >
      <SceneEnvironment scrollProgress={scrollProgress} />
    </Canvas>
  );
}
