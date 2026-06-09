export type AppMode = "scroll" | "explore";

export type LocationId =
  | "infinity-pool"
  | "private-villas"
  | "nature-walks"
  | "mountain-views"
  | "reception"
  | "romance-zones";

export interface InteractionLocation {
  id: LocationId;
  label: string;
  headline: string;
  description: string;
  position: [number, number, number];
  icon?: string;
}

export const interactionLocations: InteractionLocation[] = [
  {
    id: "infinity-pool",
    label: "Infinity Pool",
    headline: "Edge of Infinity",
    description:
      "Horizon water merges with the Western Ghats — swim above the valley.",
    position: [14, 0, -42],
  },
  {
    id: "private-villas",
    label: "Private Villas",
    headline: "Elevated Sanctuaries",
    description:
      "Timber stilt villas with glass walls and decks suspended in the canopy.",
    position: [-12, 0, -14],
  },
  {
    id: "nature-walks",
    label: "Nature Walks",
    headline: "Garden Paths",
    description:
      "Flagstone trails through bamboo corridors and curated wilderness.",
    position: [-6, 0, -8],
  },
  {
    id: "mountain-views",
    label: "Mountain Views",
    headline: "Western Ghats Vista",
    description:
      "Layered peaks emerge through morning mist — a panorama of stillness.",
    position: [0, 0, -55],
  },
  {
    id: "reception",
    label: "Reception",
    headline: "Welcome Pavilion",
    description:
      "An open stone pavilion where your journey into Eira Grove begins.",
    position: [0, 0, 8],
  },
  {
    id: "romance-zones",
    label: "Romance Zones",
    headline: "Intimate Corners",
    description:
      "Secluded garden benches and evening-lit terraces for quiet moments.",
    position: [-10, 0, -5],
  },
];

export interface CinematicMoment {
  id: string;
  progressStart: number;
  progressEnd: number;
  title: string;
  subtitle: string;
}

export const cinematicMoments: CinematicMoment[] = [
  {
    id: "mountain-panorama",
    progressStart: 0,
    progressEnd: 0.1,
    title: "Rising from the Mist",
    subtitle: "The Western Ghats await",
  },
  {
    id: "pool-reveal",
    progressStart: 0.64,
    progressEnd: 0.72,
    title: "Infinity Revealed",
    subtitle: "Water meets sky",
  },
  {
    id: "sunset-reveal",
    progressStart: 0.68,
    progressEnd: 0.76,
    title: "Golden Hour",
    subtitle: "Light softens across the ridge",
  },
  {
    id: "night-activation",
    progressStart: 0.885,
    progressEnd: 0.935,
    title: "Under Starlight",
    subtitle: "The grove awakens at night",
  },
];
