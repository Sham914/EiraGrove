"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cameraRailConfig } from "@/config/camera-rail.config";
import { sampleCameraRail } from "@/utils/camera-rail";
import {
  getResortWalkPath,
  samplePathPosition,
  terrainEyePosition,
} from "@/utils/terrain-path";
import { lerp } from "@/utils/math";
import { getAppState } from "@/store/app-store";

interface CameraControllerProps {
  scrollProgress: number;
}

const PATH_START = 0.125;
const PATH_END = 0.875;
const GROUND_BLEND_END = 0.2;

export function CameraController({ scrollProgress }: CameraControllerProps) {
  const { camera } = useThree();
  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3(0, 4, 0));

  useFrame(() => {
    if (getAppState().mode === "explore") return;

    const keyframeState = sampleCameraRail(
      cameraRailConfig.keyframes,
      scrollProgress
    );

    let position = keyframeState.position;

    if (scrollProgress >= PATH_START && scrollProgress <= PATH_END) {
      const pathT = (scrollProgress - PATH_START) / (PATH_END - PATH_START);
      const path = getResortWalkPath();
      const { x, z } = samplePathPosition(path, pathT);
      const pathPos = terrainEyePosition(x, z, 1.68);

      if (scrollProgress < GROUND_BLEND_END) {
        const blend =
          (scrollProgress - PATH_START) / (GROUND_BLEND_END - PATH_START);
        const eased = blend * blend * (3 - 2 * blend);
        position = [
          lerp(keyframeState.position[0], pathPos[0], eased),
          lerp(keyframeState.position[1], pathPos[1], eased),
          lerp(keyframeState.position[2], pathPos[2], eased),
        ];
      } else {
        position = pathPos;
      }
    }

    camera.position.lerp(new THREE.Vector3(...position), 0.1);

    targetLookAt.current.set(...keyframeState.lookAt);
    currentLookAt.current.lerp(targetLookAt.current, 0.1);
    camera.lookAt(currentLookAt.current);

    if ("fov" in camera && typeof camera.fov === "number") {
      const perspectiveCamera = camera as THREE.PerspectiveCamera;
      perspectiveCamera.fov = THREE.MathUtils.lerp(
        perspectiveCamera.fov,
        keyframeState.fov,
        0.05
      );
      perspectiveCamera.updateProjectionMatrix();
    }
  });

  return null;
}
