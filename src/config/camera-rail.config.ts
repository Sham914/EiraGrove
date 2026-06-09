import type { Vector3Tuple } from "three";

export type CameraMode = "terrain" | "aerial";

export interface CameraKeyframe {
  id: string;
  progress: number;
  /** X world coordinate */
  x: number;
  /** Z world coordinate */
  z: number;
  /** Metres above terrain surface at x,z */
  eyeHeight: number;
  /** Look-at X (world) */
  lookX: number;
  /** Look-at Z (world) */
  lookZ: number;
  /** Metres above terrain at look point */
  lookHeight: number;
  fov: number;
  mode?: CameraMode;
  /** Used when mode is aerial — absolute Y instead of terrain + eyeHeight */
  absoluteY?: number;
  lookAbsoluteY?: number;
  /** Optional extra hold (in normalized progress units) to pause at this keyframe */
  hold?: number;
  /** Approach compression [0..1] where >0 compresses the approach to this keyframe */
  compression?: number;
}

export interface CameraRailConfig {
  keyframes: CameraKeyframe[];
  defaultFov: number;
}

/** Camera follows terrain — Y is computed at runtime from height field */
export const cameraRailConfig: CameraRailConfig = {
  defaultFov: 45,
  keyframes: [
    // Scene 1 — Mountain reveal (aerial)
    {
      id: "mountain-wide",
      progress: 0,
      x: -20,
      z: 40,
      eyeHeight: 0,
      lookX: 0,
      lookZ: -35,
      lookHeight: 0,
      fov: 52,
      mode: "aerial",
      absoluteY: 38,
      lookAbsoluteY: 8,
      hold: 0.02,
    },
    {
      id: "mountain-descend",
      progress: 0.125,
      x: -6,
      z: 32,
      eyeHeight: 0,
      lookX: 0,
      lookZ: 18,
      lookHeight: 0,
      fov: 48,
      mode: "aerial",
      absoluteY: 22,
      lookAbsoluteY: 4,
    },
    // Scene 2 — Approach (on driveway, eye level)
    {
      id: "approach-far",
      progress: 0.16,
      x: 2,
      z: 37,
      eyeHeight: 5.75,
      lookX: 0,
      lookZ: 22,
      lookHeight: 2.5,
      fov: 42,
      compression: 0.18,
    },
    {
      id: "approach-gate",
      progress: 0.25,
      x: 0.5,
      z: 24,
      eyeHeight: 17.7,
      lookX: 0,
      lookZ: 8,
      lookHeight: 2.8,
      fov: 40,
      hold: 0.03,
    },
    // Scene 3 — Reception
    {
      id: "reception-approach",
      progress: 0.3,
      x: 2,
      z: 14,
      eyeHeight: 15.7,
      lookX: 0,
      lookZ: 8,
      lookHeight: 4,
      fov: 38,
    },
    {
      id: "reception-arrive",
      progress: 0.375,
      x: 1,
      z: 510,
      eyeHeight: 1.65,
      lookX: 0,
      lookZ: 6,
      lookHeight: 1.5,
      fov: 36,
      hold: 0.04,
    },
    // Scene 4 — Landscape pathways
    {
      id: "path-gazebo",
      progress: 0.42,
      x: -3,
      z: 0,
      eyeHeight: 7.65,
      lookX: -10,
      lookZ: -5,
      lookHeight: 3,
      fov: 36,
    },
    {
      id: "path-garden",
      progress: 0.5,
      x: -2,
      z: -10,
      eyeHeight: 21.65,
      lookX: 0,
      lookZ: -18,
      lookHeight: 3,
      fov: 35,
      compression: 0.12,
    },
    // Scene 5 — Private cottages
    {
      id: "cottage-path",
      progress: 0.56,
      x: 0,
      z: -18,
      eyeHeight: 15.65,
      lookX: -8,
      lookZ: -18,
      lookHeight: -4,
      fov: 34,
    },
    {
      id: "cottage-intimate",
      progress: 0.625,
      x: -2,
      z: -22,
      eyeHeight: 12.65,
      lookX: 6,
      lookZ: -22,
      lookHeight: -2.5,
      fov: 63,
      hold: 0.035,
    },
    // Scene 6 — Infinity pool
    {
      id: "pool-approach",
      progress: 0.68,
      x: 6,
      z: -32,
      eyeHeight: 13.65,
      lookX: 14,
      lookZ: -42,
      lookHeight: 2.5,
      fov: 34,
      compression: 0.22,
    },
    {
      id: "pool-edge",
      progress: 0.75,
      x: 11,
      z: -40,
      eyeHeight: 1.6,
      lookX: 14,
      lookZ: -48,
      lookHeight: 2,
      fov: 32,
      hold: 0.08,
    },
    // Scene 7 — Luxury villa
    {
      id: "villa-ascent",
      progress: 0.8,
      x: -6,
      z: -14,
      eyeHeight: 1.7,
      lookX: -12,
      lookZ: -14,
      lookHeight: 6,
      fov: 34,
    },
    {
      id: "villa-hero",
      progress: 0.875,
      x: -9,
      z: -12,
      eyeHeight: 1.75,
      lookX: -12,
      lookZ: -16,
      lookHeight: 7,
      fov: 32,
      hold: 0.03,
    },
    // Scene 8 — Aerial masterplan
    {
      id: "aerial-rise",
      progress: 0.92,
      x: 0,
      z: -5,
      eyeHeight: 0,
      lookX: 0,
      lookZ: -28,
      lookHeight: 0,
      fov: 48,
      mode: "aerial",
      absoluteY: 42,
      lookAbsoluteY: 2,
    },
    {
      id: "aerial-final",
      progress: 1,
      x: 0,
      z: -15,
      eyeHeight: 0,
      lookX: 0,
      lookZ: -32,
      lookHeight: 0,
      fov: 52,
      mode: "aerial",
      absoluteY: 52,
      lookAbsoluteY: 0,
      hold: 0.06,
    },
  ],
};
