import type { Vector3Tuple } from "three";

export interface CameraKeyframe {
  id: string;
  progress: number;
  position: Vector3Tuple;
  lookAt: Vector3Tuple;
  fov: number;
}

export interface CameraRailConfig {
  keyframes: CameraKeyframe[];
  defaultFov: number;
}

export const cameraRailConfig: CameraRailConfig = {
  defaultFov: 45,
  keyframes: [
    {
      id: "intro-start",
      progress: 0,
      position: [0, 8, 45],
      lookAt: [0, 4, 0],
      fov: 50,
    },
    {
      id: "intro-end",
      progress: 0.08,
      position: [0, 12, 38],
      lookAt: [0, 6, -5],
      fov: 48,
    },
    {
      id: "mountain-wide",
      progress: 0.15,
      position: [-8, 18, 25],
      lookAt: [0, 10, -15],
      fov: 45,
    },
    {
      id: "mountain-close",
      progress: 0.22,
      position: [-4, 14, 12],
      lookAt: [2, 8, -20],
      fov: 42,
    },
    {
      id: "arrival-approach",
      progress: 0.3,
      position: [6, 6, 8],
      lookAt: [0, 3, -8],
      fov: 40,
    },
    {
      id: "arrival-gate",
      progress: 0.38,
      position: [2, 5, -2],
      lookAt: [0, 2, -15],
      fov: 38,
    },
    {
      id: "landscape-path",
      progress: 0.45,
      position: [-3, 4, -10],
      lookAt: [0, 2, -25],
      fov: 38,
    },
    {
      id: "landscape-deep",
      progress: 0.52,
      position: [0, 3.5, -18],
      lookAt: [0, 1.5, -35],
      fov: 36,
    },
    {
      id: "pool-approach",
      progress: 0.58,
      position: [8, 5, -28],
      lookAt: [0, 1, -40],
      fov: 35,
    },
    {
      id: "pool-reveal",
      progress: 0.66,
      position: [4, 3, -35],
      lookAt: [0, 0.5, -48],
      fov: 34,
    },
    {
      id: "sunset-rise",
      progress: 0.72,
      position: [-2, 6, -32],
      lookAt: [0, 2, -50],
      fov: 36,
    },
    {
      id: "sunset-peak",
      progress: 0.78,
      position: [0, 8, -38],
      lookAt: [0, 3, -55],
      fov: 38,
    },
    {
      id: "night-descend",
      progress: 0.85,
      position: [3, 4, -42],
      lookAt: [0, 1.5, -52],
      fov: 36,
    },
    {
      id: "night-intimate",
      progress: 0.92,
      position: [0, 3, -48],
      lookAt: [0, 1, -58],
      fov: 34,
    },
    {
      id: "cta-final",
      progress: 1,
      position: [0, 2.5, -52],
      lookAt: [0, 1, -62],
      fov: 32,
    },
  ],
};
