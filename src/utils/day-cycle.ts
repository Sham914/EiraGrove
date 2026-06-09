import { lerp, lerpColor, smoothstep } from "./math";
import type { DayCyclePhase } from "@/config/environment.config";

export interface DayCycleState {
  topColor: string;
  horizonColor: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  ambientIntensity: number;
  sunIntensity: number;
  sunColor: string;
  sunPosition: [number, number, number];
  poolLightIntensity: number;
  architecturalLightIntensity: number;
  starVisibility: number;
}

function lerpTuple(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function sampleDayCycle(
  phases: DayCyclePhase[],
  progress: number
): DayCycleState {
  const sorted = [...phases].sort(
    (a, b) => a.progressStart - b.progressStart
  );

  for (let i = 0; i < sorted.length; i++) {
    const phase = sorted[i];
    const next = sorted[i + 1];

    if (progress >= phase.progressStart && progress < phase.progressEnd) {
      if (!next) {
        return { ...phase };
      }

      const range = phase.progressEnd - phase.progressStart;
      const localT =
        range > 0 ? (progress - phase.progressStart) / range : 0;
      const blendStart = 0.25;
      const blendT = smoothstep(blendStart, 1, localT);

      if (blendT <= 0) {
        return { ...phase };
      }

      return {
        topColor: lerpColor(phase.topColor, next.topColor, blendT),
        horizonColor: lerpColor(
          phase.horizonColor,
          next.horizonColor,
          blendT
        ),
        fogColor: lerpColor(phase.fogColor, next.fogColor, blendT),
        fogNear: lerp(phase.fogNear, next.fogNear, blendT),
        fogFar: lerp(phase.fogFar, next.fogFar, blendT),
        ambientIntensity: lerp(
          phase.ambientIntensity,
          next.ambientIntensity,
          blendT
        ),
        sunIntensity: lerp(phase.sunIntensity, next.sunIntensity, blendT),
        sunColor: lerpColor(phase.sunColor, next.sunColor, blendT),
        sunPosition: lerpTuple(phase.sunPosition, next.sunPosition, blendT),
        poolLightIntensity: lerp(
          phase.poolLightIntensity,
          next.poolLightIntensity,
          blendT
        ),
        architecturalLightIntensity: lerp(
          phase.architecturalLightIntensity,
          next.architecturalLightIntensity,
          blendT
        ),
        starVisibility: lerp(
          phase.starVisibility,
          next.starVisibility,
          blendT
        ),
      };
    }
  }

  const last = sorted[sorted.length - 1];
  return { ...last };
}
