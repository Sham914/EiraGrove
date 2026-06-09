/** Stylized resort layout inspired by the Eira Grove walkthrough video */

export type BuildingType =
  | "entrance-gate"
  | "reception-pavilion"
  | "gazebo"
  | "private-cottage"
  | "luxury-villa"
  | "signage";

export interface BuildingConfig {
  id: string;
  type: BuildingType;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  label?: string;
}

export interface PathConfig {
  id: string;
  points: [number, number, number][];
  width: number;
}

export interface VegetationZone {
  id: string;
  type: "forest" | "bamboo" | "garden" | "lawn";
  center: [number, number, number];
  radius: number;
  density: number;
}

export interface PoolConfig {
  position: [number, number, number];
  size: [number, number];
  rotation: number;
  edgeHeight: number;
}

export const terrainConfig = {
  size: [180, 180] as [number, number],
  center: [0, 40, 15] as [number, number, number],
  baseHeight: -1,
  slopeStrength: 0.045,
  maxHeight: 28,
};

export const poolConfig: PoolConfig = {
  position: [14, 0, -42],
  size: [16, 7],
  rotation: -0.15,
  edgeHeight: 0.4,
};

export const buildingsConfig: BuildingConfig[] = [
  {
    id: "main-gate",
    type: "entrance-gate",
    position: [0, 0, 22],
    rotation: [0, 0, 0],
    label: "Entrance",
  },
  {
    id: "reception",
    type: "reception-pavilion",
    position: [0, 0, 8],
    rotation: [0, 0, 0],
    label: "Reception",
  },
  {
    id: "gazebo",
    type: "gazebo",
    position: [-10, 0, -5],
    rotation: [0, 0.4, 0],
    label: "Garden Pavilion",
  },
  {
    id: "cottage-a",
    type: "private-cottage",
    position: [-8, 0, -18],
    rotation: [0, 0.3, 0],
    label: "Cottage I",
  },
  {
    id: "cottage-b",
    type: "private-cottage",
    position: [6, 0, -22],
    rotation: [0, -0.5, 0],
    label: "Cottage II",
  },
  {
    id: "cottage-c",
    type: "private-cottage",
    position: [-4, 0, -28],
    rotation: [0, 0.1, 0],
    label: "Cottage III",
  },
  {
    id: "villa-a",
    type: "luxury-villa",
    position: [-12, 0, -14],
    rotation: [0, 0.6, 0],
    label: "Villa I",
  },
  {
    id: "villa-b",
    type: "luxury-villa",
    position: [10, 0, -20],
    rotation: [0, -0.4, 0],
    label: "Villa II",
  },
  {
    id: "villa-c",
    type: "luxury-villa",
    position: [-2, 0, -32],
    rotation: [0, 0.2, 0],
    label: "Villa III",
  },
  {
    id: "sign-main",
    type: "signage",
    position: [4, 0, 18],
    rotation: [0, -0.3, 0],
  },
];

export const pathsConfig: PathConfig[] = [
  {
    id: "driveway",
    points: [
      [0, 0, 32],
      [0, 0, 34],
      [0, 0, 16],
      [0, 0, 10],
      [0, 0, 4],
    ],
    width: 3,
  },
  {
    id: "garden-main",
    points: [
      [0, 0, 4],
      [-3, 0, -2],
      [-6, 0, -8],
      [-4, 0, -14],
      [0, 0, -20],
    ],
    width: 2.2,
  },
  {
    id: "pool-walk",
    points: [
      [0, 0, -20],
      [5, 0, -28],
      [10, 0, -36],
      [14, 0, -42],
    ],
    width: 1.8,
  },
  {
    id: "villa-ascent",
    points: [
      [-4, 0, -14],
      [-8, 0, -16],
      [-10, 0, -14],
      [-12, 0, -14],
    ],
    width: 1.6,
  },
];

export const vegetationZones: VegetationZone[] = [
  { id: "entrance-garden", type: "garden", center: [5, 0, 20], radius: 8, density: 12 },
  { id: "left-forest", type: "forest", center: [-25, 4, -10], radius: 22, density: 35 },
  { id: "right-bamboo", type: "bamboo", center: [12, 5, -8], radius: 10, density: 28 },
  { id: "path-garden", type: "garden", center: [-8, 5, -8], radius: 12, density: 18 },
  { id: "hill-forest", type: "forest", center: [0, 10, -35], radius: 30, density: 40 },
  { id: "pool-lawn", type: "lawn", center: [10, 2, -38], radius: 14, density: 8 },
  { id: "valley-trees", type: "forest", center: [0, 0, -55], radius: 40, density: 25 },
];

export const mountainBackdropConfig = {
  peaks: [
    { position: [-35, 8, -70] as [number, number, number], scale: [40, 28, 40] as [number, number, number] },
    { position: [0, 12, -78] as [number, number, number], scale: [50, 35, 50] as [number, number, number] },
    { position: [30, 6, -72] as [number, number, number], scale: [38, 24, 38] as [number, number, number] },
  ],
};

export const heightmapConfig = {
  // URL relative to `public` or `src/assets`. Example placeholder; replace with actual heightmap file.
  url: "/assets/heightmaps/eira_grove_heightmap.png",
  worldSize: [180, 180] as [number, number],
  origin: [0, -25] as [number, number],
  heightRange: [-4, 28] as [number, number],
  // meters from the heightmap edge where we blend into procedural generator
  fallbackBlendDistance: 8,
};
