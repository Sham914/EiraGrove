import type { SkyPhase } from "@/config/environment.config";
import { lerp, lerpColor } from "./math";

export interface SkyState {
  topColor: string;
  horizonColor: string;
  fogColor: string;
  fogDensity: number;
  ambientIntensity: number;
  sunIntensity: number;
}

export function sampleSkyPhase(
  phases: SkyPhase[],
  progress: number
): SkyState {
  const sorted = [...phases].sort(
    (a, b) => a.progressStart - b.progressStart
  );

  for (const phase of sorted) {
    if (progress >= phase.progressStart && progress < phase.progressEnd) {
      const range = phase.progressEnd - phase.progressStart;
      const localT =
        range > 0 ? (progress - phase.progressStart) / range : 0;

      const nextIndex = sorted.indexOf(phase) + 1;
      const next = sorted[nextIndex];

      if (next && localT > 0.7 && progress > phase.progressEnd - range * 0.3) {
        const blendT = (localT - 0.7) / 0.3;
        return {
          topColor: lerpColor(phase.topColor, next.topColor, blendT),
          horizonColor: lerpColor(
            phase.horizonColor,
            next.horizonColor,
            blendT
          ),
          fogColor: lerpColor(phase.fogColor, next.fogColor, blendT),
          fogDensity: lerp(phase.fogDensity, next.fogDensity, blendT),
          ambientIntensity: lerp(
            phase.ambientIntensity,
            next.ambientIntensity,
            blendT
          ),
          sunIntensity: lerp(phase.sunIntensity, next.sunIntensity, blendT),
        };
      }

      return {
        topColor: phase.topColor,
        horizonColor: phase.horizonColor,
        fogColor: phase.fogColor,
        fogDensity: phase.fogDensity,
        ambientIntensity: phase.ambientIntensity,
        sunIntensity: phase.sunIntensity,
      };
    }
  }

  const last = sorted[sorted.length - 1];
  return {
    topColor: last.topColor,
    horizonColor: last.horizonColor,
    fogColor: last.fogColor,
    fogDensity: last.fogDensity,
    ambientIntensity: last.ambientIntensity,
    sunIntensity: last.sunIntensity,
  };
}
