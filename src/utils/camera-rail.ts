import type { CameraKeyframe } from "@/config/camera-rail.config";
import { lerp } from "./math";

export interface CameraState {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
}

function lerpTuple(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function sampleCameraRail(
  keyframes: CameraKeyframe[],
  progress: number
): CameraState {
  const sorted = [...keyframes].sort((a, b) => a.progress - b.progress);

  if (progress <= sorted[0].progress) {
    const k = sorted[0];
    return { position: k.position, lookAt: k.lookAt, fov: k.fov };
  }

  const last = sorted[sorted.length - 1];
  if (progress >= last.progress) {
    return { position: last.position, lookAt: last.lookAt, fov: last.fov };
  }

  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];
    if (progress >= current.progress && progress <= next.progress) {
      const range = next.progress - current.progress;
      const t = range > 0 ? (progress - current.progress) / range : 0;
      const eased = t * t * (3 - 2 * t);
      return {
        position: lerpTuple(current.position, next.position, eased),
        lookAt: lerpTuple(current.lookAt, next.lookAt, eased),
        fov: lerp(current.fov, next.fov, eased),
      };
    }
  }

  return {
    position: last.position,
    lookAt: last.lookAt,
    fov: last.fov,
  };
}
