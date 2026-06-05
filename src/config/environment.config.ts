export interface ResortMarker {
  id: string;
  label: string;
  position: [number, number, number];
  description: string;
}

export const resortMarkersConfig: ResortMarker[] = [
  {
    id: "main-lodge",
    label: "Main Lodge",
    position: [0, 2.5, -12],
    description: "Central reception and dining pavilion",
  },
  {
    id: "villa-cluster",
    label: "Villa Cluster",
    position: [-6, 2, -18],
    description: "Private hillside accommodations",
  },
  {
    id: "wellness",
    label: "Wellness Pavilion",
    position: [5, 2, -22],
    description: "Spa and meditation spaces",
  },
];

export interface SkyPhase {
  id: string;
  progressStart: number;
  progressEnd: number;
  topColor: string;
  horizonColor: string;
  fogColor: string;
  fogDensity: number;
  ambientIntensity: number;
  sunIntensity: number;
}

export const skyPhasesConfig: SkyPhase[] = [
  {
    id: "dawn",
    progressStart: 0,
    progressEnd: 0.22,
    topColor: "#1a2332",
    horizonColor: "#4a5568",
    fogColor: "#2d3748",
    fogDensity: 0.035,
    ambientIntensity: 0.35,
    sunIntensity: 0.6,
  },
  {
    id: "morning",
    progressStart: 0.22,
    progressEnd: 0.52,
    topColor: "#87CEEB",
    horizonColor: "#E8D5B7",
    fogColor: "#B8C5D6",
    fogDensity: 0.022,
    ambientIntensity: 0.55,
    sunIntensity: 1.0,
  },
  {
    id: "afternoon",
    progressStart: 0.52,
    progressEnd: 0.66,
    topColor: "#6BB3D9",
    horizonColor: "#F5E6C8",
    fogColor: "#A8C4D4",
    fogDensity: 0.018,
    ambientIntensity: 0.6,
    sunIntensity: 1.1,
  },
  {
    id: "sunset",
    progressStart: 0.66,
    progressEnd: 0.78,
    topColor: "#2D1B4E",
    horizonColor: "#E87B4A",
    fogColor: "#C4785A",
    fogDensity: 0.025,
    ambientIntensity: 0.45,
    sunIntensity: 0.7,
  },
  {
    id: "night",
    progressStart: 0.78,
    progressEnd: 1,
    topColor: "#0D1117",
    horizonColor: "#1a2744",
    fogColor: "#0f1623",
    fogDensity: 0.03,
    ambientIntensity: 0.15,
    sunIntensity: 0.05,
  },
];
