export type SectionId =
  | "mountain-reveal"
  | "approach-entrance"
  | "reception"
  | "landscape-pathways"
  | "private-cottages"
  | "infinity-pool"
  | "luxury-villa"
  | "aerial-masterplan";

export interface SectionConfig {
  id: SectionId;
  label: string;
  scrollStart: number;
  scrollEnd: number;
  headline?: string;
  subheadline?: string;
  body?: string;
}

export const sectionsConfig: SectionConfig[] = [
  {
    id: "mountain-reveal",
    label: "Mountain Reveal",
    scrollStart: 0,
    scrollEnd: 0.125,
    headline: "Rising from the Mist",
    subheadline: "Kakkadampoyil",
    body: "Layered Western Ghats peaks emerge through morning fog — your sanctuary awaits above the valley.",
  },
  {
    id: "approach-entrance",
    label: "Approach",
    scrollStart: 0.125,
    scrollEnd: 0.25,
    headline: "The Approach",
    subheadline: "Arrive Slowly",
    body: "A cobblestone drive winds through stone walls and lush gardens toward the gate.",
  },
  {
    id: "reception",
    label: "Reception",
    scrollStart: 0.25,
    scrollEnd: 0.375,
    headline: "Welcome Home",
    subheadline: "Reception Pavilion",
    body: "Warm light spills from the open pavilion — the heart of Eira Grove.",
  },
  {
    id: "landscape-pathways",
    label: "Pathways",
    scrollStart: 0.375,
    scrollEnd: 0.5,
    headline: "Through the Grove",
    subheadline: "Garden Paths",
    body: "Flagstone steps and bamboo corridors weave through curated wilderness.",
  },
  {
    id: "private-cottages",
    label: "Cottages",
    scrollStart: 0.5,
    scrollEnd: 0.625,
    headline: "Private Retreats",
    subheadline: "Hillside Cottages",
    body: "Terracotta gables and white walls nestle into the slope — each a secluded haven.",
  },
  {
    id: "infinity-pool",
    label: "Infinity Pool",
    scrollStart: 0.625,
    scrollEnd: 0.75,
    headline: "Edge of Infinity",
    subheadline: "Horizon Pool",
    body: "Water merges with the mountain vista — a mirror to the sky.",
  },
  {
    id: "luxury-villa",
    label: "Luxury Villas",
    scrollStart: 0.75,
    scrollEnd: 0.875,
    headline: "Elevated Living",
    subheadline: "Stilt Villas",
    body: "Timber decks and glass walls float above the canopy with panoramic views.",
  },
  {
    id: "aerial-masterplan",
    label: "Masterplan",
    scrollStart: 0.875,
    scrollEnd: 1,
    headline: "Eira Grove",
    subheadline: "The Complete Vision",
    body: "From entrance to infinity edge — a living resort sculpted into the hillside.",
  },
];

export const totalScrollSections = sectionsConfig.length;

export function getSectionByProgress(progress: number): SectionConfig {
  const section =
    sectionsConfig.find(
      (s) => progress >= s.scrollStart && progress < s.scrollEnd
    ) ?? sectionsConfig[sectionsConfig.length - 1];
  return section;
}

export function getSectionProgress(
  progress: number,
  section: SectionConfig
): number {
  const range = section.scrollEnd - section.scrollStart;
  if (range <= 0) return 0;
  return Math.min(
    1,
    Math.max(0, (progress - section.scrollStart) / range)
  );
}
