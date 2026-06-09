import type { CameraKeyframe } from "@/config/camera-rail.config";
import { lerp } from "./math";
import { sampleTerrainHeight } from "./terrain-height";

export interface CameraState {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
}

function resolveKeyframe(k: CameraKeyframe): CameraState {
  if (k.mode === "aerial") {
    return {
      position: [k.x, k.absoluteY ?? 30, k.z],
      lookAt: [k.lookX, k.lookAbsoluteY ?? 0, k.lookZ],
      fov: k.fov,
    };
  }

  return {
    position: [
      k.x,
      sampleTerrainHeight(k.x, k.z) + k.eyeHeight,
      k.z,
    ],
    lookAt: [
      k.lookX,
      sampleTerrainHeight(k.lookX, k.lookZ) + k.lookHeight,
      k.lookZ,
    ],
    fov: k.fov,
  };
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
  // Build timeline including holds (extra length at keyframes)
  const baseLengths: number[] = [];
  const holds: number[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    baseLengths.push(sorted[i + 1].progress - sorted[i].progress);
  }
  for (let i = 0; i < sorted.length; i++) {
    holds.push(sorted[i].hold ?? 0);
  }

  const totalBase = baseLengths.reduce((s, v) => s + v, 0);
  const totalHolds = holds.reduce((s, v) => s + v, 0);
  const totalLength = totalBase + totalHolds;

  // Map input progress [0..1] into timeline position
  const timelinePos = progress * totalLength;

  // Walk through segments and holds to find where timelinePos lands
  let cursor = 0;
  for (let i = 0; i < sorted.length - 1; i++) {
    const segLen = baseLengths[i];
    const segStart = cursor;
    const segEnd = segStart + segLen;
    if (timelinePos >= segStart && timelinePos <= segEnd) {
      // inside motion segment between sorted[i] -> sorted[i+1]
      const localT = segLen > 0 ? (timelinePos - segStart) / segLen : 0;
      // apply compression approaching next keyframe
      const next = sorted[i + 1];
      const compression = next.compression ?? 0;
      const tComp = Math.pow(localT, Math.max(0.0001, 1 - compression));
      const eased = tComp * tComp * (3 - 2 * tComp);

      const a = resolveKeyframe(sorted[i]);
      const b = resolveKeyframe(next);

      return {
        position: lerpTuple(a.position, b.position, eased),
        lookAt: lerpTuple(a.lookAt, b.lookAt, eased),
        fov: lerp(a.fov, b.fov, eased),
      };
    }

    cursor = segEnd;

    // hold at the next keyframe
    const holdLen = holds[i + 1] ?? 0;
    const holdStart = cursor;
    const holdEnd = holdStart + holdLen;
    if (timelinePos >= holdStart && timelinePos <= holdEnd) {
      return resolveKeyframe(sorted[i + 1]);
    }
    cursor = holdEnd;
  }

  // If beyond last segment, return final keyframe
  return resolveKeyframe(sorted[sorted.length - 1]);
}
