"use client";

import { Canvas } from "@react-three/fiber";
import { SceneEnvironment } from "./SceneEnvironment";
import { cameraRailConfig } from "@/config/camera-rail.config";
import { sampleCameraRail } from "@/utils/camera-rail";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { useAppMode } from "@/hooks/useAppState";

interface ExperienceCanvasProps {
  scrollProgress: number;
}

export function ExperienceCanvas({ scrollProgress }: ExperienceCanvasProps) {
  const capabilities = useDeviceCapability();
  const mode = useAppMode();
  const initialKeyframe = sampleCameraRail(cameraRailConfig.keyframes, 0);

  return (
    <Canvas
      className={`h-full w-full ${mode === "explore" ? "cursor-grab active:cursor-grabbing" : "touch-none"}`}
      camera={{
        position: initialKeyframe.position,
        fov: initialKeyframe.fov,
        near: 0.1,
        far: 250,
      }}
      dpr={capabilities.dpr}
      gl={{
        antialias: capabilities.tier !== "low",
        alpha: false,
        powerPreference: "high-performance",
      }}
      performance={{ min: 0.5 }}
    >
      <SceneEnvironment
        scrollProgress={scrollProgress}
        capabilities={capabilities}
      />
    </Canvas>
  );
}
