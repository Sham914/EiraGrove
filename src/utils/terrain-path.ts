import { pathsConfig } from "@/config/resort-layout.config";
import { sampleTerrainHeight } from "./terrain-height";

export interface PathPoint {
  x: number;
  z: number;
}

/** Continuous resort walk path: driveway → garden → pool approach */
export function getResortWalkPath(): PathPoint[] {
  const orderedIds = ["driveway", "garden-main", "pool-walk"];
  const points: PathPoint[] = [];

  for (const id of orderedIds) {
    const path = pathsConfig.find((p) => p.id === id);
    if (!path) continue;
    for (const [x, , z] of path.points) {
      const last = points[points.length - 1];
      if (last && Math.hypot(last.x - x, last.z - z) < 0.5) continue;
      points.push({ x, z });
    }
  }

  return points;
}

export function samplePathPosition(
  path: PathPoint[],
  t: number
): { x: number; z: number; forward: [number, number, number] } {
  if (path.length < 2) {
    return { x: 0, z: 0, forward: [0, 0, -1] };
  }

  const segments = path.length - 1;
  const scaled = Math.max(0, Math.min(1, t)) * segments;
  const idx = Math.min(Math.floor(scaled), segments - 1);
  const localT = scaled - idx;

  const a = path[idx];
  const b = path[idx + 1];
  const x = a.x + (b.x - a.x) * localT;
  const z = a.z + (b.z - a.z) * localT;
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const len = Math.hypot(dx, dz) || 1;

  return { x, z, forward: [dx / len, 0, dz / len] };
}

export function terrainEyePosition(
  x: number,
  z: number,
  eyeHeight: number
): [number, number, number] {
  return [x, sampleTerrainHeight(x, z) + eyeHeight, z];
}

export function terrainLookAtPoint(
  x: number,
  z: number,
  heightOffset: number
): [number, number, number] {
  return [x, sampleTerrainHeight(x, z) + heightOffset, z];
}
