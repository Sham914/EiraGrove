"use client";

import { SectionOverlay } from "@/components/SectionOverlay";
import { sectionsConfig } from "@/config/sections.config";
import type { SectionConfig } from "@/config/sections.config";
import { useScrollProgress } from "@/hooks/useScrollProgress";

function SectionLayer({ section }: { section: SectionConfig }) {
  const progress = useScrollProgress();
  return <SectionOverlay section={section} globalProgress={progress} />;
}

export function IntroSection() {
  return <SectionLayer section={sectionsConfig[0]} />;
}

export function MountainRevealSection() {
  return <SectionLayer section={sectionsConfig[1]} />;
}

export function ArrivalSection() {
  return <SectionLayer section={sectionsConfig[2]} />;
}

export function LandscapeSection() {
  return <SectionLayer section={sectionsConfig[3]} />;
}

export function InfinityPoolSection() {
  return <SectionLayer section={sectionsConfig[4]} />;
}

export function SunsetSection() {
  return <SectionLayer section={sectionsConfig[5]} />;
}

export function NightSection() {
  return <SectionLayer section={sectionsConfig[6]} />;
}

export function CtaSection() {
  return <SectionLayer section={sectionsConfig[7]} />;
}

export function AllSections() {
  return (
    <>
      {sectionsConfig.map((section) => (
        <SectionLayer key={section.id} section={section} />
      ))}
    </>
  );
}
