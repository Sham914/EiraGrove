export interface DayCyclePhase {
  id: string;
  progressStart: number;
  progressEnd: number;
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

export const dayCycleConfig: DayCyclePhase[] = [
  {
    id: "day",
    progressStart: 0,
    progressEnd: 0.42,
    topColor: "#76A9D8",
    horizonColor: "#DCECF6",
    fogColor: "#C0D2DF",
    fogNear: 22,
    fogFar: 100,
    ambientIntensity: 0.66,
    sunIntensity: 1.12,
    sunColor: "#FFF5E4",
    sunPosition: [30, 48, 20],
    poolLightIntensity: 0,
    architecturalLightIntensity: 0.12,
    starVisibility: 0,
  },
  {
    id: "golden-hour",
    progressStart: 0.42,
    progressEnd: 0.68,
    topColor: "#8C7BB7",
    horizonColor: "#F2C56A",
    fogColor: "#D8AD80",
    fogNear: 18,
    fogFar: 88,
    ambientIntensity: 0.5,
    sunIntensity: 0.9,
    sunColor: "#FFC06A",
    sunPosition: [-28, 24, 16],
    poolLightIntensity: 0.18,
    architecturalLightIntensity: 0.45,
    starVisibility: 0,
  },
  {
    id: "sunset",
    progressStart: 0.68,
    progressEnd: 0.84,
    topColor: "#4B315F",
    horizonColor: "#E87B4A",
    fogColor: "#8C634D",
    fogNear: 15,
    fogFar: 76,
    ambientIntensity: 0.33,
    sunIntensity: 0.42,
    sunColor: "#FF7A49",
    sunPosition: [-36, 10, 12],
    poolLightIntensity: 0.62,
    architecturalLightIntensity: 0.82,
    starVisibility: 0.14,
  },
  {
    id: "night",
    progressStart: 0.84,
    progressEnd: 1,
    topColor: "#0A0E18",
    horizonColor: "#121B30",
    fogColor: "#0C1220",
    fogNear: 12,
    fogFar: 65,
    ambientIntensity: 0.12,
    sunIntensity: 0.02,
    sunColor: "#162345",
    sunPosition: [0, -10, 0],
    poolLightIntensity: 1.15,
    architecturalLightIntensity: 1.0,
    starVisibility: 0.82,
  },
];

export interface ResortMarker {
  id: string;
  label: string;
  position: [number, number, number];
  description: string;
}

export const resortMarkersConfig: ResortMarker[] = [
  {
    id: "reception",
    label: "Reception",
    position: [0, 0, 8],
    description: "Main pavilion and arrival lounge",
  },
  {
    id: "pool",
    label: "Infinity Pool",
    position: [14, 0, -42],
    description: "Horizon-edge pool overlooking the valley",
  },
  {
    id: "villas",
    label: "Luxury Villas",
    position: [-12, 0, -14],
    description: "Elevated timber villas with panoramic decks",
  },
];
