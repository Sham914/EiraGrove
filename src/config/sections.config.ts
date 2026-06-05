export type SectionId =
  | "intro"
  | "mountain-reveal"
  | "arrival"
  | "landscape"
  | "infinity-pool"
  | "sunset"
  | "night"
  | "cta";

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
    id: "intro",
    label: "Intro",
    scrollStart: 0,
    scrollEnd: 0.08,
    headline: "Eira Grove",
    subheadline: "Kakkadampoyil",
    body: "An invitation to arrive slowly.",
  },
  {
    id: "mountain-reveal",
    label: "Mountain Reveal",
    scrollStart: 0.08,
    scrollEnd: 0.22,
    headline: "Rising from the Mist",
    subheadline: "Western Ghats",
    body: "Layered peaks emerge through morning fog — a sanctuary suspended above the valley.",
  },
  {
    id: "arrival",
    label: "Arrival",
    scrollStart: 0.22,
    scrollEnd: 0.38,
    headline: "The Approach",
    subheadline: "Your journey begins",
    body: "Follow the winding path to where luxury meets the wilderness.",
  },
  {
    id: "landscape",
    label: "Landscape Journey",
    scrollStart: 0.38,
    scrollEnd: 0.52,
    headline: "Through the Grove",
    subheadline: "Nature's corridor",
    body: "Terraced paths weave through ancient canopy and curated gardens.",
  },
  {
    id: "infinity-pool",
    label: "Infinity Pool",
    scrollStart: 0.52,
    scrollEnd: 0.66,
    headline: "Edge of Infinity",
    subheadline: "Horizon pool",
    body: "Water merges with sky — a mirror to the mountains beyond.",
  },
  {
    id: "sunset",
    label: "Sunset",
    scrollStart: 0.66,
    scrollEnd: 0.78,
    headline: "Golden Hour",
    subheadline: "As day softens",
    body: "Warm light washes the ridgelines in amber and rose.",
  },
  {
    id: "night",
    label: "Night Experience",
    scrollStart: 0.78,
    scrollEnd: 0.92,
    headline: "Under Starlight",
    subheadline: "Evening sanctuary",
    body: "Soft illumination guides you through an intimate nocturnal landscape.",
  },
  {
    id: "cta",
    label: "Book",
    scrollStart: 0.92,
    scrollEnd: 1,
    headline: "Your Stay Awaits",
    subheadline: "Reserve your experience",
    body: "Connect with us to begin planning your escape to Eira Grove.",
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
