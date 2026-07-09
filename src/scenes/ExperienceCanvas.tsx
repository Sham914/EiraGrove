"use client";

import { useMemo } from "react";
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
  const initialKeyframe = useMemo(
    () => sampleCameraRail(cameraRailConfig.keyframes, 0),
    []
  );
  const camera = useMemo(
    () => ({
      position: initialKeyframe.position,
      fov: initialKeyframe.fov,
      near: 0.1,
      far: 250,
    }),
    [initialKeyframe]
  );
  const gl = useMemo(
    () => ({
      antialias: capabilities.tier !== "low",
      alpha: false,
      powerPreference: "high-performance" as const,
    }),
    [capabilities.tier]
  );
  const performance = useMemo(() => ({ min: 0.5 }), []);

  return (
    <Canvas
      className={`h-full w-full ${mode === "explore" ? "cursor-grab active:cursor-grabbing" : "touch-none"}`}
      camera={camera}
      dpr={capabilities.dpr}
      gl={gl}
      performance={performance}
    >
      <SceneEnvironment
        scrollProgress={scrollProgress}
        capabilities={capabilities}
      />
    </Canvas>
  );
}
