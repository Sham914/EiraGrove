import { buildingsConfig, poolConfig, terrainConfig, heightmapConfig } from "@/config/resort-layout.config";
import * as heightmap from "@/utils/heightmap";
import { smoothstep } from "@/utils/math";

/**
 * Hillside height field — entrance (positive Z) is low, resort deepens uphill (negative Z).
 */
export function sampleTerrainHeight(x: number, z: number): number {
  // If a heightmap is available and contains the point, prefer it. Otherwise fall back to procedural.
  const hm = heightmap.getHeightRaw(x, z);
  const { fallbackBlendDistance } = heightmapConfig || { fallbackBlendDistance: 0 };

  const procedural = sampleTerrainHeightRawProcedural(x, z);

  if (hm !== null) {
    // If we are near the heightmap edge, optionally blend to procedural
    if (fallbackBlendDistance > 0) {
      // compute distance to heightmap bounds via world mapping
      // simple approach: if hm available, use it fully (we can refine edge blending later)
      return Math.min(terrainConfig.maxHeight, hm);
    }
    return Math.min(terrainConfig.maxHeight, hm);
  }

  // fallback: procedural generator
  let h = Math.min(terrainConfig.maxHeight, procedural);

  // Lower only the camera-facing foreground so the entrance / reception / parking / paths read clearly.
  h -= getForegroundLowering(z);
  h = Math.max(terrainConfig.baseHeight - 6, h);

  // building pad blending
  for (const building of buildingsConfig) {
    const [bx, , bz] = building.position;
    const dx = x - bx;
    const dz = z - bz;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const padRadius = building.type === "luxury-villa" ? 7 : 5;
    if (dist < padRadius) {
      const padHeight = sampleTerrainHeightRaw(bx, bz);
      const t = 1 - dist / padRadius;
      const blend = t * t * (3 - 2 * t);
      h = h * (1 - blend) + padHeight * blend;
    }
  }

  // pool pad blending
  const [px, , pz] = poolConfig.position;
  const pdx = x - px;
  const pdz = z - pz;
  const poolDist = Math.sqrt(pdx * pdx + pdz * pdz);
  if (poolDist < 12) {
    const poolPad = sampleTerrainHeightRaw(px, pz);
    const t = 1 - poolDist / 12;
    const blend = t * t;
    h = h * (1 - blend) + poolPad * blend;
  }

  return h;
}

function sampleTerrainHeightRawProcedural(x: number, z: number): number {
  const { baseHeight } = terrainConfig;
  const entranceZ = 28;
  const depth = Math.max(0, (entranceZ - z) / 72);
  const hill = depth * depth * 24 + depth * 4;
  const ridge = Math.sin(x * 0.07) * 1.8 + Math.cos(z * 0.05) * 1.2;
  const terrace = Math.floor(hill / 5) * 0.55;
  let height = Math.min(terrainConfig.maxHeight, baseHeight + hill + ridge + terrace);
  height -= getForegroundLowering(z);
  return Math.max(terrainConfig.baseHeight - 6, height);
}

function sampleTerrainHeightRaw(x: number, z: number): number {
  // Raw sampler used for foundation pads and pool pads: prefer heightmap raw value if present
  const hm = heightmap.getHeightRaw(x, z);
  if (hm !== null) return Math.min(terrainConfig.maxHeight, hm);
  return sampleTerrainHeightRawProcedural(x, z);
}

function getForegroundLowering(z: number): number {
  // 0 near the reception / inner site, stronger toward the camera-facing front edge.
  const frontT = smoothstep(6, 500, z);
  return frontT * frontT * 10;
}

export function getTerrainNormal(x: number, z: number): [number, number, number] {
  const e = 0.4;
  const h = sampleTerrainHeight(x, z);
  const hx = sampleTerrainHeight(x + e, z) - h;
  const hz = sampleTerrainHeight(x, z + e) - h;
  const len = Math.sqrt(hx * hx + 1 + hz * hz);
  return [-hx / len, 1 / len, -hz / len];
}

export function snapToTerrain(
  x: number,
  z: number,
  yOffset = 0
): [number, number, number] {
  return [x, sampleTerrainHeight(x, z) + yOffset, z];
}

export function getGroundedRotation(
  x: number,
  z: number
): [number, number, number] {
  const [nx, ny, nz] = getTerrainNormal(x, z);
  const pitch = Math.asin(-nz);
  const roll = Math.asin(nx / ny);
  return [pitch * 0.35, 0, roll * 0.35];
}
