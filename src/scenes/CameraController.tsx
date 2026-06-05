"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cameraRailConfig } from "@/config/camera-rail.config";
import { sampleCameraRail } from "@/utils/camera-rail";

interface CameraControllerProps {
  scrollProgress: number;
}

export function CameraController({ scrollProgress }: CameraControllerProps) {
  const { camera } = useThree();
  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3(0, 4, 0));

  useFrame(() => {
    const state = sampleCameraRail(
      cameraRailConfig.keyframes,
      scrollProgress
    );

    camera.position.lerp(
      new THREE.Vector3(...state.position),
      0.08
    );

    targetLookAt.current.set(...state.lookAt);
    currentLookAt.current.lerp(targetLookAt.current, 0.08);
    camera.lookAt(currentLookAt.current);

    if ("fov" in camera && typeof camera.fov === "number") {
      const perspectiveCamera = camera as THREE.PerspectiveCamera;
      perspectiveCamera.fov = THREE.MathUtils.lerp(
        perspectiveCamera.fov,
        state.fov,
        0.05
      );
      perspectiveCamera.updateProjectionMatrix();
    }
  });

  return null;
}
